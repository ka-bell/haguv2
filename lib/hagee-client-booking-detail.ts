import { getBookingRequest, type HageeBookingRequest } from "@/lib/hagee-booking-storage"
import {
  bookingDateLine,
  canProposeReschedule,
  canRespondToReschedule,
  canWithdrawReschedule,
  formatRescheduleDiff,
  type RescheduleRequest,
} from "@/lib/hagee-reschedule"

export type { RescheduleRequest } from "@/lib/hagee-reschedule"

export type HageeClientBookingTab = "upcoming" | "pending" | "past"

export type HageeClientBookingTone = "confirmed" | "pending" | "cancelled" | "declined"

export type HageeClientBookingOverview = {
  id: string
  profileId: string
  companionName: string
  companionPhoto: string
  chatId: string
  activity: string
  date: string
  duration?: string
  vibe?: string
  message?: string
  price: string
  escrowLabel?: string
  statusLabel: string
  statusTone: HageeClientBookingTone
  tab: HageeClientBookingTab
  canCancel: boolean
  canReschedule: boolean
  canMessage: boolean
  rescheduleRequest?: RescheduleRequest
  rescheduleDiff?: string
  canRespondToReschedule: boolean
  canWithdrawReschedule: boolean
}

function tabForStatus(status: HageeBookingRequest["status"]): HageeClientBookingTab {
  if (status === "pending") return "pending"
  if (status === "confirmed") return "upcoming"
  return "past"
}

function toneForStatus(status: HageeBookingRequest["status"]): HageeClientBookingTone {
  if (status === "pending") return "pending"
  if (status === "confirmed") return "confirmed"
  if (status === "cancelled") return "cancelled"
  return "declined"
}

function labelForStatus(status: HageeBookingRequest["status"]): string {
  if (status === "pending") return "Awaiting confirmation"
  if (status === "confirmed") return "Confirmed"
  if (status === "cancelled") return "Cancelled"
  return "Declined"
}

export function connectionBookingTitle(request: HageeBookingRequest): string {
  const service = request.serviceLabel.toLowerCase()
  if (service.includes("dinner")) return `Dinner with ${request.profileName}`
  if (service.includes("walk")) return `City walk with ${request.profileName}`
  return `${request.serviceLabel} with ${request.profileName}`
}

export function connectionBookingDate(request: HageeBookingRequest): string {
  if (request.dateLabel && request.timeLabel) {
    return `${request.dateLabel}, ${request.timeLabel}`
  }
  return request.dateLabel || request.timeLabel || "Date TBD"
}

export function connectionBookingStatusLabel(status: HageeBookingRequest["status"]): string {
  if (status === "pending") return "Pending"
  if (status === "confirmed") return "Confirmed"
  if (status === "cancelled") return "Cancelled"
  return "Declined"
}

export function activeConnectionBookings(bookings: HageeBookingRequest[]): HageeBookingRequest[] {
  return bookings.filter((booking) => booking.status === "confirmed" || booking.status === "pending")
}

export function toClientBookingOverview(request: HageeBookingRequest): HageeClientBookingOverview {
  const dateLine = bookingDateLine(request)
  const isActive = request.status === "confirmed" || request.status === "pending"
  const hasReschedule = Boolean(request.rescheduleRequest)

  return {
    id: request.id,
    profileId: request.profileId,
    companionName: request.profileName,
    companionPhoto: request.profilePhoto,
    chatId: request.chatId,
    activity: request.serviceLabel,
    date: dateLine,
    duration: request.durationLabel ?? undefined,
    vibe: request.vibeLabel ?? undefined,
    message: request.message || undefined,
    price: request.amount.replace(".00", ""),
    escrowLabel: isActive
      ? `${request.amount.replace(".00", "")} held in escrow until your session ends`
      : undefined,
    statusLabel: hasReschedule ? "Reschedule pending" : labelForStatus(request.status),
    statusTone: toneForStatus(request.status),
    tab: tabForStatus(request.status),
    canCancel: request.status === "pending" || request.status === "confirmed",
    canReschedule: canProposeReschedule(request, "HAGEE"),
    canMessage: request.status !== "declined",
    rescheduleRequest: request.rescheduleRequest ?? undefined,
    rescheduleDiff: formatRescheduleDiff(request) ?? undefined,
    canRespondToReschedule: canRespondToReschedule(request, "HAGEE"),
    canWithdrawReschedule: canWithdrawReschedule(request, "HAGEE"),
  }
}

export function getClientBookingOverview(id: string): HageeClientBookingOverview | null {
  const request = getBookingRequest(id)
  if (!request) return null
  return toClientBookingOverview(request)
}

export function clientBookingsForTab(
  bookings: HageeBookingRequest[],
  tab: HageeClientBookingTab,
): HageeClientBookingOverview[] {
  return bookings
    .map(toClientBookingOverview)
    .filter((booking) => booking.tab === tab)
}

export function clientBookingTabCounts(bookings: HageeBookingRequest[]) {
  const overviews = bookings.map(toClientBookingOverview)
  return {
    upcoming: overviews.filter((booking) => booking.tab === "upcoming").length,
    pending: overviews.filter((booking) => booking.tab === "pending").length,
    past: overviews.filter((booking) => booking.tab === "past").length,
  }
}
