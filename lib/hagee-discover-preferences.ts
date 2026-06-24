export type HageeDiscoverPreferences = {
  activities: string[]
  interests: string[]
  completedAt: string
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
    if (!raw) return null
    return JSON.parse(raw) as HageeDiscoverPreferences
  } catch {
    return null
  }
}

export function saveDiscoverPreferences(preferences: {
  activities: string[]
  interests: string[]
}) {
  const data: HageeDiscoverPreferences = {
    ...preferences,
    completedAt: new Date().toISOString(),
  }
  window.localStorage.setItem(PREFS_KEY, JSON.stringify(data))
  window.localStorage.setItem(COMPLETED_KEY, "true")
}
