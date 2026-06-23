"use client"

import Image from "next/image"
import Link from "next/link"
import { Eye, Pencil, Plus } from "lucide-react"
import { HAGEE_PROFILE } from "@/lib/hagee-profile"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

export function HageeProfileScreen() {
  const profile = HAGEE_PROFILE

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-[#1A1A1E]">My Profile</h1>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex h-[34px] items-center gap-1.5 rounded-full border border-black/[0.09] bg-white px-[15px] text-xs font-medium text-[#4A4A52]"
          >
            <Eye className="size-3" />
            Preview
          </button>
          <Link
            href={`${ROUTES.onboardingHagee}?edit=1&step=4`}
            className="flex h-[34px] items-center gap-1.5 rounded-full bg-[#5BBFB5] px-3.5 text-xs font-medium text-white"
          >
            <Pencil className="size-3" />
            Edit
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-[20px] bg-white shadow-[0px_1px_8px_rgba(0,0,0,0.06)]">
        <div className="relative h-[200px]">
          <Image src={profile.coverImage} alt="" fill className="object-cover" sizes="400px" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <div className="space-y-2.5 px-[18px] pb-[18px] pt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[22px] font-semibold tracking-tight text-[#1A1A1E]">{profile.firstName}</h2>
              <p className="text-sm font-light text-[#8A8A96]">{profile.age} years old</p>
            </div>
            {profile.visible ? (
              <span className="flex items-center gap-1.5 rounded-full border border-[rgba(91,191,181,0.2)] bg-[#EAF7F5] px-3 py-1.5 text-[11px] font-medium text-[#3DA89E]">
                <span className="size-1.5 rounded-sm bg-[#5BBFB5]" />
                Visible
              </span>
            ) : null}
          </div>

          <p className="text-[13px] font-light leading-relaxed text-[#4A4A52]">{profile.bio}</p>

          <div className="flex flex-wrap gap-2">
            {profile.traits.map((trait) => (
              <span
                key={trait.label}
                className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-xs text-[#4A4A52]"
              >
                {trait.emoji} {trait.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { value: String(profile.stats.meetups), label: "Meetups" },
          { value: profile.stats.responseRate, label: "Response" },
          { value: String(profile.stats.badges), label: "Badges" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[14px] bg-[#F7F6F3] px-2.5 py-3 text-center">
            <p className="text-base font-semibold tracking-tight text-[#1A1A1E]">{stat.value}</p>
            <p className="text-[11px] font-light text-[#8A8A96]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[20px] bg-white p-[18px] shadow-[0px_1px_4px_rgba(0,0,0,0.05)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#B8B8C2]">Interests</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {profile.interests.map((interest) => (
            <span
              key={interest.label}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs",
                interest.selected
                  ? "border-[rgba(91,191,181,0.2)] bg-[#EAF7F5] font-medium text-[#3DA89E]"
                  : "border-black/[0.08] bg-white text-[#4A4A52]",
              )}
            >
              {interest.emoji} {interest.label}
            </span>
          ))}
          <span className="rounded-full border border-dashed border-black/[0.12] px-3 py-1.5 text-xs text-[#B8B8C2]">
            + Add more
          </span>
        </div>
      </div>

      <div className="rounded-[20px] bg-white p-[18px] shadow-[0px_1px_4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#B8B8C2]">Photos</p>
          <button type="button" className="text-xs font-medium text-[#5BBFB5]">
            Manage
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          {profile.photos.map((photo) => (
            <div key={photo} className="relative size-[60px] overflow-hidden rounded-[10px]">
              <Image src={photo} alt="" fill className="object-cover" sizes="60px" />
            </div>
          ))}
          <button
            type="button"
            className="flex size-[60px] flex-col items-center justify-center gap-1 rounded-[10px] border border-dashed border-[rgba(91,191,181,0.4)] bg-[#F7F6F3] text-[10px] font-medium text-[#5BBFB5]"
          >
            <Plus className="size-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
