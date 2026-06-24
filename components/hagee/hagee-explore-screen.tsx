"use client"

import { useCallback, useEffect, useState } from "react"
import { MapPin } from "lucide-react"
import { HageeExploreSwipeStack } from "@/components/hagee/hagee-explore-swipe-stack"
import { HageeRefineBanner } from "@/components/hagee/hagee-refine-banner"
import { HageeSavedProfiles } from "@/components/hagee/hagee-saved-profiles"
import {
  HAGEE_EXPLORE_LOCATION,
  HAGEE_EXPLORE_MATCHES,
} from "@/lib/hagee-explore"
import { HAGEE_CLIENT_NAME } from "@/lib/hagee-discover"
import {
  addSavedExploreMatch,
  getSavedExploreMatches,
} from "@/lib/hagee-saved-storage"
import type { HageeExploreMatch } from "@/lib/hagee-explore"

function timeGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export function HageeExploreScreen() {
  const [saved, setSaved] = useState<HageeExploreMatch[]>([])

  useEffect(() => {
    setSaved(getSavedExploreMatches())
  }, [])

  const handleSave = useCallback((match: HageeExploreMatch) => {
    addSavedExploreMatch(match)
    setSaved(getSavedExploreMatches())
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-hagu-text-secondary">{timeGreeting()},</p>
          <h1 className="text-[32px] font-semibold leading-tight tracking-tight text-hagu-heading">
            {HAGEE_CLIENT_NAME}
          </h1>
        </div>
        <button
          type="button"
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-hagu-border bg-hagu-white px-3 py-2 text-xs font-medium text-hagu-label shadow-[0px_1px_2px_rgba(0,0,0,0.04)]"
        >
          <MapPin className="size-3.5 text-hagu-accent-strong" />
          {HAGEE_EXPLORE_LOCATION}
        </button>
      </div>

      <HageeRefineBanner />

      <HageeExploreSwipeStack
        matches={HAGEE_EXPLORE_MATCHES}
        onSave={handleSave}
      />

      <HageeSavedProfiles profiles={saved} />
    </div>
  )
}
