import Link from "next/link"
import { Apple, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TopGlassHeader } from "@/components/ui/top-glass-header"

export default function LoginPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-[#FCFFFF] px-6 pb-12 pt-6">
      <TopGlassHeader
        title="HAGU"
        leftSlot={
          <Link href="/" aria-label="Back to home">
            <ChevronLeft className="size-4 text-[#2D1012]" />
          </Link>
        }
      />

      <h1 className="mt-6 text-3xl font-semibold text-[#2D1012]">Welcome back</h1>
      <p className="mt-1 text-sm text-[#8a8a96]">Enter your details to sign in.</p>

      <div className="mt-8 space-y-4">
        <Input label="Email" placeholder="alex@hagu.app" />
        <Input label="Password" type="password" placeholder="password" />
      </div>

      <div className="mt-8 space-y-3">
        <Button size="lg" className="w-full">
          Sign in
        </Button>
        <Link href="/forgot-password" className="block text-center text-sm text-[#8a8a96]">
          Forgot password?
        </Link>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <div className="h-px flex-1 bg-black/10" />
        <span className="text-xs text-[#8a8a96]">Or continue with</span>
        <div className="h-px flex-1 bg-black/10" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" className="flex h-12 items-center justify-center rounded-xl border border-black/10 bg-white text-sm text-[#2D1012]">
          Google
        </button>
        <button type="button" className="flex h-12 items-center justify-center rounded-xl border border-black/10 bg-white text-sm text-[#2D1012]">
          <Apple className="size-4" />
        </button>
      </div>
    </main>
  )
}
