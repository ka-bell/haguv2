import { HOME_MOOD_TO_ACTIVITIES } from "@/lib/hagee-home"

export type HageeDiscoverPreferences = {
  activities: string[]
  interests: string[]
  completedAt: string
  /** Set when user picks a mood on Home — used for explore filter label */
  moodId?: string
}

const COMPLETED_KEY = "hagee-discover-refine-complete"
const PREFS_KEY = "hagee-discover-preferences"

export const DEFAULT_DISCOVER_ACTIVITIES = ["meal", "conversation"]
export const DEFAULT_DISCOVER_INTERESTS = [
  "Cooking",
  "Wine",
  "Film",
  "Art galleries",
  "Running",
  "Philosophy",
  "Psychology",
]

export function hasCompletedDiscoverRefine(): boolean {
  if (typeof window === "undefined") return false
  return window.localStorage.getItem(COMPLETED_KEY) === "true"
}

export function getDiscoverPreferences(): HageeDiscoverPreferences | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(PREFS_KEY)
    if (!raw?.trim()) return null
    return JSON.parse(raw) as HageeDiscoverPreferences
  } catch {
    return null
  }
}

export function saveDiscoverPreferences(preferences: {
  activities: string[]
  interests: string[]
  moodId?: string
}) {
  const data: HageeDiscoverPreferences = {
    activities: preferences.activities,
    interests: preferences.interests,
    completedAt: new Date().toISOString(),
    ...(preferences.moodId ? { moodId: preferences.moodId } : {}),
  }
  window.localStorage.setItem(PREFS_KEY, JSON.stringify(data))
  window.localStorage.setItem(COMPLETED_KEY, "true")
}

/** Apply a Home mood card and skip the refine activity step on first visit. */
export function applyHomeMoodFilter(moodId: string) {
  const activities = HOME_MOOD_TO_ACTIVITIES[moodId]
  if (!activities?.length) return

  const existing = getDiscoverPreferences()
  saveDiscoverPreferences({
    activities,
    interests: existing?.interests ?? DEFAULT_DISCOVER_INTERESTS,
    moodId,
  })
}
