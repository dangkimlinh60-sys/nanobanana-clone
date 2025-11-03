import { NextResponse } from 'next/server'

// Helper to read a File (from formData) into base64 string
async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return buffer.toString('base64')
}

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const prompt = (form.get('prompt') as string) || ''
    const image = form.get('image') as File | null

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })
    }
    if (!image) {
      return NextResponse.json({ error: 'Missing image' }, { status: 400 })
    }

    const apiKey = process.env.ARK_API_KEY
    const model = process.env.ARK_MODEL_ID || 'ep-20251103135155-sdk24'
    const baseUrl = process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3'

    // Convert image to base64 data URL
    const base64 = await fileToBase64(image)
    const mime = (image as any).type || 'image/png'
    const dataUrl = `data:${mime};base64,${base64}`

    // Prepare a best-effort payload for Ark chat.completions with multimodal content.
    // NOTE: Depending on your specific endpoint, you may need to adjust the content schema.
    const body: any = {
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an image editing assistant. Given a user instruction and a reference image, return the edited image as base64.'
        },
        {
          role: 'user',
          // Ark error indicates supported types: text, image_url, video_url
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: dataUrl } }
          ]
        }
      ]
    }

    // If no API key is configured, return the original image as a mock to keep local dev unblocked.
    if (!apiKey) {
      return NextResponse.json({ images: [dataUrl], mock: true })
    }

    let res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    })

    // Fallback: some providers expect image_url to be a string instead of an object
    if (!res.ok && res.status === 400) {
      try {
        const errText = await res.text()
        const altBody = JSON.parse(JSON.stringify(body))
        // swap to string variant
        const userMsg = altBody.messages[1]
        if (Array.isArray(userMsg.content)) {
          for (const part of userMsg.content) {
            if (part.type === 'image_url') {
              part.image_url = dataUrl
            }
          }
        }
        res = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify(altBody)
        })
        if (!res.ok) {
          const text = await res.text()
          return NextResponse.json({ error: 'Upstream error', detail: errText + '\n---\n' + text }, { status: 502 })
        }
      } catch (e) {
        // Could not retry cleanly
        return NextResponse.json({ error: 'Upstream error', detail: String(e) }, { status: 502 })
      }
    }

    const json = (await res.json()) as any

    // Try to extract base64 images from the response. This is provider-specific; we handle a few shapes.
    const images: string[] = []
    try {
      const choice = json.choices?.[0]?.message?.content
      if (Array.isArray(choice)) {
        for (const part of choice) {
          // Common keys seen across providers
          const b64 = part.image_base64 || part.b64_json || null
          // image_url may be a string or an object { url }
          let url: string | null = null
          if (typeof part.image_url === 'string') url = part.image_url
          else if (part.image_url && typeof part.image_url.url === 'string') url = part.image_url.url

          if (b64) images.push(`data:image/png;base64,${b64}`)
          else if (url && typeof url === 'string' && url.startsWith('data:')) images.push(url)
        }
      } else if (typeof choice === 'string') {
        // Fallback: try to find an embedded data URL in plain text
        const m = choice.match(/data:image\/[A-Za-z0-9.+-]+;base64,[A-Za-z0-9+/=]+/)
        if (m) images.push(m[0])
      }
    } catch {
      // ignore parse errors
    }

    // If nothing extracted, return mock (original) image as a graceful fallback.
    if (images.length === 0) {
      return NextResponse.json({ images: [dataUrl], fallback: true })
    }

    return NextResponse.json({ images })
  } catch (err) {
    return NextResponse.json({ error: 'Server error', detail: String(err) }, { status: 500 })
  }
}
