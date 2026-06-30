"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Camera, ChevronRight, Plus, X } from "lucide-react"
import { HaguFlowScreen } from "@/components/hagu/hagu-flow-screen"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SegmentedPillGroup } from "@/components/ui/segmented-pill-group"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"
import { completeOnboarding } from "@/lib/session"
import { isPrototypeMode } from "@/lib/prototype"
import {
  ACTIVITY_ITEMS,
  CHARACTER_OPTIONS,
  CONTINUE_LABELS,
  HOSTING_OPTIONS,
  LANGUAGE_OPTIONS,
  TIME_PREFERENCES,
  WEEKDAYS,
  type HaguStep,
} from "./data"
import { CharacterCard, SectionLabel } from "./onboarding-chrome"

type ActivityPricing = "included" | "extra"
type ActivityState = { enabled: boolean; pricing: ActivityPricing; extraCost: string }
type ActivityMenuItem = { id: string; label: string; custom?: boolean }
type PaymentMethod = "stripe" | "paypal" | null

export default function HaguOnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editMode = searchParams.get("edit") === "1"
  const stepFromQuery = Number(searchParams.get("step"))
  const [step, setStep] = useState<HaguStep>(() => {
    if (editMode && stepFromQuery >= 2 && stepFromQuery <= 9) {
      return stepFromQuery as HaguStep
    }
    return 1
  })

  useEffect(() => {
    if (editMode && stepFromQuery >= 2 && stepFromQuery <= 9) {
      setStep(stepFromQuery as HaguStep)
    }
  }, [editMode, stepFromQuery])

  const [displayName, setDisplayName] = useState("Anouk V.")
  const [tagline, setTagline] = useState("")
  const [age, setAge] = useState("28")
  const [sex, setSex] = useState("Male")
  const [neighborhood, setNeighborhood] = useState("De Pijp, Amsterdam")
  const [languages, setLanguages] = useState<string[]>(["English", "Dutch"])
  const [characters, setCharacters] = useState<string[]>(["night-owl", "deep-diver"])
  const [hosting, setHosting] = useState<string[]>(["hosting", "visiting"])
  const [rates, setRates] = useState({ one: "60", two: "95", three: "130", four: "160" })
  const [activityItems, setActivityItems] = useState<ActivityMenuItem[]>(
    ACTIVITY_ITEMS.map((item) => ({ ...item, custom: false })),
  )
  const [activities, setActivities] = useState<Record<string, ActivityState>>({
    cuddling: { enabled: true, pricing: "included", extraCost: "" },
    "back-scratching": { enabled: true, pricing: "extra", extraCost: "10" },
    "hand-holding": { enabled: false, pricing: "included", extraCost: "" },
  })
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 4, 5])
  const [timePreferences, setTimePreferences] = useState<string[]>(["Evenings", "Weekends"])
  const [idScanned, setIdScanned] = useState(false)
  const [socialPlatform, setSocialPlatform] = useState("Instagram account")
  const [socialHandle, setSocialHandle] = useState("@anouk")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe")

  const toggleCharacter = (id: string) => {
    setCharacters((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleDay = (index: number) => {
    setSelectedDays((prev) => (prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]))
  }

  const toggleTimePreference = (value: string) => {
    setTimePreferences((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  const updateActivity = (id: string, patch: Partial<ActivityState>) => {
    setActivities((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }

  const addActivity = () => {
    const id = `custom-${Date.now()}`
    setActivityItems((prev) => [...prev, { id, label: "", custom: true }])
    setActivities((prev) => ({
      ...prev,
      [id]: { enabled: true, pricing: "included", extraCost: "" },
    }))
  }

  const updateActivityLabel = (id: string, label: string) => {
    setActivityItems((prev) => prev.map((item) => (item.id === id ? { ...item, label } : item)))
  }

  const removeActivity = (id: string) => {
    setActivityItems((prev) => prev.filter((item) => item.id !== id))
    setActivities((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const canContinue = (() => {
    if (step === 2) return displayName.trim() !== "" && age.trim() !== "" && sex.trim() !== ""
    if (step === 3) return neighborhood.trim() !== "" && languages.length > 0 && characters.length >= 2
    if (step === 4) return hosting.length > 0 && rates.one.trim() !== ""
    if (step === 5) {
      const enabledItems = activityItems.filter((item) => activities[item.id]?.enabled)
      if (enabledItems.length === 0) return false
      return enabledItems.every((item) => !item.custom || item.label.trim() !== "")
    }
    if (step === 6) return selectedDays.length > 0 && timePreferences.length > 0
    if (step === 7) return true
    if (step === 8) return socialHandle.trim() !== ""
    if (step === 9) return paymentMethod !== null
    return true
  })()

  const handleBack = () => {
    if (editMode) {
      router.push(ROUTES.profile)
      return
    }
    if (step === 1) {
      router.push(ROUTES.selectRole)
      return
    }
    setStep((prev) => (prev - 1) as HaguStep)
  }

  const handleContinue = () => {
    if (editMode) {
      router.push(ROUTES.profile)
      return
    }

    if (!isPrototypeMode() && !canContinue) return

    if (step === 7 && !idScanned) {
      setIdScanned(true)
      return
    }

    if (step < 9) {
      setStep((prev) => (prev + 1) as HaguStep)
      return
    }

    completeOnboarding("HAGU")
    router.push(ROUTES.discover)
  }

  const progress = editMode || step <= 1 ? undefined : ((step - 1) / 8) * 100
  const ctaLabel = editMode
    ? "Save changes"
    : step === 7 && !idScanned
      ? "Scan ID"
      : step === 7
        ? "Next: Connect payment"
        : CONTINUE_LABELS[step]

  const renderIntro = () => (
    <>
      <div className="relative -mx-6 -mt-2 h-[min(52vh,420px)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#b8e8e3] via-[#d0f1f0] to-[#FEFFFF]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FEFFFF] to-transparent" />
        <div className="absolute bottom-10 left-8 flex items-center gap-3 rounded-2xl border border-white/40 bg-white/30 px-4 py-2.5 backdrop-blur-xl">
          <div className="flex size-8 items-center justify-center rounded-xl bg-[#D0F1F0]">
            <span className="text-sm">📍</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#2D1012]">Amsterdam</p>
            <p className="text-xs text-[#8a8a96]">Provider onboarding</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <h1 className="text-[2rem] font-semibold leading-tight tracking-tight text-[#2D1012]">
          Share your time.
          <br />
          Earn on your terms.
        </h1>
        <p className="text-sm leading-relaxed text-[#8a8a96]">
          Become a Hagu in Amsterdam. Get paid to attend events, share meals, or simply provide great conversation.
        </p>
        <div className="flex gap-2 pt-1">
          <span className="h-1 w-5 rounded-full bg-[#5bbfb5]" />
          <span className="h-1 w-1.5 rounded-full bg-black/15" />
          <span className="h-1 w-1.5 rounded-full bg-black/15" />
        </div>
      </div>
    </>
  )

  const renderProfileBasics = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">Build your profile</h1>
        <p className="mt-1 text-sm font-light text-[#8A8A96]">The basics. This is what clients will see first.</p>
      </div>

      <div className="flex flex-col items-center pt-2">
        <div className="relative flex size-[120px] items-center justify-center rounded-[60px] border-2 border-dashed border-[#D0F1F0] bg-[rgba(208,241,240,0.4)] p-0.5">
          <Camera className="size-8 text-[#8A8A96]" />
          <button type="button" className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-[18px] border-[3px] border-[#F7F6F3] bg-[#2D1012] text-white">
            +
          </button>
        </div>
        <p className="mt-3 text-[13px] font-medium text-[#1A1A1E]">Upload profile photo</p>
      </div>

      <div className="space-y-4 py-2">
        <Input label="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <Input label="Tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g. Art lover & great listener" />
        <Input label="Age" value={age} onChange={(e) => setAge(e.target.value)} />
        <Input label="Sex" value={sex} onChange={(e) => setSex(e.target.value)} />
      </div>
    </div>
  )

  const renderTheRealYou = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">The Real You</h1>
        <p className="mt-1 text-sm font-light text-[#8A8A96]">What makes you a little different? Pick the ones that feel true.</p>
      </div>

      <div className="space-y-2">
        <SectionLabel>Neighborhood</SectionLabel>
        <Input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
      </div>

      <div className="space-y-3">
        <SectionLabel>Languages</SectionLabel>
        <SegmentedPillGroup options={LANGUAGE_OPTIONS.map((lang) => ({ value: lang, label: lang }))} value={languages} onChange={setLanguages} />
      </div>

      <div className="space-y-3">
        <SectionLabel>Your Character</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          {CHARACTER_OPTIONS.map((option) => (
            <CharacterCard
              key={option.id}
              emoji={option.emoji}
              title={option.title}
              subtitle={option.subtitle}
              selected={characters.includes(option.id)}
              onClick={() => toggleCharacter(option.id)}
            />
          ))}
        </div>
        <p className="text-xs text-[#8a8a96]">Selected: {characters.length}/2 minimum</p>
      </div>
    </div>
  )

  const renderRates = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">Rates &amp; Logistics</h1>
        <p className="mt-1 text-sm font-light text-[#8A8A96]">Set where you meet and your standard rates.</p>
      </div>

      <div className="space-y-2.5">
        <SectionLabel>Hosting location</SectionLabel>
        <SegmentedPillGroup options={HOSTING_OPTIONS} value={hosting} onChange={setHosting} />
        <p className="text-[11px] text-[#8A8A96]">{`Select all that apply. "Hosting" means at your place.`}</p>
      </div>

      <Card className="space-y-4 rounded-[20px] border-black/[0.06] px-5 pb-10 pt-11">
        {[
          { key: "one" as const, label: "1 Hour", hint: "Base rate" },
          { key: "two" as const, label: "2 Hours", hint: "Most Popular" },
          { key: "three" as const, label: "3 Hours", hint: "" },
          { key: "four" as const, label: "4 Hours", hint: "" },
        ].map((item) => (
          <div key={item.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#1A1A1E]">{item.label}</p>
              {item.hint ? (
                <span className="rounded bg-[#EAF7F5] px-1.5 py-0.5 text-xs text-[#5BBFB5]">{item.hint}</span>
              ) : null}
            </div>
            <div className="flex h-11 items-center rounded-xl border border-black/10 bg-white px-3">
              <span className="pr-1 text-base text-[#8A8A96]">€</span>
              <input
                value={rates[item.key]}
                onChange={(e) => setRates((prev) => ({ ...prev, [item.key]: e.target.value }))}
                className="w-full bg-transparent text-base font-semibold text-[#1A1A1E] outline-none"
              />
            </div>
          </div>
        ))}
      </Card>
    </div>
  )

  const renderActivityMenu = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">Activity Menu</h1>
        <p className="mt-1 text-sm font-light text-[#8A8A96]">Choose what you offer and how it&apos;s priced.</p>
      </div>

      <SectionLabel>Physical Comfort</SectionLabel>

      <div className="space-y-3">
        {activityItems.map((activity) => {
          const state = activities[activity.id]
          if (!state) return null
          return (
            <div
              key={activity.id}
              className={cn(
                "rounded-2xl border p-4 transition",
                state.enabled ? "border-[#5BBFB5] bg-[rgba(208,241,240,0.4)]" : "border-black/[0.08] bg-white",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                {activity.custom ? (
                  <input
                    value={activity.label}
                    onChange={(e) => updateActivityLabel(activity.id, e.target.value)}
                    placeholder="Activity name"
                    className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-[#2D1012] outline-none placeholder:text-[#B8B8C2]"
                  />
                ) : (
                  <p className="text-[15px] font-medium text-[#2D1012]">{activity.label}</p>
                )}
                <div className="flex shrink-0 items-center gap-2">
                  {activity.custom ? (
                    <button
                      type="button"
                      onClick={() => removeActivity(activity.id)}
                      className="flex size-8 items-center justify-center rounded-full text-[#8A8A96]"
                      aria-label="Remove activity"
                    >
                      <X className="size-4" />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => updateActivity(activity.id, { enabled: !state.enabled })}
                    className={cn(
                      "relative h-7 w-12 rounded-full transition",
                      state.enabled ? "bg-[#2D1012]" : "bg-black/10",
                    )}
                    aria-label={`Toggle ${activity.label || "activity"}`}
                  >
                    <span
                      className={cn(
                        "absolute top-1 size-5 rounded-full bg-white transition",
                        state.enabled ? "left-6" : "left-1",
                      )}
                    />
                  </button>
                </div>
              </div>

              {state.enabled ? (
                <div className="mt-4 space-y-3">
                  <SegmentedPillGroup
                    multiSelect={false}
                    options={[
                      { value: "included", label: "Included" },
                      { value: "extra", label: "Extra Cost" },
                    ]}
                    value={[state.pricing]}
                    onChange={(value) => updateActivity(activity.id, { pricing: value[0] as ActivityPricing })}
                  />
                  {state.pricing === "extra" ? (
                    <div className="flex h-11 items-center gap-2 rounded-xl border border-black/10 bg-white px-3">
                      <span className="shrink-0 text-sm text-[#8A8A96]">€</span>
                      <input
                        value={state.extraCost}
                        onChange={(e) => updateActivity(activity.id, { extraCost: e.target.value })}
                        inputMode="decimal"
                        className="min-w-0 flex-1 bg-transparent text-sm text-[#2D1012] outline-none"
                        placeholder="10.00"
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          )
        })}

        <button
          type="button"
          onClick={addActivity}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-black/[0.12] bg-white py-3.5 text-sm font-medium text-[#4A4A52] transition active:bg-[#F7F6F3]"
        >
          <Plus className="size-4" />
          Add activity
        </button>
      </div>
    </div>
  )

  const renderAvailability = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">When are you free?</h1>
        <p className="mt-1 text-sm font-light text-[#8A8A96]">Pick the days and times that usually work for you.</p>
      </div>

      <div className="space-y-3">
        <SectionLabel>Days</SectionLabel>
        <div className="flex justify-between gap-2">
          {WEEKDAYS.map((day, index) => {
            const selected = selectedDays.includes(index)
            return (
              <button
                key={`${day}-${index}`}
                type="button"
                onClick={() => toggleDay(index)}
                className={cn(
                  "flex size-10 items-center justify-center rounded-full text-sm font-medium transition",
                  selected ? "bg-[#1A1A1E] text-white" : "border border-black/[0.08] bg-white text-[#4A4A52]",
                )}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        <SectionLabel>Preferred Times</SectionLabel>
        <div className="space-y-2">
          {TIME_PREFERENCES.map((pref) => {
            const selected = timePreferences.includes(pref)
            return (
              <button
                key={pref}
                type="button"
                onClick={() => toggleTimePreference(pref)}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition",
                  selected ? "border-[#5BBFB5] bg-[rgba(208,241,240,0.4)]" : "border-black/[0.08] bg-white",
                )}
              >
                <span className="text-sm font-medium text-[#2D1012]">{pref}</span>
                <span className={cn("size-5 rounded-full border", selected ? "border-[#2D1012] bg-[#2D1012]" : "border-black/15")} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderIdentityId = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">Verify your identity</h1>
        <p className="mt-1 text-sm font-light text-[#8A8A96]">We verify every Hagu to keep the community safe.</p>
      </div>

      <Card className="flex flex-col items-center rounded-[20px] border-black/[0.06] py-10 text-center">
        <div className="flex size-24 items-center justify-center rounded-2xl bg-[rgba(208,241,240,0.5)] text-4xl">🪪</div>
        <p className="mt-4 text-sm font-medium text-[#1A1A1E]">Scan ID / Passport</p>
        <p className="mt-1 max-w-[240px] text-xs text-[#8A8A96]">Use a valid government-issued ID. This won&apos;t be shown on your profile.</p>
        {idScanned ? <p className="mt-4 text-sm font-medium text-[#5BBFB5]">ID scanned successfully</p> : null}
      </Card>
    </div>
  )

  const renderIdentitySocial = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">Verify your identity</h1>
        <p className="mt-1 text-sm font-light text-[#8A8A96]">Link a social account so clients can trust you&apos;re real.</p>
      </div>

      <div className="space-y-4">
        <Input label="Platform" value={socialPlatform} onChange={(e) => setSocialPlatform(e.target.value)} />
        <Input label="Handle" value={socialHandle} onChange={(e) => setSocialHandle(e.target.value)} placeholder="@yourhandle" />
      </div>
    </div>
  )

  const renderGetPaid = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">How you get paid</h1>
        <p className="mt-1 text-sm font-light text-[#8A8A96]">Connect a payout method to receive booking payments.</p>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setPaymentMethod("stripe")}
          className={cn(
            "w-full rounded-2xl border p-4 text-left transition",
            paymentMethod === "stripe" ? "border-[#5BBFB5] bg-[rgba(208,241,240,0.4)]" : "border-black/[0.08] bg-white",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#1A1A1E]">Stripe Connect</p>
              <p className="text-xs text-[#8A8A96]">Recommended · Bank transfer</p>
            </div>
            <ChevronRight className="size-4 text-[#8A8A96]" />
          </div>
          {paymentMethod === "stripe" ? (
            <button type="button" className="mt-4 w-full rounded-2xl border border-black/[0.08] bg-white py-2.5 text-sm font-medium text-[#1A1A1E]">
              Connect Bank
            </button>
          ) : null}
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod("paypal")}
          className={cn(
            "w-full rounded-2xl border p-4 text-left transition",
            paymentMethod === "paypal" ? "border-[#5BBFB5] bg-[rgba(208,241,240,0.4)]" : "border-black/[0.08] bg-white",
          )}
        >
          <p className="text-sm font-semibold text-[#1A1A1E]">PayPal</p>
          <p className="text-xs text-[#8A8A96]">Alternative payout option</p>
        </button>
      </div>

      <p className="text-[11px] leading-relaxed text-[#8A8A96]">
        By completing setup you agree to the HAGU Provider Agreement and payout terms.
      </p>
    </div>
  )

  const renderStepContent = () => {
    if (step === 1) return renderIntro()
    if (step === 2) return renderProfileBasics()
    if (step === 3) return renderTheRealYou()
    if (step === 4) return renderRates()
    if (step === 5) return renderActivityMenu()
    if (step === 6) return renderAvailability()
    if (step === 7) return renderIdentityId()
    if (step === 8) return renderIdentitySocial()
    return renderGetPaid()
  }

  if (step === 1) {
    return (
      <HaguFlowScreen
        showHeader={false}
        ctaLabel={ctaLabel}
        onCta={handleContinue}
        ctaDisabled={!isPrototypeMode() && !canContinue}
        className="bg-[#FEFFFF]"
        footer={
          <p className="mt-6 text-center text-sm text-[#8A8A96]">
            Already have an account?{" "}
            <Link href={ROUTES.login} className="font-medium text-[#2D1012]">
              Log in
            </Link>
          </p>
        }
      >
        {renderIntro()}
      </HaguFlowScreen>
    )
  }

  return (
    <HaguFlowScreen
      onBack={handleBack}
      closeHref={editMode ? ROUTES.profile : ROUTES.selectRole}
      progress={progress}
      ctaLabel={ctaLabel}
      onCta={handleContinue}
      ctaDisabled={!editMode && !isPrototypeMode() && !canContinue}
    >
      {renderStepContent()}
    </HaguFlowScreen>
  )
}
