import { getBookingRequest, type HageeBookingRequest } from "@/lib/hagee-booking-storage"

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

export function toClientBookingOverview(request: HageeBookingRequest): HageeClientBookingOverview {
  const dateLine = [request.dateLabel, request.timeLabel].filter(Boolean).join(" · ")
  const isActive = request.status === "confirmed" || request.status === "pending"

  return {
    id: request.id,
    profileId: request.profileId,
    companionName: request.profileName,
    companionPhoto: request.profilePhoto,
    chatId: request.chatId,
    activity: request.serviceLabel,
    date: dateLine || "TBD",
    duration: request.durationLabel ?? undefined,
    vibe: request.vibeLabel ?? undefined,
    message: request.message || undefined,
    price: request.amount.replace(".00", ""),
    escrowLabel: isActive
      ? `${request.amount.replace(".00", "")} held in escrow until your session ends`
      : undefined,
    statusLabel: labelForStatus(request.status),
    statusTone: toneForStatus(request.status),
    tab: tabForStatus(request.status),
    canCancel: request.status === "pending" || request.status === "confirmed",
    canReschedule: request.status === "confirmed",
    canMessage: request.status !== "declined",
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
