"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { GoogleSignInButton } from "@/components/hagu/google-sign-in-button"
import { HaguFlowScreen } from "@/components/hagu/hagu-flow-screen"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/lib/routes"
import { loginAsReturningUser } from "@/lib/session"

export default function LoginPage() {
  const router = useRouter()

  const handleSignIn = () => {
    loginAsReturningUser("HAGEE")
    router.push(ROUTES.discover)
    router.refresh()
  }

  return (
    <HaguFlowScreen
      onBack={() => router.push(ROUTES.entry)}
      closeHref={ROUTES.entry}
      ctaLabel="Sign in"
      onCta={handleSignIn}
      footer={
        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-black/[0.08]" />
            <span className="text-xs text-[#8A8A96]">Or continue with</span>
            <div className="h-px flex-1 bg-black/[0.08]" />
          </div>
          <GoogleSignInButton onClick={handleSignIn} />
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">Welcome back</h1>
          <p className="mt-1 text-sm font-light text-[#8A8A96]">Enter your details to sign in.</p>
        </div>

        <div className="space-y-4">
          <Input label="Email" placeholder="alex@hagu.app" />
          <Input label="Password" type="password" placeholder="Password" />
        </div>

        <Link href={ROUTES.forgotPassword} className="block text-center text-sm text-[#8A8A96]">
          Forgot password?
        </Link>
      </div>
    </HaguFlowScreen>
  )
}
