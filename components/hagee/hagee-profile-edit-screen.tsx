"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Camera, ChevronLeft } from "lucide-react"
import { HaguToggle } from "@/components/ui/hagu-toggle"
import { PageFixedHeader } from "@/components/ui/page-shell"
import { CHARACTER_OPTIONS } from "@/app/onboarding/hagee/data"
import {
  DEFAULT_HAGEE_PROFILE_DATA,
  getHageeProfileData,
  saveHageeProfileData,
  type HageeProfileData,
} from "@/lib/hagee-profile-storage"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

const BIO_MAX = 200

function ProfileEditSection({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "rounded-[20px] bg-hagu-white p-[18px] shadow-[0px_1px_4px_rgba(0,0,0,0.05)]",
        className,
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-hagu-placeholder">{title}</p>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  bordered = true,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  bordered?: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-3",
        bordered && "border-b border-black/[0.05] last:border-b-0",
      )}
    >
      <div className="min-w-0">
        <p className="text-sm text-hagu-ink">{label}</p>
        {description ? <p className="text-xs text-hagu-text-secondary">{description}</p> : null}
      </div>
      <HaguToggle checked={checked} onChange={onChange} label={label} />
    </div>
  )
}

export function HageeProfileEditScreen() {
  const router = useRouter()
  const [profile, setProfile] = useState<HageeProfileData>(DEFAULT_HAGEE_PROFILE_DATA)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setProfile(getHageeProfileData())
    setLoaded(true)
  }, [])

  const update = <K extends keyof HageeProfileData>(key: K, value: HageeProfileData[K]) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  const toggleTrait = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      traitIds: prev.traitIds.includes(id)
        ? prev.traitIds.filter((traitId) => traitId !== id)
        : [...prev.traitIds, id],
    }))
  }

  const handleSave = () => {
    const traits = CHARACTER_OPTIONS.filter((option) => profile.traitIds.includes(option.id)).map(
      (option) => ({ emoji: option.emoji, label: option.label }),
    )
    saveHageeProfileData({
      ...profile,
      traits,
      visible: profile.visibility.showAsAvailable && !profile.paused,
      firstName: profile.firstName.trim() || "Alex",
      age: Number(profile.age) || DEFAULT_HAGEE_PROFILE_DATA.age,
    })
    router.push(ROUTES.profile)
  }

  if (!loaded) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md items-center justify-center bg-hagu-canvas">
        <p className="text-sm text-hagu-text-secondary">Loading…</p>
      </main>
    )
  }

  const bioLength = profile.bio.length

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-hagu-canvas text-hagu-ink">
      <PageFixedHeader className="border-b border-black/[0.06] bg-hagu-canvas/90 px-5 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push(ROUTES.profile)}
            aria-label="Go back"
            className="flex size-8 items-center justify-center rounded-2xl border border-hagu-border bg-hagu-white shadow-[0px_1px_4px_rgba(0,0,0,0.08)]"
          >
            <ChevronLeft className="size-4 text-hagu-heading" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-hagu-heading">Edit Profile</h1>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-hagu-accent-strong px-3.5 py-1.5 text-xs font-medium text-white"
          >
            Save
          </button>
        </div>
      </PageFixedHeader>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-10 pt-[calc(3.5rem+3.25rem)]">
        <div className="relative h-40 overflow-hidden rounded-[20px]">
          <Image src={profile.coverImage} alt="" fill className="object-cover" sizes="400px" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/35">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-hagu-heading"
            >
              <Camera className="size-3.5" />
              Change photo
            </button>
          </div>
        </div>

        <ProfileEditSection title="Basic info">
          <div className="space-y-2.5">
            <label className="block space-y-1">
              <span className="text-[11px] font-medium tracking-[0.2px] text-hagu-text-secondary">
                First name
              </span>
              <input
                value={profile.firstName}
                onChange={(event) => update("firstName", event.target.value)}
                className="w-full rounded-xl border border-hagu-accent-strong bg-hagu-white px-[15px] py-3 text-sm text-hagu-heading outline-none"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-[11px] font-medium tracking-[0.2px] text-hagu-text-secondary">Age</span>
              <input
                type="number"
                min={18}
                max={99}
                value={profile.age}
                onChange={(event) => update("age", Number(event.target.value))}
                className="w-full rounded-xl border border-hagu-border bg-hagu-surface-muted px-[15px] py-3 text-sm text-hagu-heading outline-none"
              />
            </label>
          </div>
        </ProfileEditSection>

        <ProfileEditSection title="About you">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="sr-only">Bio</span>
              <span className="text-[11px] text-hagu-placeholder">
                {bioLength} / {BIO_MAX}
              </span>
            </div>
            <textarea
              value={profile.bio.replace(/^"|"$/g, "")}
              maxLength={BIO_MAX}
              rows={4}
              onChange={(event) => update("bio", event.target.value)}
              className="w-full resize-none rounded-xl border border-hagu-border bg-hagu-surface-muted px-[15px] py-3 text-sm leading-relaxed text-hagu-heading outline-none"
            />
            <p className="text-[11px] leading-relaxed text-hagu-text-secondary">
              This is the first thing people read. Keep it honest and specific — generic bios get fewer
              requests.
            </p>
            <div className="flex flex-wrap gap-2">
              {CHARACTER_OPTIONS.map((option) => {
                const selected = profile.traitIds.includes(option.id)
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleTrait(option.id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs transition",
                      selected
                        ? "border-hagu-accent-strong bg-hagu-accent-selected text-hagu-accent-strong"
                        : "border-hagu-border bg-hagu-white text-hagu-label",
                    )}
                  >
                    {option.emoji} {option.label}
                  </button>
                )
              })}
            </div>
          </div>
        </ProfileEditSection>

        <ProfileEditSection title="Visibility">
          <ToggleRow
            label="Show as available"
            description="Appear in match results"
            checked={profile.visibility.showAsAvailable}
            onChange={(checked) =>
              update("visibility", { ...profile.visibility, showAsAvailable: checked })
            }
          />
          <ToggleRow
            label="Show interests publicly"
            description="Visible on your profile"
            checked={profile.visibility.showInterestsPublicly}
            onChange={(checked) =>
              update("visibility", { ...profile.visibility, showInterestsPublicly: checked })
            }
          />
          <ToggleRow
            label="Show character traits"
            description="Soft signals, not labels"
            checked={profile.visibility.showCharacterTraits}
            onChange={(checked) =>
              update("visibility", { ...profile.visibility, showCharacterTraits: checked })
            }
            bordered={false}
          />
        </ProfileEditSection>

        <ProfileEditSection title="Notifications">
          <ToggleRow
            label="New match requests"
            checked={profile.notifications.newMatchRequests}
            onChange={(checked) =>
              update("notifications", { ...profile.notifications, newMatchRequests: checked })
            }
          />
          <ToggleRow
            label="Messages"
            checked={profile.notifications.messages}
            onChange={(checked) =>
              update("notifications", { ...profile.notifications, messages: checked })
            }
          />
          <ToggleRow
            label="Weekly digest"
            checked={profile.notifications.weeklyDigest}
            onChange={(checked) =>
              update("notifications", { ...profile.notifications, weeklyDigest: checked })
            }
            bordered={false}
          />
        </ProfileEditSection>

        <ProfileEditSection title="Account">
          <button
            type="button"
            onClick={() => update("paused", !profile.paused)}
            className="w-full rounded-xl border border-red-500/20 py-3 text-[13px] text-red-600"
          >
            {profile.paused ? "Resume my profile" : "Pause my profile"}
          </button>
          <button type="button" className="mt-2 w-full py-2 text-[13px] text-hagu-placeholder">
            Delete account
          </button>
        </ProfileEditSection>
      </div>
    </main>
  )
}
