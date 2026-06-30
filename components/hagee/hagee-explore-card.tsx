"use client"

import Image from "next/image"
import { Clock, Heart, Star, X } from "lucide-react"
import type { HageeExploreMatch } from "@/lib/hagee-explore"
import { cn } from "@/lib/utils"

export type HageeExploreSwipeHint = "pass" | "save" | null

interface HageeExploreCardProps {
  match: HageeExploreMatch
  sharedInterests?: string[]
  onViewProfile?: () => void
  onSkip?: () => void
  onSave?: () => void
  actionsDisabled?: boolean
  showActions?: boolean
  swipeHint?: HageeExploreSwipeHint
  swipeProgress?: number
  className?: string
  style?: React.CSSProperties
}

export function HageeExploreCard({
  match,
  sharedInterests = [],
  onViewProfile,
  onSkip,
  onSave,
  actionsDisabled = false,
  showActions = false,
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
        "relative h-full min-h-0 w-full overflow-hidden rounded-[20px] border border-hagu-border shadow-[0px_2px_8px_rgba(26,26,30,0.04)]",
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
          className="flex size-20 items-center justify-center rounded-full border border-white/30 bg-black/35"
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
          className="flex size-20 items-center justify-center rounded-full border border-white/30 bg-black/35"
          style={{ transform: `scale(${saveScale})` }}
        >
          <Heart className="size-10 text-white" strokeWidth={2.5} />
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/25 via-transparent to-black/80">
        <div className="p-6 pr-[4.75rem]">
          <div className="flex items-start justify-between gap-2">
            <span className="rounded-full bg-black/40 px-3 py-1.5 text-[10px] tracking-wide text-white">
              <Star className="mr-1 inline size-2.5 fill-white text-white" />
              {match.rating.toFixed(1)}
              {match.verified ? " · Verified" : ""}
            </span>
            <span className="rounded-full bg-black/40 px-3 py-1.5 text-[10px] text-white">
              {match.availabilityLabel}
            </span>
          </div>
        </div>

        <div className="mt-auto">
          <div className="space-y-5 p-6 pr-[4.75rem] pb-0">
            <div className="space-y-2">
              <div className="flex items-end gap-2">
                <h2 className="text-[22px] font-semibold tracking-tight text-white">
                  {match.name}, {match.age}
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-white">{match.tagline}</p>
              {sharedInterests.length > 0 ? (
                <div className="space-y-1">
                  <span className="inline-flex items-center rounded-full border border-hagu-glass-border bg-hagu-accent-selected/90 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-hagu-accent-strong">
                    {sharedInterests.length} shared interest{sharedInterests.length === 1 ? "" : "s"}
                  </span>
                  <p className="text-[11px] text-white/75">
                    {sharedInterests.slice(0, 3).join(" · ")}
                    {sharedInterests.length > 3 ? ` +${sharedInterests.length - 3} more` : ""}
                  </p>
                </div>
              ) : null}
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
          </div>

          <div className="flex justify-center px-6 pb-6 pt-5">
            <button
              type="button"
              onClick={onViewProfile}
              onPointerDown={(event) => event.stopPropagation()}
              className="h-11 w-full max-w-[18rem] rounded-[10px] bg-hagu-white px-8 text-sm font-medium text-hagu-heading transition"
            >
              View profile
            </button>
          </div>
        </div>
      </div>

      {showActions && onSkip && onSave ? (
        <div
          className="absolute right-3 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-4"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Skip"
            disabled={actionsDisabled}
            onClick={onSkip}
            className="flex size-14 items-center justify-center rounded-full border border-white/20 bg-white/95 text-hagu-heading shadow-[0px_4px_16px_rgba(0,0,0,0.18)] transition disabled:opacity-50"
          >
            <X className="size-6" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            aria-label="Save"
            disabled={actionsDisabled}
            onClick={onSave}
            className="flex size-14 items-center justify-center rounded-full bg-hagu-heading text-white shadow-[0px_8px_24px_rgba(0,0,0,0.28)] transition disabled:opacity-50"
          >
            <Heart className="size-6 fill-current" strokeWidth={2} />
          </button>
        </div>
      ) : null}
    </article>
  )
}
