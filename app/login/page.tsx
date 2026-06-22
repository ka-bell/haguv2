"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageActions, PageContent, PageShell } from "@/components/ui/page-shell"
import { TopGlassHeader } from "@/components/ui/top-glass-header"
import { ROUTES } from "@/lib/routes"
import { loginAsReturningUser } from "@/lib/session"

export default function LoginPage() {
  const router = useRouter()

  const handleSignIn = () => {
    loginAsReturningUser("HAGEE")
    router.push(ROUTES.discover)
  }

  return (
    <PageShell>
      <TopGlassHeader
        leftSlot={
          <Link href="/" aria-label="Back to home">
            <ChevronLeft className="size-4 text-[#2D1012]" />
          </Link>
        }
      />

      <PageContent>
        <h1 className="mt-6 text-3xl font-semibold text-[#2D1012]">Welcome back</h1>
        <p className="mt-1 text-sm text-[#8a8a96]">Enter your details to sign in.</p>

        <div className="mt-8 space-y-4">
          <Input label="Email" placeholder="alex@hagu.app" />
          <Input label="Password" type="password" placeholder="password" />
        </div>
      </PageContent>

      <PageActions>
        <Button size="lg" className="w-full" onClick={handleSignIn}>
          Sign in
        </Button>
        <Link href="/forgot-password" className="block text-center text-sm text-[#8a8a96]">
          Forgot password?
        </Link>

        <div className="mt-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-black/10" />
          <span className="text-xs text-[#8a8a96]">Or continue with</span>
          <div className="h-px flex-1 bg-black/10" />
        </div>

        <div className="mt-4">
          <button type="button" className="gsi-material-button" aria-label="Sign in with Google" onClick={handleSignIn}>
            <div className="gsi-material-button-state" />
            <div className="gsi-material-button-content-wrapper">
              <div className="gsi-material-button-icon">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" className="block">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
              </div>
              <span className="gsi-material-button-contents">Sign in with Google</span>
              <span className="sr-only">Sign in with Google</span>
            </div>
          </button>
        </div>
      </PageActions>
    </PageShell>
  )
}
