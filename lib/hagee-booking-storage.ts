import type { BookingDraft } from "@/lib/hagee-booking"
import {
  bookingChatIdForProfile,
  formatEscrowAmount,
  getBookingDuration,
  getBookingTimeSlot,
  getBookingVibe,
  resolveBookingService,
} from "@/lib/hagee-booking"
import type { ProviderBooking } from "@/lib/hagu-provider-feed"
import { PROVIDER_BOOKINGS } from "@/lib/hagu-provider-feed"
import { HAGU_PROVIDER_PROFILE } from "@/lib/hagu-provider-profile"
import {
  bookingDateLine,
  type RescheduleProposedBy,
  type RescheduleRequest,
} from "@/lib/hagee-reschedule"
import type { HageeCompanionProfile } from "@/lib/hagee-companion-profiles"
import { HAGEE_CLIENT_CHAT_ID, HAGEE_CLIENT_NAME, HAGEE_CLIENT_PHOTO } from "@/lib/hagee-client"

export type { RescheduleProposedBy, RescheduleRequest } from "@/lib/hagee-reschedule"

/** Demo booking shown on home — Dinner with Sarah. */
export const HAGEE_DEMO_BOOKING_ID = "demo-sara-dinner"

export const HAGEE_DEMO_MAYA_BOOKING_ID = "demo-maya-walk"

/** Provider mock bookings — excluded from HAGEE client lists, used for HAGU reschedule. */
export const HAGU_PROVIDER_BOOKING_IDS = new Set(
  PROVIDER_BOOKINGS.filter(
    (booking) => booking.category === "upcoming" && booking.status === "confirmed",
  ).map((booking) => booking.id),
)

function parseProviderBookingDate(date: string): { dateLabel: string; timeLabel: string } {
  const [dateLabel, timeLabel] = date.split(" · ")
  return { dateLabel: dateLabel?.trim() || date, timeLabel: timeLabel?.trim() || "" }
}

function providerBookingToSeed(booking: ProviderBooking): HageeBookingRequest {
  const { dateLabel, timeLabel } = parseProviderBookingDate(booking.date)

  return {
    id: booking.id,
    profileId: "sarah",
    profileName: HAGU_PROVIDER_PROFILE.firstName,
    profilePhoto: HAGU_PROVIDER_PROFILE.photo,
    chatId: "sarah",
    clientChatId: booking.chatId,
    clientName: booking.name,
    clientPhoto: booking.avatar,
    serviceLabel: booking.activity,
    dateLabel,
    timeLabel,
    durationLabel: booking.duration ?? null,
    vibeLabel: booking.vibe ?? null,
    message: booking.message ?? "",
    amount: booking.price,
    status: "confirmed",
    createdAt: "2026-06-01T10:00:00.000Z",
  }
}

const PROVIDER_SEED_BOOKINGS: HageeBookingRequest[] = PROVIDER_BOOKINGS.filter(
  (booking) => booking.category === "upcoming" && booking.status === "confirmed",
).map(providerBookingToSeed)

const SEED_BOOKINGS: HageeBookingRequest[] = [
  {
    id: HAGEE_DEMO_BOOKING_ID,
    profileId: "sara",
    profileName: "Sarah",
    profilePhoto:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    chatId: "sarah",
    clientChatId: HAGEE_CLIENT_CHAT_ID,
    clientName: HAGEE_CLIENT_NAME,
    clientPhoto: HAGEE_CLIENT_PHOTO,
    serviceLabel: "Dinner",
    dateLabel: "Tonight",
    timeLabel: "19:00",
    durationLabel: "2 hours",
    vibeLabel: "Thoughtful",
    message: "Looking forward to a relaxed dinner and good conversation.",
    amount: "€95",
    status: "confirmed",
    createdAt: "2026-06-28T10:00:00.000Z",
  },
  {
    id: HAGEE_DEMO_MAYA_BOOKING_ID,
    profileId: "maya",
    profileName: "Maya",
    profilePhoto:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80",
    chatId: "maya",
    clientChatId: HAGEE_CLIENT_CHAT_ID,
    clientName: HAGEE_CLIENT_NAME,
    clientPhoto: HAGEE_CLIENT_PHOTO,
    serviceLabel: "City walk",
    dateLabel: "Sat",
    timeLabel: "14:00",
    durationLabel: "2 hours",
    vibeLabel: "Easygoing",
    message: "A relaxed walk through the city centre.",
    amount: "€45",
    status: "pending",
    createdAt: "2026-06-27T14:00:00.000Z",
  },
]

export type HageeBookingRequestStatus = "pending" | "confirmed" | "declined" | "cancelled"

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
  rescheduleRequest?: RescheduleRequest | null
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

function findSeedBooking(id: string): HageeBookingRequest | undefined {
  return SEED_BOOKINGS.find((request) => request.id === id) ?? PROVIDER_SEED_BOOKINGS.find((request) => request.id === id)
}

function mergeWithSeeds(requests: HageeBookingRequest[]): HageeBookingRequest[] {
  const byId = new Map(requests.map((request) => [request.id, request]))
  for (const seed of [...SEED_BOOKINGS, ...PROVIDER_SEED_BOOKINGS]) {
    if (!byId.has(seed.id)) {
      byId.set(seed.id, seed)
    }
  }
  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function getBookingRequests(): HageeBookingRequest[] {
  return mergeWithSeeds(readRequests())
}

export function getClientBookings(): HageeBookingRequest[] {
  return getBookingRequests().filter((request) => !HAGU_PROVIDER_BOOKING_IDS.has(request.id))
}

export function getBookingRequest(id: string): HageeBookingRequest | undefined {
  return getBookingRequests().find((request) => request.id === id)
}

export function getBookingRequestByChatId(chatId: string): HageeBookingRequest | undefined {
  return getBookingRequests().find((request) => request.chatId === chatId)
}

export function getPendingBookingForChat(chatId: string): HageeBookingRequest | undefined {
  return getBookingRequests().find((request) => request.chatId === chatId && request.status === "pending")
}

export function getBookingRequestByClientChatId(clientChatId: string): HageeBookingRequest | undefined {
  return getBookingRequests().find((request) => request.clientChatId === clientChatId)
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
  updateBookingRequest(id, (request) => {
    if (request.status !== "pending") return request
    return { ...request, status: "confirmed" as const }
  })
}

export function declineBookingRequest(id: string) {
  updateBookingRequest(id, (request) => {
    if (request.status !== "pending") return request
    return { ...request, status: "declined" as const }
  })
}

export function cancelBookingRequest(id: string) {
  const stored = readRequests()
  const exists = stored.some((request) => request.id === id)
  if (exists) {
    writeRequests(
      stored.map((request) =>
        request.id === id ? { ...request, status: "cancelled" as const } : request,
      ),
    )
    return
  }

  const seed = findSeedBooking(id)
  if (seed) {
    writeRequests([{ ...seed, status: "cancelled" }, ...stored])
  }
}

function updateBookingRequest(
  id: string,
  updater: (request: HageeBookingRequest) => HageeBookingRequest,
) {
  const stored = readRequests()
  const exists = stored.some((request) => request.id === id)
  if (exists) {
    writeRequests(stored.map((request) => (request.id === id ? updater(request) : request)))
    return
  }

  const seed = findSeedBooking(id)
  if (seed) {
    writeRequests([updater(seed), ...stored])
  }
}

export function requestReschedule(
  id: string,
  proposedBy: RescheduleProposedBy,
  payload: { dateLabel: string; timeLabel: string; message?: string },
) {
  updateBookingRequest(id, (request) => {
    if (request.status !== "confirmed" || request.rescheduleRequest) return request
    return {
      ...request,
      rescheduleRequest: {
        proposedBy,
        dateLabel: payload.dateLabel,
        timeLabel: payload.timeLabel,
        message: payload.message?.trim() || undefined,
        requestedAt: new Date().toISOString(),
      },
    }
  })
}

export function acceptReschedule(id: string) {
  updateBookingRequest(id, (request) => {
    const pending = request.rescheduleRequest
    if (!pending || request.status !== "confirmed") return request
    return {
      ...request,
      dateLabel: pending.dateLabel,
      timeLabel: pending.timeLabel,
      rescheduleRequest: null,
    }
  })
}

export function declineReschedule(id: string) {
  updateBookingRequest(id, (request) => {
    if (!request.rescheduleRequest || request.status !== "confirmed") return request
    return { ...request, rescheduleRequest: null }
  })
}

export function withdrawReschedule(id: string) {
  declineReschedule(id)
}

export function bookingRequestToProviderBooking(request: HageeBookingRequest): ProviderBooking {
  const dateLine = bookingDateLine(request)
  const hasReschedule = Boolean(request.rescheduleRequest)

  return {
    id: request.id,
    chatId: request.clientChatId,
    name: request.clientName,
    activity: request.serviceLabel,
    status: hasReschedule ? "pending" : "confirmed",
    category: request.status === "cancelled" ? "cancelled" : "upcoming",
    date: dateLine,
    price: request.amount.replace(".00", ""),
    avatar: request.clientPhoto,
    showCalendarIcon: true,
    duration: request.durationLabel ?? undefined,
    clientSubtitle: `Booking · ${request.serviceLabel}`,
    message: request.message,
    vibe: request.vibeLabel ?? undefined,
  }
}

export function getStoredProviderBookings(): ProviderBooking[] {
  return getBookingRequests()
    .filter(
      (request) =>
        request.status === "confirmed" &&
        (HAGU_PROVIDER_BOOKING_IDS.has(request.id) || request.clientChatId === HAGEE_CLIENT_CHAT_ID),
    )
    .map(bookingRequestToProviderBooking)
}

/** Overlay storage-backed fields (e.g. reschedule) onto static provider bookings. */
export function mergeProviderBookings(
  staticBookings: ProviderBooking[],
  storedBookings: ProviderBooking[],
): ProviderBooking[] {
  const storedById = new Map(storedBookings.map((booking) => [booking.id, booking]))

  return [
    ...staticBookings.map((booking) => storedById.get(booking.id) ?? booking),
    ...storedBookings.filter((stored) => !staticBookings.some((booking) => booking.id === stored.id)),
  ]
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
