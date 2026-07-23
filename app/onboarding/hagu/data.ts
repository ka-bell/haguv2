export type HaguStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export const HAGU_STEP_LABELS: Record<HaguStep, string> = {
  1: "01 — Intro",
  2: "02 — Profile Basics",
  3: "03 — Background",
  4: "04 — Rates & Logistics",
  5: "05 — Activity Menu",
  6: "06 — Availability",
  7: "07 — Identity",
  8: "08 — Identity",
  9: "09 — Get Paid",
}

/**
 * How you show up — Hinge-inspired: specific, bookable vibes (not generic labels).
 * Clients use these to decide who fits the evening they want.
 */
export const CHARACTER_OPTIONS = [
  { id: "deep-talks", emoji: "💬", title: "Deep talks", subtitle: "Goes past small talk fast" },
  { id: "easy-silence", emoji: "🫖", title: "Easy silence", subtitle: "Quiet company feels natural" },
  { id: "good-questions", emoji: "👂", title: "Good questions", subtitle: "Listens more than talks" },
  { id: "local-radar", emoji: "🗺️", title: "Local radar", subtitle: "Knows the underrated spots" },
  { id: "plans-flexible", emoji: "⚡", title: "Plans flexible", subtitle: "Last-minute changes are fine" },
  { id: "warm-energy", emoji: "🤍", title: "Warm energy", subtitle: "Affection comes easily" },
  { id: "sharp-humour", emoji: "😏", title: "Sharp humour", subtitle: "Dry, never try-hard" },
  { id: "low-key-fun", emoji: "🎬", title: "Low-key fun", subtitle: "Movie nights over big nights" },
] as const

export const LANGUAGE_OPTIONS = ["English", "Dutch", "French", "German"]

export const SEX_OPTIONS = [
  { value: "Female", label: "Female" },
  { value: "Male", label: "Male" },
  { value: "Non-binary", label: "Non-binary" },
  { value: "Prefer not to say", label: "Prefer not to say" },
] as const

export const HOSTING_OPTIONS = [
  { value: "hosting", label: "Hosting" },
  { value: "visiting", label: "Visiting" },
  { value: "public", label: "Public" },
]

export const ACTIVITY_CATALOG = [
  { id: "cuddling", label: "Cuddling" },
  { id: "back-scratching", label: "Back scratching" },
  { id: "hand-holding", label: "Hand holding" },
  { id: "hugging", label: "Hugging" },
  { id: "head-scratches", label: "Head scratches" },
  { id: "shoulder-massage", label: "Shoulder massage" },
  { id: "foot-rub", label: "Foot rub" },
  { id: "spooning", label: "Spooning" },
  { id: "sitting-together", label: "Sitting together" },
] as const

/** @deprecated Use ACTIVITY_CATALOG */
export const ACTIVITY_ITEMS = ACTIVITY_CATALOG

export const DEFAULT_ACTIVITY_IDS = ["cuddling", "back-scratching", "hand-holding"] as const

export const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"] as const

export const TIME_PREFERENCES = ["Mornings", "Lunch", "Evenings", "Weekends"] as const

export const CONTINUE_LABELS: Record<HaguStep, string> = {
  1: "Become a Hagu",
  2: "Next: Background",
  3: "Next: Rates & Logistics",
  4: "Next: Activity Menu",
  5: "Next: Availability",
  6: "Next: Verification",
  7: "Scan ID",
  8: "Next: Connect payment",
  9: "Complete Setup",
}
