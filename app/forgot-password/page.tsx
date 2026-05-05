import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TopGlassHeader } from "@/components/ui/top-glass-header"

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-[#FCFFFF] px-6 pb-12 pt-6">
      <TopGlassHeader
        title="HAGU"
        leftSlot={
          <Link href="/login" aria-label="Back to login">
            <ChevronLeft className="size-4 text-[#2D1012]" />
          </Link>
        }
      />

      <h1 className="mt-6 text-3xl font-semibold text-[#2D1012]">Forgot password</h1>
      <p className="mt-2 text-sm text-[#8a8a96]">Enter your email and we will send a reset link.</p>

      <div className="mt-8">
        <Input label="Email address" placeholder="Enter your email" />
      </div>

      <Button size="lg" className="mt-6 w-full">
        Send reset link
      </Button>
    </main>
  )
}
