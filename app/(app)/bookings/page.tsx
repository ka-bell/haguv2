"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { HaguBookingsScreen } from "@/components/hagu/hagu-bookings-screen"
import { HaguProviderTabShell } from "@/components/hagu/hagu-provider-tab-shell"
import { isHaguProvider } from "@/lib/app-navigation"
import { ROUTES } from "@/lib/routes"
import { getSession, type UserRole } from "@/lib/session"

export default function BookingsPage() {
  const router = useRouter()
  const [role, setRole] = useState<UserRole | null | undefined>(undefined)

  useEffect(() => {
    setRole(getSession().role)
  }, [])

  useEffect(() => {
    if (role && !isHaguProvider(role)) {
      router.replace(ROUTES.connectionsTab("bookings"))
    }
  }, [role, router])

  if (role === undefined) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md items-center justify-center bg-hagu-canvas">
        <p className="text-sm text-hagu-text-secondary">Loading…</p>
      </main>
    )
  }

  if (!isHaguProvider(role)) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md items-center justify-center bg-hagu-canvas">
        <p className="text-sm text-hagu-text-secondary">Loading…</p>
      </main>
    )
  }

  return (
    <HaguProviderTabShell>
      <HaguBookingsScreen />
    </HaguProviderTabShell>
  )
}
