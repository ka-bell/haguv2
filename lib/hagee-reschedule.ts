import type { HageeBookingRequest } from "@/lib/hagee-booking-storage"
import type { UserRole } from "@/lib/session"

export type RescheduleProposedBy = "HAGEE" | "HAGU"

export type RescheduleRequest = {
  proposedBy: RescheduleProposedBy
  dateLabel: string
  timeLabel: string
  message?: string
  requestedAt: string
}

export type RescheduleDraft = {
  day: number | null
  dateLabel: string | null
  timeSlotId: string | null
  message: string
}

export function createRescheduleDraft(): RescheduleDraft {
  return { day: null, dateLabel: null, timeSlotId: null, message: "" }
}

export function bookingDateLine(request: Pick<HageeBookingRequest, "dateLabel" | "timeLabel">): string {
  return [request.dateLabel, request.timeLabel].filter(Boolean).join(" · ") || "TBD"
}

export function formatRescheduleDiff(booking: HageeBookingRequest): string | null {
  const request = booking.rescheduleRequest
  if (!request) return null
  const current = bookingDateLine(booking)
  const proposed = [request.dateLabel, request.timeLabel].filter(Boolean).join(" · ")
  return `${current} → ${proposed}`
}

export function canProposeReschedule(
  booking: HageeBookingRequest,
  role: UserRole,
): boolean {
  if (booking.status !== "confirmed") return false
  if (booking.rescheduleRequest) return false
  return role === "HAGEE" || role === "HAGU"
}

export function canRespondToReschedule(
  booking: HageeBookingRequest,
  role: UserRole,
): boolean {
  const request = booking.rescheduleRequest
  if (!request || booking.status !== "confirmed") return false
  return request.proposedBy !== role
}

export function canWithdrawReschedule(
  booking: HageeBookingRequest,
  role: UserRole,
): boolean {
  const request = booking.rescheduleRequest
  if (!request || booking.status !== "confirmed") return false
  return request.proposedBy === role
}

export function canContinueRescheduleDraft(draft: RescheduleDraft): boolean {
  return draft.day !== null && Boolean(draft.dateLabel) && Boolean(draft.timeSlotId)
}

export function counterpartyNameForRole(
  booking: HageeBookingRequest,
  role: UserRole,
): string {
  return role === "HAGEE" ? booking.profileName : booking.clientName
}
