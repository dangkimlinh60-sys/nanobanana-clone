"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, Sparkles } from "lucide-react"

export function Editor() {
  const [prompt, setPrompt] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [history, setHistory] = useState<
    { id: string; prompt: string; images: string[]; ts: number }
  >([])

  const STORAGE_KEY = "nb_recent_generations"

  // Load recent generations from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setHistory(parsed)
      }
    } catch {
      // ignore corrupted storage
    }
  }, [])

  const pushHistory = (item: { id: string; prompt: string; images: string[]; ts: number }) => {
    const next = [item, ...history].slice(0, 10) // keep last 10
    setHistory(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // storage quota issues ignored silently
    }
  }

  const clearHistory = () => {
    if (!confirm("清空最近生成记录？")) return
    setHistory([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  // Call our Next.js API with the prompt + image and show returned images
  const handleGenerate = async () => {
    if (!selectedFile) {
      alert("请先上传图片（Add Image）")
      return
    }
    if (!prompt.trim()) {
      alert("请先填写 Main Prompt")
      return
    }
    try {
      setIsGenerating(true)
      const form = new FormData()
      form.append("prompt", prompt)
      form.append("image", selectedFile)

      const res = await fetch("/api/generate", {
        method: "POST",
        body: form,
      })
      const json = await res.json()
      if (!res.ok) {
        console.error("Generation failed", json)
        const detail = typeof json?.detail === "string" ? json.detail : ""
        const msg = (json?.error || "生成失败") + (detail ? "\n" + detail.slice(0, 500) : "")
        alert(msg)
        return
      }
      const imgs: string[] = Array.isArray(json?.images) ? json.images : []
      setImages(imgs)
      // Save to recent history for quick comparisons
      if (imgs.length > 0) {
        pushHistory({ id: String(Date.now()), prompt, images: imgs, ts: Date.now() })
      }
    } catch (err) {
      console.error(err)
      alert("网络或服务器错误")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section id="editor" className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4 text-balance">
            Try The AI Editor
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Experience the power of nano-banana's natural language image editing. Transform any photo with simple text
            commands.
          </p>
        </div>

        <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              Prompt Engine
            </h3>

            <div className="space-y-6">
              <div>
                <Label htmlFor="image-upload" className="mb-2 block text-sm font-medium">
                  Reference Image
                </Label>
                <div className="relative">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Upload className="h-10 w-10 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Add Image</span>
                        <span className="text-xs text-muted-foreground">Max 50MB</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="prompt" className="mb-2 block text-sm font-medium">
                  Main Prompt
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="A futuristic city powered by nano technology, golden hour lighting, ultra detailed..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-32 resize-none"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
                size="lg"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {isGenerating ? "Generating..." : "Generate Now"}
              </Button>
            </div>
          </Card>

          {/* Output Section */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Output Gallery
            </h3>

            {images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {images.map((src, idx) => (
                  <img key={idx} src={src} alt={`Generated ${idx + 1}`} className="w-full h-auto rounded" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-border rounded-lg bg-secondary/30">
                <div className="text-center">
                  <div className="mb-4 text-6xl">🖼️</div>
                  <h4 className="text-lg font-semibold mb-2">Ready for Instant Generation</h4>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Enter your prompt and unleash the power
                  </p>
                </div>
              </div>
            )}

            {/* Recent history for quick comparisons */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-md font-semibold">Recent Generations</h4>
                <Button variant="outline" size="sm" onClick={clearHistory} disabled={history.length === 0}>
                  Clear
                </Button>
              </div>
              {history.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {history.map((h) => (
                    <button
                      key={h.id}
                      className="group text-left"
                      title={h.prompt}
                      onClick={() => {
                        setImages(h.images)
                        setPrompt(h.prompt)
                      }}
                    >
                      <img
                        src={h.images[0]}
                        alt="history thumb"
                        className="w-full h-28 object-cover rounded border border-border hover:opacity-90"
                      />
                      <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {h.prompt}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">暂无历史记录</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
