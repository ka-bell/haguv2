import type { BookingDraft } from "@/lib/hagee-booking"
import {
  bookingChatIdForProfile,
  formatEscrowAmount,
  getBookingDuration,
  getBookingTimeSlot,
  getBookingVibe,
  resolveBookingService,
} from "@/lib/hagee-booking"
import type { HageeCompanionProfile } from "@/lib/hagee-companion-profiles"
import { HAGEE_CLIENT_CHAT_ID, HAGEE_CLIENT_NAME, HAGEE_CLIENT_PHOTO } from "@/lib/hagee-client"

export type HageeBookingRequestStatus = "pending" | "confirmed" | "declined"

export type HageeBookingRequest = {
  id: string
  profileId: string
  profileName: string
  profilePhoto: string
  /** HAGEE thread — companion profile id (e.g. elena) */
  chatId: string
  /** HAGU thread — HAGEE client id (e.g. alex) */
  clientChatId: string
  clientName: string
  clientPhoto: string
  serviceLabel: string
  dateLabel: string | null
  timeLabel: string | null
  durationLabel: string | null
  vibeLabel: string | null
  message: string
  amount: string
  status: HageeBookingRequestStatus
  createdAt: string
}

const STORAGE_KEY = "hagee-booking-requests"
export const HAGEE_BOOKING_UPDATED_EVENT = "hagee-booking-updated"

function normalizeRequest(request: HageeBookingRequest): HageeBookingRequest {
  return {
    ...request,
    clientChatId: request.clientChatId ?? HAGEE_CLIENT_CHAT_ID,
    clientName: request.clientName ?? HAGEE_CLIENT_NAME,
    clientPhoto: request.clientPhoto ?? HAGEE_CLIENT_PHOTO,
  }
}

function readRequests(): HageeBookingRequest[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw?.trim()) return []
    return (JSON.parse(raw) as HageeBookingRequest[]).map(normalizeRequest)
  } catch {
    return []
  }
}

function writeRequests(requests: HageeBookingRequest[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
  window.dispatchEvent(new CustomEvent(HAGEE_BOOKING_UPDATED_EVENT))
}

export function getBookingRequests(): HageeBookingRequest[] {
  return readRequests()
}

export function getBookingRequest(id: string): HageeBookingRequest | undefined {
  return readRequests().find((request) => request.id === id)
}

export function getBookingRequestByChatId(chatId: string): HageeBookingRequest | undefined {
  return readRequests().find((request) => request.chatId === chatId)
}

export function getPendingBookingForChat(chatId: string): HageeBookingRequest | undefined {
  return readRequests().find((request) => request.chatId === chatId && request.status === "pending")
}

export function getBookingRequestByClientChatId(clientChatId: string): HageeBookingRequest | undefined {
  return readRequests().find((request) => request.clientChatId === clientChatId)
}

/** HAGEE cannot message the HAGU while a booking request is still pending. */
export function isHageeChatLocked(chatId: string): boolean {
  return Boolean(getPendingBookingForChat(chatId))
}

/** HAGU can always message the HAGEE about a booking request. */
export function isHaguChatLocked(_clientChatId: string): boolean {
  return false
}

export function createBookingRequestFromDraft(
  profile: HageeCompanionProfile,
  draft: BookingDraft,
): HageeBookingRequest {
  const service = resolveBookingService(profile, draft.serviceId)
  const slot = getBookingTimeSlot(draft.timeSlotId)
  const duration = getBookingDuration(draft.durationId)
  const vibe = getBookingVibe(draft.vibeId)
  const amount = formatEscrowAmount(service?.price ?? "€75")

  return {
    id: `booking-${profile.id}-${Date.now()}`,
    profileId: profile.id,
    profileName: profile.name,
    profilePhoto: profile.photo,
    chatId: bookingChatIdForProfile(profile.id),
    clientChatId: HAGEE_CLIENT_CHAT_ID,
    clientName: HAGEE_CLIENT_NAME,
    clientPhoto: HAGEE_CLIENT_PHOTO,
    serviceLabel: service?.label ?? "Time together",
    dateLabel: draft.dateLabel,
    timeLabel: slot?.label ?? null,
    durationLabel: duration?.label ?? null,
    vibeLabel: vibe?.label ?? null,
    message: draft.message,
    amount,
    status: "pending",
    createdAt: new Date().toISOString(),
  }
}

export function saveBookingRequest(request: HageeBookingRequest) {
  const existing = readRequests()
  const withoutDuplicate = existing.filter(
    (item) => !(item.profileId === request.profileId && item.status === "pending"),
  )
  writeRequests([request, ...withoutDuplicate])
}

export function confirmBookingRequest(id: string) {
  writeRequests(
    readRequests().map((request) =>
      request.id === id ? { ...request, status: "confirmed" as const } : request,
    ),
  )
}

export function declineBookingRequest(id: string) {
  writeRequests(
    readRequests().map((request) =>
      request.id === id ? { ...request, status: "declined" as const } : request,
    ),
  )
}

export function bookingRequestToProviderRequest(request: HageeBookingRequest) {
  const dateLine = [request.dateLabel, request.timeLabel].filter(Boolean).join(" · ")

  return {
    id: request.id,
    chatId: request.clientChatId,
    name: request.clientName,
    subtitle: `Booking request · ${request.serviceLabel}`,
    avatar: request.clientPhoto,
    price: request.amount.replace(".00", ""),
    message: request.message ? `"${request.message}"` : undefined,
    details: [
      { label: "Activity", value: request.serviceLabel },
      { label: "Date", value: dateLine || "TBD" },
      { label: "Duration", value: request.durationLabel ?? "—" },
      { label: "Total", value: request.amount, bold: true },
    ],
    summary: request.serviceLabel,
    meta: [dateLine, request.vibeLabel ? `${request.vibeLabel} vibe` : null].filter(Boolean).join(" · "),
    fromStorage: true as const,
  }
}

export function bookingRequestToHaguChatThread(request: HageeBookingRequest) {
  const dateLine = [request.dateLabel, request.timeLabel].filter(Boolean).join(" · ")
  const messages: { type: "incoming"; text: string; time: string }[] = []

  if (request.message.trim()) {
    messages.push({ type: "incoming", text: request.message, time: "In request" })
  }

  if (request.status === "confirmed") {
    messages.push({
      type: "incoming",
      text: `Looking forward to ${request.serviceLabel.toLowerCase()}!`,
      time: "Now",
    })
  }

  return {
    id: request.clientChatId,
    name: request.clientName,
    avatar: request.clientPhoto,
    status:
      request.status === "pending"
        ? "Pending request · reply before accepting"
        : "Booking confirmed",
    bookingBar: {
      activity: request.serviceLabel,
      date: dateLine || "TBD",
      price: request.amount.replace(".00", ""),
    },
    messages,
    pending: request.status === "pending",
  }
}
