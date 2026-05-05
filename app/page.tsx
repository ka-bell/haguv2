import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function EntryPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-between px-10 pb-16 pt-24">
      <div className="text-center">
        <h1 className="text-5xl font-black tracking-tight text-[#2D1012]">HAGU</h1>
        <p className="mt-3 text-sm text-[#8a8a96]">The app for unconventional companionship.</p>
      </div>

      <div className="w-full space-y-3">
        <Link href="/login" className="block">
          <Button size="lg" className="w-full">
            Log in
          </Button>
        </Link>
        <Link href="/select-role" className="block">
          <Button variant="outline" size="lg" className="w-full">
            Create account
          </Button>
        </Link>
      </div>
    </main>
  )
}
