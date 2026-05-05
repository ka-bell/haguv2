"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { TopGlassHeader } from "@/components/ui/top-glass-header"

type Role = "HAGEE" | "HAGU"

export default function SelectRolePage() {
  const [role, setRole] = useState<Role | null>(null)
  const router = useRouter()

  const continueFlow = () => {
    if (role === "HAGU") {
      router.push("/onboarding/hagu")
      return
    }
    router.push("/onboarding")
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-[#FCFFFF] px-6 pb-12 pt-6">
      <TopGlassHeader
        title="HAGU"
        leftSlot={
          <Link href="/" aria-label="Back to home">
            <ChevronLeft className="size-4 text-[#2D1012]" />
          </Link>
        }
        rightSlot={
          <Link href="/" aria-label="Close">
            <X className="size-4 text-[#2D1012]" />
          </Link>
        }
      />

      <h1 className="mt-6 text-3xl font-semibold text-[#2D1012]">Pick one</h1>
      <p className="mt-1 text-sm text-[#8a8a96]">How do you want to use HAGU?</p>

      <div className="mt-8 space-y-4">
        <button type="button" onClick={() => setRole("HAGEE")} className="w-full text-left">
          <Card className={role === "HAGEE" ? "border-2 border-[#5bbfb5] bg-[#f0fcfa]" : ""}>
            <CardTitle>I am a HAGEE</CardTitle>
            <CardDescription>Book a HAGU for social activities and companionship.</CardDescription>
            <p className="mt-3 text-xs font-semibold text-[#5bbfb5]">Buyer</p>
          </Card>
        </button>
        <button type="button" onClick={() => setRole("HAGU")} className="w-full text-left">
          <Card className={role === "HAGU" ? "border-2 border-[#5bbfb5] bg-[#f0fcfa]" : ""}>
            <CardTitle>I am a HAGU</CardTitle>
            <CardDescription>Offer my time and receive bookings.</CardDescription>
            <p className="mt-3 text-xs font-semibold text-[#8a8a96]">Provider</p>
          </Card>
        </button>
      </div>

      <Button size="lg" className="mt-6 w-full" disabled={!role} onClick={continueFlow}>
        Start onboarding
      </Button>
    </main>
  )
}
