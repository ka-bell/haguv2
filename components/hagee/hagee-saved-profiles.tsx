"use client"

import Image from "next/image"
import { Heart } from "lucide-react"
import type { HageeExploreMatch } from "@/lib/hagee-explore"

interface HageeSavedProfilesProps {
  profiles: HageeExploreMatch[]
}

export function HageeSavedProfiles({ profiles }: HageeSavedProfilesProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-hagu-heading">Bewaarde profielen</h2>
        {profiles.length > 0 ? (
          <span className="text-xs font-medium text-hagu-accent-strong">{profiles.length}</span>
        ) : null}
      </div>

      {profiles.length === 0 ? (
        <div className="flex items-center gap-3 rounded-[20px] border border-dashed border-hagu-border bg-hagu-white px-4 py-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-hagu-surface-muted">
            <Heart className="size-4 text-hagu-placeholder" />
          </div>
          <p className="text-sm leading-relaxed text-hagu-text-secondary">
            Swipe naar rechts om profielen te bewaren. Ze verschijnen hier.
          </p>
        </div>
      ) : (
        <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
          {profiles.map((profile) => (
            <article
              key={profile.id}
              className="w-[140px] shrink-0 overflow-hidden rounded-[16px] border border-hagu-border bg-hagu-white shadow-[0px_2px_8px_rgba(0,0,0,0.05)]"
            >
              <div className="relative h-[168px]">
                <Image
                  src={profile.photo}
                  alt={profile.name}
                  fill
                  className="object-cover"
                  sizes="140px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {profile.badge ? (
                  <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-hagu-heading">
                    {profile.badge}
                  </span>
                ) : null}
                <div className="absolute inset-x-2.5 bottom-2.5">
                  <p className="text-sm font-semibold text-white">
                    {profile.name}, {profile.age}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-white/75">
                    {profile.tagline}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
