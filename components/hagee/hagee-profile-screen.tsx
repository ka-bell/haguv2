"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Eye, Pencil, Plus } from "lucide-react"
import {
  DEFAULT_HAGEE_PROFILE_DATA,
  getHageeProfileData,
  type HageeProfileData,
} from "@/lib/hagee-profile-storage"
import { ROUTES } from "@/lib/routes"

export function HageeProfileScreen() {
  const [profile, setProfile] = useState<HageeProfileData>(DEFAULT_HAGEE_PROFILE_DATA)

  useEffect(() => {
    setProfile(getHageeProfileData())
  }, [])

  const visibleInterests = profile.visibility.showInterestsPublicly
    ? profile.interests.filter((interest) => interest.selected)
    : []
  const visibleTraits = profile.visibility.showCharacterTraits ? profile.traits : []

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-hagu-heading">My Profile</h1>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex h-[34px] items-center gap-1.5 rounded-full border border-hagu-border bg-hagu-white px-[15px] text-xs font-medium text-hagu-label"
          >
            <Eye className="size-3" />
            Preview
          </button>
          <Link
            href={ROUTES.profileEdit}
            className="flex h-[34px] items-center gap-1.5 rounded-full bg-hagu-accent-strong px-3.5 text-xs font-medium text-white"
          >
            <Pencil className="size-3" />
            Edit
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-[20px] bg-hagu-white shadow-[0px_1px_8px_rgba(0,0,0,0.06)]">
        <div className="relative h-[200px]">
          <Image src={profile.coverImage} alt="" fill className="object-cover" sizes="400px" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <div className="space-y-2.5 px-[18px] pb-[18px] pt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[22px] font-semibold tracking-tight text-hagu-heading">
                {profile.firstName}
              </h2>
              <p className="text-sm text-hagu-text-secondary">{profile.age} years old</p>
            </div>
            {profile.visible && !profile.paused ? (
              <span className="flex items-center gap-1.5 rounded-full border border-[rgba(91,191,181,0.2)] bg-hagu-accent-selected px-3 py-1.5 text-[11px] font-medium text-hagu-accent-strong">
                <span className="size-1.5 rounded-sm bg-hagu-accent-strong" />
                Visible
              </span>
            ) : null}
          </div>

          <p className="text-[13px] leading-relaxed text-hagu-label">
            {profile.bio.startsWith('"') ? profile.bio : `"${profile.bio}"`}
          </p>

          {visibleTraits.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {visibleTraits.map((trait) => (
                <span
                  key={trait.label}
                  className="rounded-full border border-hagu-border bg-hagu-white px-3 py-1.5 text-xs text-hagu-label"
                >
                  {trait.emoji} {trait.label}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { value: String(profile.stats.meetups), label: "Meetups" },
          { value: profile.stats.responseRate, label: "Response" },
          { value: String(profile.stats.badges), label: "Badges" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[14px] bg-hagu-surface-muted px-2.5 py-3 text-center">
            <p className="text-base font-semibold tracking-tight text-hagu-heading">{stat.value}</p>
            <p className="text-[11px] text-hagu-text-secondary">{stat.label}</p>
          </div>
        ))}
      </div>

      {visibleInterests.length > 0 ? (
        <div className="rounded-[20px] bg-hagu-white p-[18px] shadow-[0px_1px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-hagu-placeholder">
            Interests
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {visibleInterests.map((interest) => (
              <span
                key={interest.label}
                className="rounded-full border border-[rgba(91,191,181,0.2)] bg-hagu-accent-selected px-3 py-1.5 text-xs font-medium text-hagu-accent-strong"
              >
                {interest.emoji} {interest.label}
              </span>
            ))}
            <Link
              href={ROUTES.profileEdit}
              className="rounded-full border border-dashed border-hagu-border px-3 py-1.5 text-xs text-hagu-placeholder"
            >
              + Add more
            </Link>
          </div>
        </div>
      ) : null}

      <div className="rounded-[20px] bg-hagu-white p-[18px] shadow-[0px_1px_4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-hagu-placeholder">
            Photos
          </p>
          <Link href={ROUTES.profileEdit} className="text-xs font-medium text-hagu-accent-strong">
            Manage
          </Link>
        </div>
        <div className="mt-3 flex gap-2">
          {profile.photos.map((photo) => (
            <div key={photo} className="relative size-[60px] overflow-hidden rounded-[10px]">
              <Image src={photo} alt="" fill className="object-cover" sizes="60px" />
            </div>
          ))}
          <button
            type="button"
            className="flex size-[60px] flex-col items-center justify-center gap-1 rounded-[10px] border border-dashed border-[rgba(91,191,181,0.4)] bg-hagu-surface-muted text-[10px] font-medium text-hagu-accent-strong"
          >
            <Plus className="size-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
