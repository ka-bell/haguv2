"use client"

import {
  BadgeCheck,
  Camera,
  ChevronRight,
  ClipboardList,
  MapPin,
  Sparkles,
  User,
  Wallet,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HaguToggle } from "@/components/ui/hagu-toggle"
import { HaguProfileStatusBadge } from "@/components/hagu/hagu-profile-status-badge"
import { HaguPrototypeSheet } from "@/components/hagu/hagu-prototype-sheet"
import type { HaguStep } from "@/app/onboarding/hagu/data"
import { useProviderProfileStatus } from "@/hooks/use-provider-profile-status"
import { haguOnboardingEditUrl, SETTINGS_ONBOARDING_STEP } from "@/lib/hagu-onboarding"
import { ROUTES } from "@/lib/routes"
import { logout } from "@/lib/session"
import { clearProviderProfileStatus } from "@/lib/hagu-provider-status"
import { clearCompletedReviews } from "@/lib/hagu-review-storage"
import { cn } from "@/lib/utils"

type SettingsOverlay = "notifications" | "privacy" | "pause" | null

const PROFILE_PHOTO =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=400&fit=crop&crop=face"

const PROFILE_ROWS = [
  { id: "about" as const, label: "About me & Bio", icon: User, step: SETTINGS_ONBOARDING_STEP.about },
  { id: "service-menu" as const, label: "Service Menu", icon: ClipboardList, step: SETTINGS_ONBOARDING_STEP["service-menu"] },
  { id: "character" as const, label: "Character & Interests", icon: Sparkles, step: SETTINGS_ONBOARDING_STEP.character },
  { id: "rates" as const, label: "Rates & Location", icon: MapPin, step: SETTINGS_ONBOARDING_STEP.rates },
]

const FINANCE_ROWS = [
  { id: "earnings" as const, label: "Earnings & Transactions", icon: Wallet, href: ROUTES.settingsTransactions },
  {
    id: "stripe" as const,
    label: "Stripe · ING ****4821",
    sublabel: "Connected",
    icon: null,
    stripe: true,
    step: SETTINGS_ONBOARDING_STEP.stripe,
  },
]

const ACCOUNT_ROWS = [
  { id: "notifications" as const, label: "Notifications", icon: null },
  { id: "privacy" as const, label: "Privacy & safety", icon: null },
  {
    id: "identity" as const,
    label: "Identity Verified",
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

  const openOnboardingStep = (step: HaguStep) => {
    router.push(haguOnboardingEditUrl(step))
  }

  const handleLogout = () => {
    clearProviderProfileStatus()
    clearCompletedReviews()
    logout()
    router.push(ROUTES.entry)
  }

  return (
    <>
      <div className="-mx-0">
        <div className="relative h-40 overflow-hidden">
          <Image src={PROFILE_PHOTO} alt="" fill className="object-cover object-top" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,26,30,0.5)] via-transparent to-[rgba(26,26,30,0.15)]" />
        </div>

        <div className="relative bg-[#FCFFFF] px-6">
          <div className="-mt-9 flex items-end justify-between">
            <div className="relative">
              <div className="size-[72px] overflow-hidden rounded-[36px] border-[3px] border-white shadow-sm">
                <Image src={PROFILE_PHOTO} alt="Sarah V." width={72} height={72} className="size-full object-cover" />
              </div>
              <span
                className={cn(
                  "absolute bottom-1 right-1 size-3.5 rounded-[7px] border-2 border-white",
                  isActive ? "bg-[#5BBFB5]" : "bg-[#B8B8C2]",
                )}
              />
              <button
                type="button"
                onClick={() => openOnboardingStep(SETTINGS_ONBOARDING_STEP["edit-profile"])}
                className="absolute -bottom-0.5 -right-0.5 flex size-6 items-center justify-center rounded-xl border-2 border-white bg-[#1A1A1E] text-white"
                aria-label="Change profile photo"
              >
                <Camera className="size-2.5" />
              </button>
            </div>
            <Button
              size="sm"
              className="h-9 px-4 text-[13px]"
              onClick={() => openOnboardingStep(SETTINGS_ONBOARDING_STEP["edit-profile"])}
            >
              Edit Profile
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <h1 className="text-[22px] font-semibold tracking-[-0.4px] text-[#1A1A1E]">Sarah V.</h1>
            <HaguProfileStatusBadge active={isActive} />
          </div>
          <p className="mt-0.5 text-sm text-[#8A8A96]">Art lover & great listener · De Pijp</p>

          <div className="mt-4 flex items-start gap-5">
            <Stat value="4.9" label="Rating" />
            <Divider />
            <Stat value="47" label="Sessions" />
            <Divider />
            <Stat value="98%" label="Response" />
          </div>

          <SettingsSection title="My Profile">
            {PROFILE_ROWS.map((row, index) => (
              <SettingsRow
                key={row.id}
                label={row.label}
                icon={row.icon}
                showBorder={index < PROFILE_ROWS.length - 1}
                onClick={() => openOnboardingStep(row.step)}
              />
            ))}
          </SettingsSection>

          <SettingsSection title="Finance">
            {FINANCE_ROWS.map((row, index) => (
              <SettingsRow
                key={row.id}
                label={row.label}
                sublabel={row.sublabel}
                icon={row.icon ?? undefined}
                stripe={row.stripe}
                showBorder={index < FINANCE_ROWS.length - 1}
                onClick={() => {
                  if (row.href) {
                    router.push(row.href)
                    return
                  }
                  if ("step" in row && row.step) {
                    openOnboardingStep(row.step)
                    return
                  }
                  setOverlay(row.id)
                }}
              />
            ))}
          </SettingsSection>

          <SettingsSection title="Account">
            <div className="flex items-center justify-between gap-3 border-b border-black/[0.05] px-5 py-3.5">
              <div>
                <p className="text-[15px] text-[#1A1A1E]">Profile visible</p>
                <p className="text-[11px] text-[#8A8A96]">
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
                label={row.label}
                sublabel={row.sublabel}
                icon={row.icon ?? undefined}
                accent={row.accent}
                showBorder={index < ACCOUNT_ROWS.length - 1}
                onClick={() => {
                  if ("step" in row && row.step) {
                    openOnboardingStep(row.step)
                    return
                  }
                  setOverlay(row.id)
                }}
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
              "mt-6 flex h-12 w-full items-center justify-center rounded-[14px] border text-sm font-medium transition active:opacity-80",
              isActive
                ? "border-[rgba(220,50,50,0.2)] text-[#DC3232]"
                : "border-[#5BBFB5] bg-[#EAF7F5] text-[#3DA89E]",
            )}
          >
            {isActive ? "Pause my profile" : "Resume profile"}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 mb-2 w-full py-2 text-center text-sm text-[#8A8A96] underline"
          >
            Log out
          </button>
        </div>
      </div>

      <HaguPrototypeSheet
        open={overlay === "notifications"}
        onClose={() => setOverlay(null)}
        title="Notifications"
        figmaLabel="Screen · Notifications"
      >
        <p className="text-sm text-[#8A8A96]">Push, email, booking reminders, marketing opt-in.</p>
      </HaguPrototypeSheet>

      <HaguPrototypeSheet
        open={overlay === "privacy"}
        onClose={() => setOverlay(null)}
        title="Privacy & safety"
        figmaLabel="Screen · Privacy"
      >
        <p className="text-sm text-[#8A8A96]">Block list, report, visibility, data export.</p>
      </HaguPrototypeSheet>

      <HaguPrototypeSheet
        open={overlay === "pause"}
        onClose={() => setOverlay(null)}
        title="Pause your profile?"
        figmaLabel="Dialog · Pause profile"
      >
        <p className="text-sm text-[#8A8A96]">
          You won&apos;t appear in search and won&apos;t receive new requests. Existing bookings stay active.
        </p>
        <Button
          className="mt-4 w-full"
          onClick={() => {
            setProfileStatus("paused")
            setOverlay(null)
          }}
        >
          Pause profile
        </Button>
        <Button variant="outline" className="mt-2 w-full" onClick={() => setOverlay(null)}>
          Cancel
        </Button>
      </HaguPrototypeSheet>
    </>
  )
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#8A8A96]">{title}</h2>
      <div className="mt-2 overflow-hidden rounded-[20px] border border-black/[0.06] bg-white py-1 shadow-[0px_2px_8px_rgba(26,26,30,0.04)]">
        {children}
      </div>
    </section>
  )
}

function SettingsRow({
  label,
  sublabel,
  icon: Icon,
  stripe,
  accent,
  showBorder,
  onClick,
}: {
  label: string
  sublabel?: string
  icon?: React.ComponentType<{ className?: string }>
  stripe?: boolean
  accent?: boolean
  showBorder?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition active:bg-black/[0.02]",
        showBorder && "border-b border-black/[0.05]",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {stripe ? (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#635BFF] text-sm font-bold text-white">
            S
          </div>
        ) : Icon ? (
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-[10px]",
              accent ? "bg-[#EAF7F5] text-[#5BBFB5]" : "bg-[#F7F6F3] text-[#1A1A1E]",
            )}
          >
            <Icon className="size-4" />
          </div>
        ) : null}
        <div className="min-w-0">
          <p className="text-[15px] text-[#1A1A1E]">{label}</p>
          {sublabel ? <p className="text-[11px] text-[#5BBFB5]">{sublabel}</p> : null}
        </div>
      </div>
      <ChevronRight className="size-4 shrink-0 text-[#B8B8C2]" />
    </button>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-lg font-bold text-[#1A1A1E]">{value}</p>
      <p className="text-[11px] text-[#8A8A96]">{label}</p>
    </div>
  )
}

function Divider() {
  return <div className="h-10 w-px self-center bg-black/[0.08]" />
}
