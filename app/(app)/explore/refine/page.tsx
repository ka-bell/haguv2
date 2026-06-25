"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { HaguFlowCta } from "@/components/hagu/hagu-flow-cta"
import { HaguFlowHeader } from "@/components/hagu/hagu-flow-header"
import { HageeInterestPicker } from "@/components/hagee/hagee-interest-picker"
import { HageeSelectableRow } from "@/components/hagee/hagee-selectable-row"
import { ScreenLayout } from "@/components/ui/screen-layout"
import { INTEREST_CATEGORIES, REFINE_ACTIVITIES } from "@/lib/hagee-discover"
import {
  DEFAULT_DISCOVER_ACTIVITIES,
  DEFAULT_DISCOVER_INTERESTS,
  getDiscoverPreferences,
  hasCompletedDiscoverRefine,
  saveDiscoverPreferences,
} from "@/lib/hagee-discover-preferences"
import { isPrototypeMode } from "@/lib/prototype"
import { ROUTES } from "@/lib/routes"

type RefineStep = 1 | 2

const REFINE_TOTAL_STEPS = 2

export default function ExploreRefinePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const stepFromQuery = Number(searchParams.get("step"))
  const [step, setStep] = useState<RefineStep>(() => (stepFromQuery === 2 ? 2 : 1))
  const [isFirstSetup, setIsFirstSetup] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const [activities, setActivities] = useState<string[]>(DEFAULT_DISCOVER_ACTIVITIES)
  const [interests, setInterests] = useState<string[]>(DEFAULT_DISCOVER_INTERESTS)

  useEffect(() => {
    if (stepFromQuery === 2) setStep(2)
  }, [stepFromQuery])

  useEffect(() => {
    const completed = hasCompletedDiscoverRefine()
    setIsFirstSetup(!completed)

    const saved = getDiscoverPreferences()
    if (saved) {
      setActivities(saved.activities)
      setInterests(saved.interests)
    }

    setLoaded(true)
  }, [])

  const toggleActivity = (id: string) => {
    setActivities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const toggleInterest = (value: string) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    )
  }

  const canContinue =
    step === 1 ? activities.length > 0 : interests.length >= 3 || isPrototypeMode()

  const finish = () => {
    saveDiscoverPreferences({ activities, interests })
    router.push(ROUTES.explore)
  }

  const cancel = () => router.push(ROUTES.explore)

  const handleBack = () => {
    if (step === 1) {
      if (isFirstSetup) return
      cancel()
      return
    }
    setStep(1)
  }

  const handleContinue = () => {
    if (!isPrototypeMode() && !canContinue) return
    if (step === 1) {
      setStep(2)
      return
    }
    finish()
  }

  if (!loaded) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md items-center justify-center bg-hagu-canvas">
        <p className="text-sm text-hagu-text-secondary">Loading…</p>
      </main>
    )
  }

  const showBack = !isFirstSetup || step > 1
  const progress = (step / REFINE_TOTAL_STEPS) * 100

  return (
    <ScreenLayout
      className="bg-hagu-canvas text-hagu-ink"
      contentPadding="px-7"
      headerClassName="px-6"
      reserveHeader
      headerVariant="brand"
      header={
        showBack ? (
          <HaguFlowHeader
            onBack={handleBack}
            closeHref={isFirstSetup ? null : ROUTES.explore}
          />
        ) : (
          <HaguFlowHeader />
        )
      }
      footer={
        <HaguFlowCta
          label={step === 2 ? (isFirstSetup ? "Start exploring" : "Save changes") : "Continue"}
          onClick={handleContinue}
          disabled={!isPrototypeMode() && !canContinue}
        />
      }
    >
      <div className="flex-1 pb-6">
        <div className="mb-5 h-[3px] w-full rounded-full bg-hagu-border">
          <div
            className="h-[3px] rounded-full bg-hagu-accent-strong transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {step === 1 ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.3px] text-hagu-accent-strong">
                What you&apos;re looking for
              </p>
              <h1 className="text-[26px] font-semibold tracking-tight text-hagu-heading">
                {isFirstSetup
                  ? "What kind of time do you want to spend?"
                  : "Update what you're looking for"}
              </h1>
              <p className="text-sm text-hagu-text-secondary">
                Pick everything that feels right. You can change this anytime.
              </p>
            </div>

            <div className="space-y-2.5">
              {REFINE_ACTIVITIES.map((activity) => (
                <HageeSelectableRow
                  key={activity.id}
                  icon={activity.icon}
                  label={activity.label}
                  subtitle={activity.subtitle}
                  selected={activities.includes(activity.id)}
                  onClick={() => toggleActivity(activity.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.3px] text-hagu-accent-strong">
                Your interests
              </p>
              <h1 className="text-[26px] font-semibold tracking-tight text-hagu-heading">
                {isFirstSetup ? "What lights you up?" : "Update your interests"}
              </h1>
              <p className="text-sm text-hagu-text-secondary">
                Pick at least 3. We use this to find people you&apos;ll actually connect with.
              </p>
            </div>

            <HageeInterestPicker
              categories={INTEREST_CATEGORIES}
              selected={interests}
              onToggle={toggleInterest}
            />
          </div>
        )}
      </div>
    </ScreenLayout>
  )
}
