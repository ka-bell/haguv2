"use client"

import {
  BadgeCheck,
  ChevronRight,
  ClipboardList,
  MapPin,
  Pencil,
  Sparkles,
  User,
  Wallet,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { HaguProfileStatusBadge } from "@/components/hagu/hagu-profile-status-badge"
import { HaguPrototypeSheet } from "@/components/hagu/hagu-prototype-sheet"
import { HaguToggle } from "@/components/ui/hagu-toggle"
import type { HaguStep } from "@/app/onboarding/hagu/data"
import { useProviderProfileStatus } from "@/hooks/use-provider-profile-status"
import { haguOnboardingEditUrl, SETTINGS_ONBOARDING_STEP } from "@/lib/hagu-onboarding"
import { HAGU_PROVIDER_PROFILE } from "@/lib/hagu-provider-profile"
import { ROUTES } from "@/lib/routes"
import { logout } from "@/lib/session"
import { clearProviderProfileStatus } from "@/lib/hagu-provider-status"
import { clearCompletedReviews } from "@/lib/hagu-review-storage"
import { cn } from "@/lib/utils"

type SettingsOverlay = "notifications" | "privacy" | "pause" | null

type SettingsRowConfig = {
  id: string
  label: string
  sublabel?: string
  icon?: React.ComponentType<{ className?: string }>
  stripe?: boolean
  accent?: boolean
  href?: string
  step?: HaguStep
  overlay?: SettingsOverlay
}

const PROFILE_ROWS: SettingsRowConfig[] = [
  { id: "about", label: "About me & bio", icon: User, step: SETTINGS_ONBOARDING_STEP.about },
  {
    id: "service-menu",
    label: "Service menu",
    icon: ClipboardList,
    step: SETTINGS_ONBOARDING_STEP["service-menu"],
  },
  {
    id: "character",
    label: "Character & interests",
    icon: Sparkles,
    step: SETTINGS_ONBOARDING_STEP.character,
  },
  { id: "rates", label: "Rates & location", icon: MapPin, step: SETTINGS_ONBOARDING_STEP.rates },
]

const FINANCE_ROWS: SettingsRowConfig[] = [
  {
    id: "earnings",
    label: "Earnings & transactions",
    icon: Wallet,
    href: ROUTES.settingsTransactions,
  },
  {
    id: "stripe",
    label: HAGU_PROVIDER_PROFILE.stripeLabel,
    sublabel: HAGU_PROVIDER_PROFILE.stripeStatus,
    stripe: true,
    step: SETTINGS_ONBOARDING_STEP.stripe,
  },
]

const ACCOUNT_ROWS: SettingsRowConfig[] = [
  { id: "notifications", label: "Notifications", overlay: "notifications" },
  { id: "privacy", label: "Privacy & safety", overlay: "privacy" },
  {
    id: "identity",
    label: "Identity verified",
    sublabel: "ID confirmed",
    icon: BadgeCheck,
    accent: true,
    step: SETTINGS_ONBOARDING_STEP.identity,
  },
]

export function HaguSettingsScreen() {
  const router = useRouter()
  const [overlay, setOverlay] = useState<SettingsOverlay>(null)
  const { isActive, setProfileStatus } = useProviderProfileStatus()
  const profile = HAGU_PROVIDER_PROFILE

  const openOnboardingStep = (step: HaguStep) => {
    router.push(haguOnboardingEditUrl(step))
  }

  const handleRowClick = (row: SettingsRowConfig) => {
    if (row.href) {
      router.push(row.href)
      return
    }
    if (row.step) {
      openOnboardingStep(row.step)
      return
    }
    if (row.overlay) {
      setOverlay(row.overlay)
    }
  }

  const handleLogout = () => {
    clearProviderProfileStatus()
    clearCompletedReviews()
    logout()
    router.push(ROUTES.entry)
  }

  return (
    <>
      <div className="space-y-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="hagu-page-greeting">Your profile</p>
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              <h1 className="hagu-page-title">{profile.displayName}</h1>
              <HaguProfileStatusBadge active={isActive} />
            </div>
            <p className="mt-0.5 text-[13px] text-hagu-text-secondary">
              {profile.tagline} · {profile.neighborhood}
            </p>
          </div>
          <button
            type="button"
            onClick={() => openOnboardingStep(SETTINGS_ONBOARDING_STEP["edit-profile"])}
            className="flex h-[34px] shrink-0 items-center gap-1.5 rounded-full bg-hagu-accent-strong px-3.5 text-xs font-medium text-white"
          >
            <Pencil className="size-3" />
            Edit
          </button>
        </div>

        <div className="hagu-surface-card">
          <div className="relative h-[168px]">
            <Image
              src={profile.coverImage}
              alt=""
              fill
              className="object-cover"
              sizes="400px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-5">
              <div className="relative size-[60px] overflow-hidden rounded-[20px] border-2 border-hagu-white shadow-sm">
                <Image
                  src={profile.photo}
                  alt={profile.displayName}
                  fill
                  className="object-cover"
                  sizes="60px"
                />
              </div>
              <span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-hagu-white",
                  isActive ? "bg-hagu-accent-strong" : "bg-hagu-placeholder",
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-px bg-hagu-border">
            {[
              { value: profile.stats.rating, label: "Rating" },
              { value: profile.stats.sessions, label: "Sessions" },
              { value: profile.stats.responseRate, label: "Response" },
            ].map((stat) => (
              <div key={stat.label} className="bg-hagu-white px-3 py-3.5 text-center">
                <p className="text-lg font-semibold tracking-tight text-hagu-ink">{stat.value}</p>
                <p className="text-[11px] text-hagu-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <SettingsSection title="Profile">
          {PROFILE_ROWS.map((row, index) => (
            <SettingsRow
              key={row.id}
              row={row}
              showBorder={index < PROFILE_ROWS.length - 1}
              onClick={() => handleRowClick(row)}
            />
          ))}
        </SettingsSection>

        <SettingsSection title="Finance">
          {FINANCE_ROWS.map((row, index) => (
            <SettingsRow
              key={row.id}
              row={row}
              showBorder={index < FINANCE_ROWS.length - 1}
              onClick={() => handleRowClick(row)}
            />
          ))}
        </SettingsSection>

        <SettingsSection title="Account">
          <div className="flex items-center justify-between gap-3 border-b border-hagu-border px-5 py-3.5">
            <div>
              <p className="text-[15px] font-medium text-hagu-ink">Profile visible</p>
              <p className="text-[11px] text-hagu-text-secondary">
                {isActive ? "Shown in search · receiving requests" : "Hidden from search"}
              </p>
            </div>
            <HaguToggle
              checked={isActive}
              label="Profile visible"
              onChange={(checked) => setProfileStatus(checked ? "active" : "paused")}
            />
          </div>
          {ACCOUNT_ROWS.map((row, index) => (
            <SettingsRow
              key={row.id}
              row={row}
              showBorder={index < ACCOUNT_ROWS.length - 1}
              onClick={() => handleRowClick(row)}
            />
          ))}
        </SettingsSection>

        <button
          type="button"
          onClick={() => {
            if (isActive) {
              setOverlay("pause")
              return
            }
            setProfileStatus("active")
          }}
          className={cn(
            "hagu-action-btn w-full border text-sm",
            isActive
              ? "border-hagu-error/25 text-hagu-error"
              : "border-hagu-accent-strong bg-hagu-accent-selected text-hagu-accent-strong",
          )}
        >
          {isActive ? "Pause my profile" : "Resume profile"}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-2 text-center text-sm text-hagu-text-secondary underline"
        >
          Log out
        </button>
      </div>

      <HaguPrototypeSheet
        open={overlay === "notifications"}
        onClose={() => setOverlay(null)}
        title="Notifications"
        figmaLabel="Screen · Notifications"
      >
        <p className="text-sm text-hagu-text-secondary">Push, email, booking reminders, marketing opt-in.</p>
      </HaguPrototypeSheet>

      <HaguPrototypeSheet
        open={overlay === "privacy"}
        onClose={() => setOverlay(null)}
        title="Privacy & safety"
        figmaLabel="Screen · Privacy"
      >
        <p className="text-sm text-hagu-text-secondary">Block list, report, visibility, data export.</p>
      </HaguPrototypeSheet>

      <HaguPrototypeSheet
        open={overlay === "pause"}
        onClose={() => setOverlay(null)}
        title="Pause your profile?"
        figmaLabel="Dialog · Pause profile"
      >
        <p className="text-sm text-hagu-text-secondary">
          You won&apos;t appear in search and won&apos;t receive new requests. Existing bookings stay active.
        </p>
        <button
          type="button"
          className="hagu-action-btn-dark mt-4 w-full"
          onClick={() => {
            setProfileStatus("paused")
            setOverlay(null)
          }}
        >
          Pause profile
        </button>
        <button
          type="button"
          className="hagu-action-btn-muted mt-2 w-full"
          onClick={() => setOverlay(null)}
        >
          Cancel
        </button>
      </HaguPrototypeSheet>
    </>
  )
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <p className="hagu-section-label">{title}</p>
      <div className="hagu-surface-card py-1">{children}</div>
    </section>
  )
}

function SettingsRow({
  row,
  showBorder,
  onClick,
}: {
  row: SettingsRowConfig
  showBorder?: boolean
  onClick: () => void
}) {
  const Icon = row.icon

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left",
        showBorder && "border-b border-hagu-border",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {row.stripe ? (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#635BFF] text-sm font-bold text-white">
            S
          </div>
        ) : Icon ? (
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-[10px]",
              row.accent ? "bg-hagu-accent-selected text-hagu-accent-strong" : "bg-hagu-surface-muted text-hagu-ink",
            )}
          >
            <Icon className="size-4" />
          </div>
        ) : null}
        <div className="min-w-0">
          <p className="text-[15px] font-medium text-hagu-ink">{row.label}</p>
          {row.sublabel ? (
            <p className="text-[11px] text-hagu-accent-strong">{row.sublabel}</p>
          ) : null}
        </div>
      </div>
      <ChevronRight className="size-4 shrink-0 text-hagu-placeholder" />
    </button>
  )
}
