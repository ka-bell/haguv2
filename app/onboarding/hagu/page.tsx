import Link from "next/link"
import { ChevronLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TopGlassHeader } from "@/components/ui/top-glass-header"

export default function HaguOnboardingPage() {
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

      <h1 className="mt-6 text-3xl font-semibold text-[#2D1012]">Build your profile</h1>
      <p className="mt-1 text-sm text-[#8a8a96]">The basics. This is what clients will see first.</p>

      <div className="mt-8 flex flex-col items-center">
        <div className="relative flex size-28 items-center justify-center rounded-full border-2 border-dashed border-[#D0F1F0] bg-[#D0F1F0]/40">
          <span className="text-[#8a8a96]">Photo</span>
          <button className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-[#2D1012] text-white">+</button>
        </div>
        <p className="mt-3 text-sm text-[#2D1012]">Upload profile photo</p>
      </div>

      <div className="mt-8 space-y-4">
        <Input label="Display name" defaultValue="Anouk V." />
        <Input label="Tagline" placeholder="e.g. Art lover & great listener" />
        <Input label="Age" defaultValue="28" />
        <Input label="Gender" defaultValue="Male" />
      </div>

      <div className="mt-8">
        <Button size="lg" className="w-full">
          Next: The real you
        </Button>
      </div>
    </main>
  )
}
