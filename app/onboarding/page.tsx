import Link from "next/link"
import { ChevronLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TopGlassHeader } from "@/components/ui/top-glass-header"

export default function HageeOnboardingPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-[#FCFFFF] px-6 pb-12 pt-6">
      <TopGlassHeader
        title="HAGU"
        leftSlot={
          <Link href="/select-role" aria-label="Back to role selection">
            <ChevronLeft className="size-4 text-[#2D1012]" />
          </Link>
        }
        rightSlot={
          <Link href="/" aria-label="Close">
            <X className="size-4 text-[#2D1012]" />
          </Link>
        }
      />

      <Card className="mt-6 overflow-hidden p-0">
        <div className="h-56 bg-gradient-to-b from-[#D0F1F0] to-[#FEFFFF]" />
        <div className="space-y-3 p-6">
          <p className="text-xs text-[#8a8a96]">1 of 3</p>
          <h1 className="text-2xl font-semibold text-[#2D1012]">Real people. Real time together.</h1>
          <p className="text-sm text-[#8a8a96]">
            HAGU connects you with thoughtful companions for shared experiences: coffee, a walk, or a meaningful conversation.
          </p>
          <div className="flex gap-2 pt-1">
            <span className="h-1 w-6 rounded-full bg-[#5bbfb5]" />
            <span className="h-1 w-2 rounded-full bg-black/15" />
            <span className="h-1 w-2 rounded-full bg-black/15" />
          </div>
        </div>
      </Card>

      <div className="mt-5 space-y-3">
        <Button size="lg" className="w-full">
          Continue
        </Button>
        <p className="text-center text-sm text-[#8a8a96]">
          Already have an account? <Link href="/login" className="font-medium text-[#2D1012]">Log in</Link>
        </p>
      </div>
    </main>
  )
}
