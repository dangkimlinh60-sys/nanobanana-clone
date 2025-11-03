export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const origin = url.origin

  // Prepare a plain response to collect cookies set by Supabase during signInWithOAuth
  const cookieStagingResponse = new NextResponse(null)

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = request.headers.get('cookie') ?? ''
          const match = cookie.match(new RegExp(`${name}=([^;]+)`))
          return match ? decodeURIComponent(match[1]) : undefined
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStagingResponse.cookies.set({ name, value, ...options, path: '/' })
        },
        remove(name: string, options: CookieOptions) {
          cookieStagingResponse.cookies.set({ name, value: '', ...options, maxAge: 0, path: '/' })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error || !data?.url) {
    return NextResponse.json({ error: error?.message || 'Failed to start OAuth' }, { status: 400 })
  }

  // Redirect to provider auth URL and carry forward cookies set during sign-in (e.g., PKCE code verifier)
  const html = `<!doctype html><html><head>
    <meta http-equiv="refresh" content="0; url=${data.url}">
    <script>location.replace(${JSON.stringify(data.url)});</script>
  </head><body>If you are not redirected, <a href="${data.url}">continue to GitHub</a>.</body></html>`
  const resp = new NextResponse(null, {
    status: 302,
    headers: { Location: data.url, 'Cache-Control': 'no-store' },
  })
  for (const c of cookieStagingResponse.cookies.getAll()) {
    resp.cookies.set(c)
  }
  return resp
}
