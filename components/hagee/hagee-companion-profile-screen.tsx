"use client"

import { Clock, Star } from "lucide-react"
import type { HageeCompanionProfile } from "@/lib/hagee-companion-profiles"
import { HageeProfilePhotoCarousel } from "@/components/hagee/hagee-profile-photo-carousel"

type HageeCompanionProfileScreenProps = {
  profile: HageeCompanionProfile
  onBookService?: (serviceId: string) => void
}

export function HageeCompanionProfileScreen({ profile, onBookService }: HageeCompanionProfileScreenProps) {
  return (
    <div className="space-y-5 pb-4">
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
                <span className="rounded-full border border-hagu-border bg-hagu-canvas px-2.5 py-1 text-[10px] font-semibold text-hagu-ink">
                  Verified
                </span>
              ) : null}
            </div>
            <p className="text-[14px] text-white/90">{profile.role}</p>
            <p className="max-w-[28rem] text-[13px] leading-relaxed text-white/80">{profile.tagline}</p>
          </div>
        }
      />

      <section className="hagu-surface-card p-5">
        <p className="hagu-section-label">About</p>
        <p className="mt-2 text-[15px] leading-relaxed text-hagu-label">{profile.bio}</p>
        <p className="mt-3 flex items-center gap-1.5 text-[13px] text-hagu-text-secondary">
          <Clock className="size-3.5 shrink-0" />
          {profile.responseTime}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-[13px] text-hagu-text-secondary">
          <Star className="size-3.5 shrink-0 fill-hagu-ink text-hagu-ink" />
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
                className="rounded-full border border-hagu-border bg-hagu-white px-3 py-1.5 text-xs font-medium text-hagu-label"
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
                className="rounded-full border border-hagu-border bg-hagu-white px-3 py-1.5 text-xs text-hagu-label"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {profile.services.length > 0 ? (
        <section className="hagu-surface-card p-5">
          <p className="hagu-section-label">Services</p>
          <p className="mt-1 text-[13px] text-hagu-text-secondary">Choose what you&apos;d like to book</p>
          <div className="mt-4 divide-y divide-hagu-border">
            {profile.services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => onBookService?.(service.id)}
                className="flex w-full items-start justify-between gap-4 py-3.5 text-left first:pt-0 last:pb-0 transition active:opacity-80"
              >
                <div className="min-w-0">
                  <p className="text-[15px] font-medium text-hagu-ink">{service.label}</p>
                  <p className="mt-0.5 text-[13px] text-hagu-text-secondary">{service.duration}</p>
                </div>
                <p className="shrink-0 text-[15px] font-semibold text-hagu-ink">{service.price}</p>
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
