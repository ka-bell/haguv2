"use client"

import { Clock, Star } from "lucide-react"
import type { HageeCompanionProfile } from "@/lib/hagee-companion-profiles"
import { HageeProfilePhotoCarousel } from "@/components/hagee/hagee-profile-photo-carousel"
import { cn } from "@/lib/utils"

type HageeCompanionProfileScreenProps = {
  profile: HageeCompanionProfile
}

export function HageeCompanionProfileScreen({ profile }: HageeCompanionProfileScreenProps) {
  return (
    <div className="space-y-5 pb-4">
      <div className="hagu-surface-card overflow-hidden">
        <HageeProfilePhotoCarousel
          photos={profile.photos}
          name={profile.name}
          overlay={
            <div className="space-y-2 px-5 pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[26px] font-semibold tracking-tight text-white">
                  {profile.name}, {profile.age}
                </h1>
                {profile.verified ? (
                  <span className="rounded-full bg-hagu-accent-selected px-2.5 py-1 text-[10px] font-semibold text-hagu-accent-strong">
                    Verified
                  </span>
                ) : null}
              </div>
              <p className="text-[14px] text-white/90">{profile.role}</p>
              <p className="max-w-[28rem] text-[13px] leading-relaxed text-white/80">{profile.tagline}</p>
            </div>
          }
        />

        <div className="grid grid-cols-3 gap-px bg-hagu-border">
          {[
            { value: profile.rating.toFixed(1), label: "Rating" },
            { value: profile.availabilityLabel, label: "Availability" },
            { value: "Fast", label: "Response" },
          ].map((stat) => (
            <div key={stat.label} className="bg-hagu-white px-2.5 py-3.5 text-center">
              <p
                className={cn(
                  "font-semibold tracking-tight text-hagu-ink",
                  stat.label === "Availability" ? "text-[13px] leading-snug line-clamp-2" : "text-base",
                )}
              >
                {stat.value}
              </p>
              <p className="text-[11px] text-hagu-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {profile.services.length > 0 ? (
        <section className="hagu-surface-card p-5">
          <p className="hagu-section-label">Services</p>
          <p className="mt-1 text-[13px] text-hagu-text-secondary">Choose what you&apos;d like to book</p>
          <div className="mt-4 divide-y divide-hagu-border">
            {profile.services.map((service) => (
              <div key={service.id} className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-[15px] font-medium text-hagu-ink">{service.label}</p>
                  <p className="mt-0.5 text-[13px] text-hagu-text-secondary">{service.duration}</p>
                </div>
                <p className="shrink-0 text-[15px] font-semibold text-hagu-ink">{service.price}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="hagu-surface-card p-5">
        <p className="hagu-section-label">About</p>
        <p className="mt-2 text-[15px] leading-relaxed text-hagu-label">{profile.bio}</p>
        <p className="mt-3 flex items-center gap-1.5 text-[13px] text-hagu-text-secondary">
          <Clock className="size-3.5 shrink-0" />
          {profile.responseTime}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-[13px] text-hagu-text-secondary">
          <Star className="size-3.5 shrink-0 fill-hagu-accent-strong text-hagu-accent-strong" />
          {profile.availabilityLabel}
        </p>
      </section>

      {profile.interests.length > 0 ? (
        <section className="hagu-surface-card p-5">
          <p className="hagu-section-label">Interests</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="rounded-full bg-hagu-accent-selected px-3 py-1.5 text-xs font-medium text-hagu-accent-strong"
              >
                {interest}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {profile.vibeTags.length > 0 ? (
        <section className="hagu-surface-card p-5">
          <p className="hagu-section-label">Vibe</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.vibeTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-hagu-border bg-hagu-surface-muted px-3 py-1.5 text-xs text-hagu-label"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
