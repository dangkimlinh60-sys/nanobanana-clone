export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const origin = url.origin

  // Stage cookies set during signInWithOAuth (e.g., PKCE code_verifier)
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
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
      // You may customize scopes if needed:
      // scopes: 'email profile openid',
    },
  })

  if (error || !data?.url) {
    return NextResponse.json({ error: error?.message || 'Failed to start OAuth (Google)' }, { status: 400 })
  }

  // Perform a 302 redirect and forward staged cookies
  const resp = new NextResponse(null, {
    status: 302,
    headers: { Location: data.url, 'Cache-Control': 'no-store' },
  })
  for (const c of cookieStagingResponse.cookies.getAll()) {
    resp.cookies.set(c)
  }
  return resp
}

