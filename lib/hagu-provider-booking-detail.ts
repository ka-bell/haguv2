import {
  PROVIDER_BOOKINGS,
  PROVIDER_REQUESTS,
  type BookingCategory,
  type ProviderBooking,
  type ProviderRequest,
} from "@/lib/hagu-provider-feed"
import { getBookingRequest, type HageeBookingRequest } from "@/lib/hagee-booking-storage"

export type BookingOverviewTone = "confirmed" | "pending" | "completed" | "cancelled" | "new"

export type BookingOverview = {
  id: string
  source: "booking" | "request" | "stored"
  storageId?: string
  chatId: string
  clientName: string
  clientSubtitle?: string
  clientAvatar: string
  activity: string
  date: string
  duration?: string
  location?: string
  price: string
  vibe?: string
  message?: string
  escrowLabel?: string
  reviewId?: string
  statusLabel: string
  statusTone: BookingOverviewTone
  category: BookingCategory | "request"
}

export const CALENDAR_DAY_TO_BOOKING_ID: Record<number, string> = {
  6: "1",
  7: "2",
  8: "3",
  21: "1",
}

function toneFromBooking(booking: ProviderBooking): BookingOverviewTone {
  if (booking.category === "completed") return "completed"
  if (booking.category === "cancelled") return "cancelled"
  if (booking.status === "pending") return "pending"
  return "confirmed"
}

function labelFromBooking(booking: ProviderBooking): string {
  if (booking.category === "completed") return "Completed"
  if (booking.category === "cancelled") return "Cancelled"
  if (booking.status === "pending") return "Pending"
  return "Confirmed"
}

function fromProviderBooking(booking: ProviderBooking): BookingOverview {
  return {
    id: booking.id,
    source: "booking",
    chatId: booking.chatId,
    clientName: booking.name,
    clientSubtitle: booking.clientSubtitle,
    clientAvatar: booking.avatar,
    activity: booking.activity,
    date: booking.date,
    duration: booking.duration,
    location: booking.location,
    price: booking.price,
    vibe: booking.vibe,
    message: booking.message,
    escrowLabel: booking.escrowLabel,
    reviewId: booking.reviewId,
    statusLabel: labelFromBooking(booking),
    statusTone: toneFromBooking(booking),
    category: booking.category,
  }
}

function fromProviderRequest(request: ProviderRequest): BookingOverview {
  const dateRow = request.details?.find((row) => row.label === "Date")
  const durationRow = request.details?.find((row) => row.label === "Duration")
  const activityRow = request.details?.find((row) => row.label === "Activity")

  return {
    id: request.id,
    source: "request",
    chatId: request.chatId,
    clientName: request.name,
    clientSubtitle: request.subtitle,
    clientAvatar: request.avatar,
    activity: activityRow?.value ?? request.summary ?? "Booking request",
    date: dateRow?.value ?? request.meta?.split(" · ")[0] ?? "TBD",
    duration: durationRow?.value,
    price: request.price,
    message: request.message?.replace(/^"|"$/g, ""),
    statusLabel: "New request",
    statusTone: "new",
    category: "request",
  }
}

function fromStoredRequest(request: HageeBookingRequest): BookingOverview {
  const dateLine = [request.dateLabel, request.timeLabel].filter(Boolean).join(" · ")

  return {
    id: request.id,
    source: "stored",
    storageId: request.id,
    chatId: request.clientChatId,
    clientName: request.clientName,
    clientSubtitle: `Booking request · ${request.serviceLabel}`,
    clientAvatar: request.clientPhoto,
    activity: request.serviceLabel,
    date: dateLine || "TBD",
    duration: request.durationLabel ?? undefined,
    price: request.amount.replace(".00", ""),
    vibe: request.vibeLabel ?? undefined,
    message: request.message || undefined,
    escrowLabel: `€${request.amount.replace(/[^\d]/g, "")} held in escrow until session ends`,
    statusLabel:
      request.status === "pending"
        ? "New request"
        : request.status === "confirmed"
          ? "Confirmed"
          : "Declined",
    statusTone:
      request.status === "pending" ? "new" : request.status === "confirmed" ? "confirmed" : "cancelled",
    category:
      request.status === "pending" ? "request" : request.status === "confirmed" ? "upcoming" : "cancelled",
  }
}

export function getBookingOverview(id: string): BookingOverview | null {
  const booking = PROVIDER_BOOKINGS.find((item) => item.id === id)
  if (booking) return fromProviderBooking(booking)

  const request = PROVIDER_REQUESTS.find((item) => item.id === id)
  if (request) return fromProviderRequest(request)

  const stored = getBookingRequest(id)
  if (stored) return fromStoredRequest(stored)

  return null
}
