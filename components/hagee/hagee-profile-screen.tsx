"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ChevronRight, Pencil, Plus } from "lucide-react"
import {
  DEFAULT_HAGEE_PROFILE_DATA,
  getHageeProfileData,
  type HageeProfileData,
} from "@/lib/hagee-profile-storage"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

function ProfileSection({
  title,
  action,
  children,
  className,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("hagu-surface-card p-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="hagu-section-label">{title}</p>
        {action}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  )
}

export function HageeProfileScreen() {
  const [profile, setProfile] = useState<HageeProfileData>(DEFAULT_HAGEE_PROFILE_DATA)

  useEffect(() => {
    setProfile(getHageeProfileData())
  }, [])

  const visibleInterests = profile.visibility.showInterestsPublicly
    ? profile.interests.filter((interest) => interest.selected)
    : []
  const visibleTraits = profile.visibility.showCharacterTraits ? profile.traits : []
  const bio = profile.bio.replace(/^"|"$/g, "")

  return (
    <div className="space-y-5 pb-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="hagu-page-greeting">Your profile</p>
          <h1 className="hagu-page-title">{profile.firstName}</h1>
        </div>
        <Link
          href={ROUTES.profileEdit}
          className="flex h-[34px] shrink-0 items-center gap-1.5 rounded-full bg-hagu-accent-strong px-3.5 text-xs font-medium text-white"
        >
          <Pencil className="size-3" />
          Edit
        </Link>
      </div>

      <div className="hagu-surface-card">
        <div className="relative h-[200px]">
          <Image src={profile.coverImage} alt="" fill className="object-cover" sizes="400px" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[22px] font-semibold tracking-tight text-white">{profile.firstName}</h2>
              <span className="text-sm text-white/80">{profile.age}</span>
              {profile.visible && !profile.paused ? (
                <span className="rounded-full bg-hagu-accent-selected px-2.5 py-1 text-[10px] font-semibold text-hagu-accent-strong">
                  Visible
                </span>
              ) : null}
            </div>
            {bio ? <p className="max-w-[28rem] text-[13px] leading-relaxed text-white/85">{bio}</p> : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-hagu-border">
          {[
            { value: String(profile.stats.meetups), label: "Meetups" },
            { value: profile.stats.responseRate, label: "Response rate" },
          ].map((stat) => (
            <div key={stat.label} className="bg-hagu-white px-4 py-3.5 text-center">
              <p className="text-lg font-semibold tracking-tight text-hagu-ink">{stat.value}</p>
              <p className="text-[11px] text-hagu-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {visibleTraits.length > 0 ? (
        <ProfileSection title="Character">
          <div className="flex flex-wrap gap-2">
            {visibleTraits.map((trait) => (
              <span
                key={trait.label}
                className="rounded-full border border-hagu-border bg-hagu-surface-muted px-3 py-1.5 text-xs text-hagu-label"
              >
                {trait.emoji} {trait.label}
              </span>
            ))}
          </div>
        </ProfileSection>
      ) : null}

      {visibleInterests.length > 0 ? (
        <ProfileSection
          title="Interests"
          action={
            <Link href={ROUTES.profileEdit} className="text-[13px] font-medium text-hagu-accent-strong">
              Edit
            </Link>
          }
        >
          <div className="flex flex-wrap gap-2">
            {visibleInterests.map((interest) => (
              <span
                key={interest.label}
                className="rounded-full bg-hagu-accent-selected px-3 py-1.5 text-xs font-medium text-hagu-accent-strong"
              >
                {interest.emoji} {interest.label}
              </span>
            ))}
          </div>
        </ProfileSection>
      ) : null}

      <ProfileSection
        title="Photos"
        action={
          <Link href={ROUTES.profileEdit} className="text-[13px] font-medium text-hagu-accent-strong">
            Manage
          </Link>
        }
      >
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {profile.photos.map((photo) => (
            <div key={photo} className="relative size-16 shrink-0 overflow-hidden rounded-[20px]">
              <Image src={photo} alt="" fill className="object-cover" sizes="64px" />
            </div>
          ))}
          <Link
            href={ROUTES.profileEdit}
            className="flex size-16 shrink-0 flex-col items-center justify-center gap-1 rounded-[20px] bg-hagu-surface-muted text-[10px] font-medium text-hagu-label"
          >
            <Plus className="size-4" />
            Add
          </Link>
        </div>
      </ProfileSection>

      <Link
        href={ROUTES.profileEdit}
        className="flex items-center justify-between hagu-surface-card px-5 py-4 transition"
      >
        <div>
          <p className="text-sm font-medium text-hagu-ink">Profile settings</p>
          <p className="text-xs text-hagu-text-secondary">Visibility, notifications, account</p>
        </div>
        <ChevronRight className="size-4 text-hagu-placeholder" />
      </Link>
    </div>
  )
}
