import type { HageeExploreMatch } from "@/lib/hagee-explore"

const STORAGE_KEY = "hagee-saved-explore"

export function getSavedExploreMatches(): HageeExploreMatch[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as HageeExploreMatch[]
  } catch {
    return []
  }
}

export function addSavedExploreMatch(match: HageeExploreMatch) {
  const existing = getSavedExploreMatches()
  if (existing.some((item) => item.id === match.id)) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, match]))
}
