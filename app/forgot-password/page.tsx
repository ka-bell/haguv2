import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageActions, PageContent, PageShell } from "@/components/ui/page-shell"
import { TopGlassHeader } from "@/components/ui/top-glass-header"

export default function ForgotPasswordPage() {
  return (
    <PageShell>
      <TopGlassHeader
        leftSlot={
          <Link href="/login" aria-label="Back to login">
            <ChevronLeft className="size-4 text-[#2D1012]" />
          </Link>
        }
      />

      <PageContent>
        <h1 className="mt-6 text-3xl font-semibold text-[#2D1012]">Forgot password</h1>
        <p className="mt-2 text-sm text-[#8a8a96]">Enter your email and we will send a reset link.</p>

        <div className="mt-8">
          <Input label="Email address" placeholder="Enter your email" />
        </div>
      </PageContent>

      <PageActions>
        <Button size="lg" className="w-full">
          Send reset link
        </Button>
      </PageActions>
    </PageShell>
  )
}
