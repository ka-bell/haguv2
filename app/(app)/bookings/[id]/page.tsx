"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { HaguBookingDetailScreen } from "@/components/hagu/hagu-booking-detail-screen"
import { HaguFlowPageShell } from "@/components/hagu/hagu-provider-tab-shell"
import { ROUTES } from "@/lib/routes"

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  return (
    <HaguFlowPageShell onBack={() => router.back()} closeHref={ROUTES.bookings}>
      <HaguBookingDetailScreen bookingId={id} />
    </HaguFlowPageShell>
  )
}
