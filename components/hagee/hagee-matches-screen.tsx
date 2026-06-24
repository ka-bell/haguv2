"use client"

import { useMemo, useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import { HageeMatchCard } from "@/components/hagee/hagee-match-card"
import {
  HAGEE_MATCHES,
  MATCH_FILTERS,
  type MatchFilterId,
} from "@/lib/hagee-discover"
import { cn } from "@/lib/utils"

export function HageeMatchesScreen() {
  const [filter, setFilter] = useState<MatchFilterId>("all")

  const matches = useMemo(() => {
    if (filter === "today") {
      return HAGEE_MATCHES.filter((match) => match.availableToday)
    }
    return HAGEE_MATCHES
  }, [filter])

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight text-hagu-heading">People for you</h1>
          <p className="mt-1 text-sm text-hagu-text-secondary">
            Matched to your interests and availability
          </p>
        </div>
        <button
          type="button"
          aria-label="Filter matches"
          className="flex size-[34px] shrink-0 items-center justify-center rounded-[17px] border border-hagu-border bg-hagu-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
        >
          <SlidersHorizontal className="size-[15px] text-hagu-label" />
        </button>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {MATCH_FILTERS.map((item) => {
          const active = filter === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-xs font-medium transition",
                active
                  ? "bg-hagu-ink text-white"
                  : "border border-hagu-border bg-hagu-white text-hagu-label",
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="space-y-4">
        {matches.map((match, index) => (
          <HageeMatchCard key={match.id} match={match} featured={index === 0} />
        ))}
      </div>
    </div>
  )
}
