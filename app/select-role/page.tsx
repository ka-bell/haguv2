"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { PageActions, PageContent, PageShell } from "@/components/ui/page-shell"
import { TopGlassHeader } from "@/components/ui/top-glass-header"
import { ROUTES } from "@/lib/routes"
import { setPendingRole } from "@/lib/session"

type Role = "HAGEE" | "HAGU"

export default function SelectRolePage() {
  const [role, setRole] = useState<Role | null>(null)
  const router = useRouter()

  const continueFlow = () => {
    if (!role) return
    setPendingRole(role)

    if (role === "HAGU") {
      router.push(ROUTES.onboardingHagu)
      return
    }
    router.push(ROUTES.onboardingHagee)
  }

  return (
    <PageShell>
      <TopGlassHeader
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

      <PageContent>
        <h1 className="mt-6 text-3xl font-semibold text-[#2D1012]">Pick one</h1>
        <p className="mt-1 text-sm text-[#8a8a96]">How do you want to use HAGU?</p>

        <div className="mt-8 space-y-4">
          <button type="button" onClick={() => setRole("HAGEE")} className="w-full text-left">
            <Card className={role === "HAGEE" ? "border-2 border-hagu-accent bg-hagu-accent/40" : ""}>
              <CardTitle>I am a HAGEE</CardTitle>
              <CardDescription>Book a HAGU for social activities and companionship.</CardDescription>
            </Card>
          </button>
          <button type="button" onClick={() => setRole("HAGU")} className="w-full text-left">
            <Card className={role === "HAGU" ? "border-2 border-hagu-accent bg-hagu-accent/40" : ""}>
              <CardTitle>I am a HAGU</CardTitle>
              <CardDescription>Offer my time and receive bookings.</CardDescription>
            </Card>
          </button>
        </div>
      </PageContent>

      <PageActions>
        <Button size="lg" className="w-full" disabled={!role} onClick={continueFlow}>
          Start onboarding
        </Button>
      </PageActions>
    </PageShell>
  )
}
