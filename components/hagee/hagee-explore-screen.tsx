"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { HageeExploreSwipeStack } from "@/components/hagee/hagee-explore-swipe-stack"
import { HageeExploreToolbar } from "@/components/hagee/hagee-explore-toolbar"
import { HAGEE_EXPLORE_MATCHES } from "@/lib/hagee-explore"
import {
  getSharedInterests,
  HAGEE_EXPLORE_VIEWPORT_HEIGHT,
  resolveDiscoverPreferences,
} from "@/lib/hagee-explore-utils"
import {
  addSavedExploreMatch,
  getSavedExploreMatches,
} from "@/lib/hagee-saved-storage"
import {
  getDiscoverPreferences,
  type HageeDiscoverPreferences,
} from "@/lib/hagee-discover-preferences"
import type { HageeExploreMatch } from "@/lib/hagee-explore"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

export function HageeExploreScreen() {
  const router = useRouter()
  const [savedCount, setSavedCount] = useState(0)
  const [preferences, setPreferences] = useState<HageeDiscoverPreferences | null>(null)

  useEffect(() => {
    setSavedCount(getSavedExploreMatches().length)
    setPreferences(getDiscoverPreferences())
  }, [])

  const interestLabels = useMemo(() => {
    const { interests } = resolveDiscoverPreferences(preferences)
    return interests
  }, [preferences])

  const handleSave = useCallback((match: HageeExploreMatch) => {
    addSavedExploreMatch(match)
    setSavedCount(getSavedExploreMatches().length)
  }, [])

  return (
    <div className={cn("flex min-h-0 flex-col gap-2", HAGEE_EXPLORE_VIEWPORT_HEIGHT)}>
      <HageeExploreToolbar savedCount={savedCount} />

      <HageeExploreSwipeStack
        className="min-h-0 flex-1"
        matches={HAGEE_EXPLORE_MATCHES}
        getSharedInterests={(match) => getSharedInterests(match, interestLabels)}
        onSave={handleSave}
        onViewProfile={(match) => router.push(ROUTES.exploreProfile(match.id))}
      />
    </div>
  )
}
