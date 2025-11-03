import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { headers } from 'next/headers'

// Server-side Supabase client for reading the current session/user in RSC.
// We only implement cookies.get here to avoid mutating cookies from a Server Component.
export async function createSupabaseServerClient() {
  // Read cookie header once (no usage of cookies() to avoid Next 16 sync-dynamic-apis warning)
  let headerCookie = ''
  try {
    const hdrs = await headers()
    if (hdrs && typeof (hdrs as any).get === 'function') {
      headerCookie = (hdrs as any).get('cookie') || ''
    }
  } catch {}

  function getCookieValue(name: string): string | undefined {
    const parts = String(headerCookie).split(/; */)
    for (const p of parts) {
      const idx = p.indexOf('=')
      if (idx === -1) continue
      const k = decodeURIComponent(p.slice(0, idx).trim())
      if (k === name) return decodeURIComponent(p.slice(idx + 1))
    }
    return undefined
  }

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return getCookieValue(name)
        },
        // no-op setters to satisfy types; we don't write cookies in server components
        set(_name: string, _value: string, _options: CookieOptions) {},
        remove(_name: string, _options: CookieOptions) {},
      },
    }
  )
}

// Best-effort fallback: try to read user email from Supabase auth cookie without network calls.
// Supabase typically stores a JSON session under cookie name like `sb-<project-ref>-auth-token`.
export async function getUserEmailFromCookies(): Promise<string | null> {
  let headerCookie = ''
  try {
    const hdrs = await headers()
    if (hdrs && typeof (hdrs as any).get === 'function') {
      headerCookie = (hdrs as any).get('cookie') || ''
    }
  } catch {}

  const pairs = String(headerCookie)
    .split(/; */)
    .map((p) => {
      const i = p.indexOf('=')
      if (i === -1) return null
      return { name: decodeURIComponent(p.slice(0, i).trim()), value: decodeURIComponent(p.slice(i + 1)) }
    })
    .filter(Boolean) as { name: string; value: string }[]

  // Consider multiple possible cookie names from Supabase across versions
  const candidates = pairs.filter((c) => /^(sb-|supabase-)/.test(c.name) || /auth-token/i.test(c.name))
  for (const c of candidates) {
    const raw = c.value
    // JSON shape
    try {
      const obj = JSON.parse(raw)
      const token = obj?.access_token || obj?.currentSession?.access_token || obj?.accessToken || ''
      const email = decodeJwtEmail(token)
      if (email) return email
    } catch {}
    // JWT directly
    const email = decodeJwtEmail(raw)
    if (email) return email
  }
  return null
}

function decodeJwtEmail(token: string): string | null {
  if (!token || token.split('.').length < 2) return null
  try {
    const payload = token.split('.')[1]
    const json = JSON.parse(Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'))
    return json?.email || json?.user_metadata?.email || null
  } catch {
    return null
  }
}

// Quick check whether any Supabase auth cookie exists
export async function hasSupabaseAuthCookie(): Promise<boolean> {
  let headerCookie = ''
  try {
    const hdrs = await headers()
    if (hdrs && typeof (hdrs as any).get === 'function') {
      headerCookie = (hdrs as any).get('cookie') || ''
    }
  } catch {}
  return /(\bsb-[^=]+=|\bsupabase-[^=]+=|auth-token)/i.test(String(headerCookie))
}
