"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail } from "lucide-react"
import { HaguFlowScreen } from "@/components/hagu/hagu-flow-screen"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/lib/routes"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <HaguFlowScreen
        onBack={() => router.push(ROUTES.login)}
        closeHref={ROUTES.login}
        ctaLabel="Back to login"
        onCta={() => router.push(ROUTES.login)}
      >
        <div className="flex flex-col items-center space-y-6 pt-8 text-center">
          <div className="flex size-20 items-center justify-center rounded-[24px] bg-[rgba(208,241,240,0.4)]">
            <Mail className="size-9 text-[#5BBFB5]" />
          </div>
          <div>
            <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">Check your inbox</h1>
            <p className="mt-2 text-sm font-light text-[#8A8A96]">
              We sent a password reset link to your email. It may take a minute to arrive.
            </p>
          </div>
        </div>
      </HaguFlowScreen>
    )
  }

  return (
    <HaguFlowScreen
      onBack={() => router.push(ROUTES.login)}
      closeHref={ROUTES.login}
      ctaLabel="Send reset link"
      onCta={() => setSent(true)}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">Forgot password</h1>
          <p className="mt-1 text-sm font-light text-[#8A8A96]">Enter your email and we will send a reset link.</p>
        </div>

        <Input label="Email address" placeholder="alex@hagu.app" type="email" />

        <Link href={ROUTES.login} className="block text-center text-sm text-[#8A8A96]">
          Back to login
        </Link>
      </div>
    </HaguFlowScreen>
  )
}
