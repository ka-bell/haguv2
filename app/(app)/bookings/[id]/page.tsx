"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { HaguBookingDetailScreen } from "@/components/hagu/hagu-booking-detail-screen"
import { HaguFlowPageShell } from "@/components/hagu/hagu-provider-tab-shell"
import { HageeBookingDetailScreen } from "@/components/hagee/hagee-booking-detail-screen"
import { HageeFlowPageShell } from "@/components/hagee/hagee-tab-shell"
import { isHaguProvider } from "@/lib/app-navigation"
import { ROUTES } from "@/lib/routes"
import { getSession, type UserRole } from "@/lib/session"

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [role, setRole] = useState<UserRole | null | undefined>(undefined)

  useEffect(() => {
    setRole(getSession().role)
  }, [])

  if (role === undefined) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md items-center justify-center bg-hagu-canvas">
        <p className="text-sm text-hagu-text-secondary">Loading…</p>
      </main>
    )
  }

  if (isHaguProvider(role)) {
    return (
      <HaguFlowPageShell onBack={() => router.back()} closeHref={ROUTES.bookings}>
        <HaguBookingDetailScreen bookingId={id} />
      </HaguFlowPageShell>
    )
  }

  return (
    <HageeFlowPageShell onBack={() => router.back()} closeHref={ROUTES.connectionsTab("bookings")}>
      <HageeBookingDetailScreen bookingId={id} />
    </HageeFlowPageShell>
  )
}
