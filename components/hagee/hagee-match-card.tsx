"use client"

import Image from "next/image"
import type { HageeMatch } from "@/lib/hagee-discover"
import { cn } from "@/lib/utils"

interface HageeMatchCardProps {
  match: HageeMatch
  featured?: boolean
  onRequest?: () => void
}

export function HageeMatchCard({ match, featured = false, onRequest }: HageeMatchCardProps) {
  return (
    <article className={cn("hagu-surface-card", featured && "shadow-[0px_4px_16px_rgba(26,26,30,0.06)]")}>
      <div className="relative h-[240px]">
        <Image src={match.photo} alt={match.name} fill className="object-cover" sizes="400px" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        {match.availableToday ? (
          <span className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-hagu-accent-strong px-3 py-1.5 text-[11px] font-medium text-white">
            <span className="size-1.5 rounded-sm bg-white/90" />
            Available today
          </span>
        ) : null}

        <span className="absolute right-2 top-2 rounded-full bg-hagu-heading px-2.5 py-1 text-[11px] font-semibold text-white">
          {match.matchPercent}% match
        </span>

        <div className="absolute inset-x-3.5 bottom-3.5">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-[22px] font-semibold tracking-tight text-white">
                {match.name}, {match.age}
              </p>
              <p className="text-xs text-white/75">{match.responseTime}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-1.5">
              {match.photoTags.map((tag) => (
                <span key={tag} className="rounded-full bg-black/40 px-2.5 py-1 text-[11px] text-white">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <p className="text-[13px] leading-relaxed text-hagu-label">{match.bio}</p>

        <div>
          <p className="hagu-section-label">You both</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {match.sharedTraits.map((trait) => (
              <span
                key={trait}
                className="rounded-full bg-hagu-accent-selected px-3 py-1 text-[11px] font-medium text-hagu-accent-strong"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="hagu-section-label">Interests</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {match.sharedInterests.map((interest) => (
              <span
                key={interest}
                className="rounded-full bg-hagu-accent-selected px-3 py-1 text-[11px] font-medium text-hagu-accent-strong"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onRequest}
          className="hagu-action-btn-dark w-full"
        >
          Request time with {match.name}
        </button>
      </div>
    </article>
  )
}
