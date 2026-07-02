import type { HageeCompanionProfile, HageeCompanionService } from "@/lib/hagee-companion-profiles"

export type BookingStep = 2 | 3 | 4 | 5

export type BookingActivity = {
  id: string
  emoji: string
  label: string
  subtitle: string
  serviceId: string
}

export type BookingDateOption = {
  day: number
  weekday: string
  month: string
}

export type BookingTimeSlot = {
  id: string
  label: string
  subtitle: string
  icon?: "sun" | "moon" | "sparkles"
}

export type BookingDuration = {
  id: string
  label: string
  hours: number
}

export type BookingVibe = {
  id: string
  label: string
  subtitle: string
}

export type PaymentMethod = "apple-pay" | "card" | "ideal"

export type BookingDraft = {
  serviceId: string | null
  day: number | null
  dateLabel: string | null
  timeSlotId: string | null
  durationId: string | null
  vibeId: string | null
  message: string
  paymentMethod: PaymentMethod
}

export const BOOKING_FLOW_STEPS = 4

export const BOOKING_ACTIVITIES: BookingActivity[] = [
  {
    id: "meal",
    emoji: "🍽",
    label: "A meal together",
    subtitle: "Lunch or dinner, no agenda",
    serviceId: "dinner",
  },
  {
    id: "coffee",
    emoji: "☕",
    label: "Coffee and a conversation",
    subtitle: "Relaxed, open-ended",
    serviceId: "coffee",
  },
  {
    id: "walk",
    emoji: "🚶",
    label: "A walk",
    subtitle: "Somewhere easy, no pressure",
    serviceId: "walk",
  },
]

export const BOOKING_DATE_OPTIONS: BookingDateOption[] = [
  { day: 14, weekday: "Thu", month: "Jul" },
  { day: 15, weekday: "Fri", month: "Jul" },
  { day: 16, weekday: "Sat", month: "Jul" },
  { day: 17, weekday: "Sun", month: "Jul" },
  { day: 18, weekday: "Mon", month: "Jul" },
]

export const BOOKING_TIME_SLOTS: BookingTimeSlot[] = [
  { id: "morning", label: "Morning", subtitle: "10:00 – 12:00", icon: "sun" },
  { id: "afternoon", label: "Afternoon", subtitle: "13:00 – 17:00", icon: "sparkles" },
  { id: "evening", label: "Evening", subtitle: "18:00 – 22:00", icon: "moon" },
]

export const BOOKING_DURATIONS: BookingDuration[] = [
  { id: "1h", label: "1 hr", hours: 1 },
  { id: "2h", label: "2 hr", hours: 2 },
  { id: "3h", label: "3 hr", hours: 3 },
]

export const BOOKING_VIBES: BookingVibe[] = [
  { id: "low-key", label: "Low-key", subtitle: "Easy and unhurried" },
  { id: "curious", label: "Curious", subtitle: "Open to wherever it goes" },
  { id: "focused", label: "Focused", subtitle: "One topic, no small talk" },
]

export const ESCROW_STEPS = [
  {
    title: "You reserve the amount",
    body: "We hold the full booking fee in escrow when you confirm. Sara is not paid yet.",
  },
  {
    title: "Sara accepts within 24h",
    body: "If she declines or does not respond, you are refunded automatically.",
  },
  {
    title: "You meet up",
    body: "Once accepted, you can coordinate details together in chat.",
  },
  {
    title: "Payment releases",
    body: "Funds are released to Sara 2 hours after your scheduled meetup ends.",
  },
] as const

export const BOOKING_TIPS = [
  "Mention a neighbourhood or venue you like",
  "Say what kind of energy you are hoping for",
  "Keep it short — one or two sentences is enough",
] as const

export const PAYMENT_METHODS: { id: PaymentMethod; label: string; subtitle: string }[] = [
  { id: "apple-pay", label: "Apple Pay", subtitle: "Touch ID or Face ID" },
  { id: "card", label: "Credit or debit card", subtitle: "Visa, Mastercard, Amex" },
  { id: "ideal", label: "iDEAL", subtitle: "Dutch bank transfer" },
]

export const BOOKING_CONTINUE_LABELS: Record<BookingStep, string> = {
  2: "Continue",
  3: "Review & pay",
  4: "Reserve €{amount} · Send request",
  5: "View booking",
}

export function createBookingDraft(serviceId?: string | null): BookingDraft {
  return {
    serviceId: serviceId ?? null,
    day: null,
    dateLabel: null,
    timeSlotId: null,
    durationId: "2h",
    vibeId: null,
    message: "",
    paymentMethod: "apple-pay",
  }
}

export function resolveBookingService(
  profile: HageeCompanionProfile,
  serviceId: string | null,
): HageeCompanionService | null {
  if (!serviceId) return null
  const direct = profile.services.find((service) => service.id === serviceId)
  if (direct) return direct

  const activity = BOOKING_ACTIVITIES.find((item) => item.serviceId === serviceId)
  if (!activity) return null

  return (
    profile.services.find((service) => service.id === activity.serviceId) ?? {
      id: activity.serviceId,
      label: activity.label,
      duration: "2 hours",
      price: "€75",
    }
  )
}

export function getBookingTimeSlot(timeSlotId: string | null): BookingTimeSlot | null {
  if (!timeSlotId) return null
  return BOOKING_TIME_SLOTS.find((slot) => slot.id === timeSlotId) ?? null
}

export function getBookingDuration(durationId: string | null): BookingDuration | null {
  if (!durationId) return null
  return BOOKING_DURATIONS.find((duration) => duration.id === durationId) ?? null
}

export function getBookingVibe(vibeId: string | null): BookingVibe | null {
  if (!vibeId) return null
  return BOOKING_VIBES.find((vibe) => vibe.id === vibeId) ?? null
}

export function parseServicePrice(price: string): number {
  const match = price.replace(",", ".").match(/[\d.]+/)
  return match ? Number.parseFloat(match[0]) : 75
}

export function formatEscrowAmount(price: string): string {
  const value = parseServicePrice(price)
  return `€${value.toFixed(2)}`
}

export function canContinueBooking(step: BookingStep, draft: BookingDraft): boolean {
  if (step === 2) {
    return draft.day !== null && Boolean(draft.timeSlotId) && Boolean(draft.durationId)
  }
  if (step === 3) return Boolean(draft.vibeId)
  if (step === 4) return Boolean(draft.paymentMethod)
  return true
}

export function bookingChatIdForProfile(profileId: string): string {
  if (profileId === "sara") return "sarah"
  return profileId
}

export function bookingProgressStep(step: BookingStep): number {
  return step - 1
}

export function formatBookingDateLabel(day: number | null): string | null {
  if (day === null) return null
  const option = BOOKING_DATE_OPTIONS.find((item) => item.day === day)
  if (!option) return `Jul ${day}`
  return `${option.weekday} ${option.day} ${option.month}`
}

export function formatRequestLine(
  profile: HageeCompanionProfile,
  draft: BookingDraft,
): string {
  const service = resolveBookingService(profile, draft.serviceId)
  const slot = getBookingTimeSlot(draft.timeSlotId)
  const duration = getBookingDuration(draft.durationId)
  const parts = [
    service?.label ?? "Time together",
    draft.dateLabel ? `${draft.dateLabel}${slot ? `, ${slot.label.toLowerCase()}` : ""}` : null,
    duration ? `~${duration.hours} hr${duration.hours > 1 ? "s" : ""}` : null,
  ].filter(Boolean)
  return parts.join(" · ")
}
