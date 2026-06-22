export type HaguStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export const HAGU_STEP_LABELS: Record<HaguStep, string> = {
  1: "01 — Intro",
  2: "02 — Profile Basics",
  3: "03 — The Real You",
  4: "04 — Rates & Logistics",
  5: "05 — Activity Menu",
  6: "06 — Availability",
  7: "07 — Identity",
  8: "08 — Identity",
  9: "09 — Get Paid",
}

export const CHARACTER_OPTIONS = [
  { id: "night-owl", emoji: "🌙", title: "Night owl", subtitle: "Best after 8pm" },
  { id: "early-riser", emoji: "🌅", title: "Early riser", subtitle: "Morning person" },
  { id: "deep-diver", emoji: "📚", title: "Deep diver", subtitle: "Goes all in on topics" },
  { id: "spontaneous", emoji: "🎲", title: "Spontaneous", subtitle: "Decides last minute" },
  { id: "quiet-type", emoji: "🤫", title: "Quiet type", subtitle: "Comfortable in silence" },
  { id: "dry-humour", emoji: "😂", title: "Dry humour", subtitle: "Understated wit" },
] as const

export const LANGUAGE_OPTIONS = ["English", "Dutch", "French", "German"]

export const HOSTING_OPTIONS = [
  { value: "hosting", label: "Hosting" },
  { value: "visiting", label: "Visiting" },
  { value: "public", label: "Public" },
]

export const ACTIVITY_ITEMS = [
  { id: "cuddling", label: "Cuddling" },
  { id: "back-scratching", label: "Back scratching" },
  { id: "hand-holding", label: "Hand holding" },
] as const

export const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"] as const

export const TIME_PREFERENCES = ["Evenings", "Weekends", "Lunch"] as const

export const CONTINUE_LABELS: Record<HaguStep, string> = {
  1: "Become a Hagu",
  2: "Next: The Real You",
  3: "Next: Rates & Logistics",
  4: "Next: Activity Menu",
  5: "Next: Availability",
  6: "Next: Verification",
  7: "Scan ID",
  8: "Next: Connect payment",
  9: "Complete Setup",
}
