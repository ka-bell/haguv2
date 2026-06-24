"use client"

import Image from "next/image"
import { Clock, Heart, Star, X } from "lucide-react"
import type { HageeExploreMatch } from "@/lib/hagee-explore"
import { cn } from "@/lib/utils"

export type HageeExploreSwipeHint = "pass" | "save" | null

interface HageeExploreCardProps {
  match: HageeExploreMatch
  onViewProfile?: () => void
  swipeHint?: HageeExploreSwipeHint
  swipeProgress?: number
  className?: string
  style?: React.CSSProperties
}

export function HageeExploreCard({
  match,
  onViewProfile,
  swipeHint = null,
  swipeProgress = 0,
  className,
  style,
}: HageeExploreCardProps) {
  const passOpacity = swipeHint === "pass" ? Math.min(swipeProgress / 0.25, 1) : 0
  const saveOpacity = swipeHint === "save" ? Math.min(swipeProgress / 0.25, 1) : 0
  const passScale = 0.6 + passOpacity * 0.4
  const saveScale = 0.6 + saveOpacity * 0.4

  return (
    <article
      className={cn(
        "relative h-[min(68vh,560px)] w-full overflow-hidden rounded-[28px] shadow-[0px_8px_32px_rgba(26,26,30,0.12)]",
        className,
      )}
      style={style}
    >
      <Image src={match.photo} alt={match.name} fill className="object-cover" sizes="400px" priority />

      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ opacity: passOpacity }}
      >
        <div
          className="flex size-20 items-center justify-center rounded-full border border-white/40 bg-black/20 shadow-[0px_4px_24px_rgba(0,0,0,0.15)] backdrop-blur-md"
          style={{ transform: `scale(${passScale})` }}
        >
          <X className="size-10 text-white" strokeWidth={2.5} />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ opacity: saveOpacity }}
      >
        <div
          className="flex size-20 items-center justify-center rounded-full border border-white/40 bg-black/20 shadow-[0px_4px_24px_rgba(0,0,0,0.15)] backdrop-blur-md"
          style={{ transform: `scale(${saveScale})` }}
        >
          <Heart className="size-10 text-white" strokeWidth={2.5} />
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/25 via-transparent to-black/70 p-6">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] tracking-wide text-white/90 backdrop-blur-md">
            <Star className="mr-1 inline size-2.5 fill-white text-white" />
            {match.rating.toFixed(1)}
            {match.verified ? " · Verified" : ""}
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-white/90 backdrop-blur-md">
            {match.availabilityLabel}
          </span>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <h2 className="text-2xl font-semibold text-white">
                {match.name}, {match.age}
              </h2>
              {match.badge ? (
                <span className="mb-1 rounded-full border border-hagu-heading bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-hagu-heading backdrop-blur-sm">
                  {match.badge}
                </span>
              ) : null}
            </div>
            <p className="text-sm leading-relaxed text-white">{match.tagline}</p>
            <p className="flex items-center gap-1.5 text-[11px] text-white/60">
              <Clock className="size-3" />
              {match.responseTime}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {match.vibeTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 px-2.5 py-1 text-[9px] uppercase tracking-wide text-white/50"
              >
                {tag}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={onViewProfile}
            onPointerDown={(event) => event.stopPropagation()}
            className="w-full rounded-xl border border-white/15 bg-white/10 py-4 text-sm font-semibold text-white backdrop-blur-xl transition active:bg-white/20"
          >
            View profile
          </button>
        </div>
      </div>
    </article>
  )
}
