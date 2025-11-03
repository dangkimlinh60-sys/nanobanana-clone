import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const origin = url.origin
  const response = new NextResponse(null, { status: 302, headers: { Location: `${origin}/` } })

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
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options, maxAge: 0 })
        },
      },
    }
  )

  await supabase.auth.signOut()
  return response
}

