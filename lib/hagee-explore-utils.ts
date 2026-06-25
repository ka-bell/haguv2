import type { HageeDiscoverPreferences } from "@/lib/hagee-discover-preferences"
import { DEFAULT_DISCOVER_ACTIVITIES, DEFAULT_DISCOVER_INTERESTS } from "@/lib/hagee-discover-preferences"
import type { HageeExploreMatch } from "@/lib/hagee-explore"

/** Explore fills the viewport below the glass header and above bottom nav. */
export const HAGEE_EXPLORE_VIEWPORT_HEIGHT =
  "h-[calc(100dvh-env(safe-area-inset-top,2.75rem)-0.5rem-45px-0.75rem-env(safe-area-inset-bottom,0px)-5.5rem)] min-h-[520px]" as const

export function resolveDiscoverPreferences(
  preferences: HageeDiscoverPreferences | null,
): { activities: string[]; interests: string[] } {
  return {
    activities: preferences?.activities ?? DEFAULT_DISCOVER_ACTIVITIES,
    interests: preferences?.interests ?? DEFAULT_DISCOVER_INTERESTS,
  }
}

export function getSharedInterests(
  match: HageeExploreMatch,
  userInterestLabels: string[],
): string[] {
  const userSet = new Set(userInterestLabels.map((item) => item.toLowerCase()))
  return match.interests.filter((item) => userSet.has(item.toLowerCase()))
}
