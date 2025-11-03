export const dynamic = "force-dynamic"

import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { createSupabaseServerClient, getUserEmailFromCookies, hasSupabaseAuthCookie } from "@/lib/supabase/server"
export const revalidate = 0

export default async function Header() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  // Fallback: if Supabase client couldn't resolve the user (e.g., network blocked),
  // try to read email from auth cookie directly so header UI can reflect login state.
  const fallbackEmail = user ? null : await getUserEmailFromCookies()
  const hasAuth = user || fallbackEmail ? true : await hasSupabaseAuthCookie()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍌</span>
          <span className="text-xl font-bold text-foreground">Nano Banana</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#editor"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Image Editor
          </Link>
          <Link
            href="#showcase"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Showcase
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Reviews
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {hasAuth ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                已登录{(user?.email || fallbackEmail) ? `：${user?.email || fallbackEmail}` : ''}
              </span>
              <a
                href="/auth/logout"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                退出登录
              </a>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <a
                href="/auth/login"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                使用 GitHub 登录
              </a>
              <a
                href="/auth/login/google"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                使用 Google 登录
              </a>
            </div>
          )}
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Launch Now
          </Button>
        </div>
      </div>
    </header>
  )
}
