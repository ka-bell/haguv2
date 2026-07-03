"use client"

import { use } from "react"
import { RescheduleFlowScreen } from "@/components/shared/reschedule-flow-screen"

export default function BookingReschedulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <RescheduleFlowScreen bookingId={id} />
}
