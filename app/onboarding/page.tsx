"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Camera } from "lucide-react"
import { AppleSignInButton } from "@/components/hagu/apple-sign-in-button"
import { GoogleSignInButton } from "@/components/hagu/google-sign-in-button"
import { HageeActivityCard } from "@/components/hagee/hagee-activity-card"
import { HageeFlowScreen } from "@/components/hagee/hagee-flow-screen"
import { HageeOnboardingSuccess } from "@/components/hagee/hagee-onboarding-success"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/lib/routes"
import { completeOnboarding } from "@/lib/session"
import { isPrototypeMode } from "@/lib/prototype"
import { cn } from "@/lib/utils"
import {
  ACTIVITY_OPTIONS,
  CHARACTER_OPTIONS,
  CONTINUE_LABELS,
  HageeStep,
  INTRO_HERO_IMAGE,
  VIBE_OPTIONS,
} from "./hagee/data"

const selectedPillClass =
  "border-hagu-accent-strong bg-hagu-accent-selected text-hagu-accent-strong"
const unselectedPillClass =
  "border-hagu-border bg-hagu-white text-hagu-label"
const selectedCardClass =
  "border-hagu-accent-strong bg-hagu-accent-selected"
const unselectedCardClass =
  "border-hagu-border bg-hagu-white"

export default function HageeOnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editMode = searchParams.get("edit") === "1"
  const stepFromQuery = Number(searchParams.get("step"))
  const [step, setStep] = useState<HageeStep>(() => {
    if (editMode && stepFromQuery >= 2 && stepFromQuery <= 5) {
      return stepFromQuery as HageeStep
    }
    return 1
  })

  useEffect(() => {
    if (editMode && stepFromQuery >= 2 && stepFromQuery <= 5) {
      setStep(stepFromQuery as HageeStep)
    }
  }, [editMode, stepFromQuery])

  const [firstName, setFirstName] = useState("Alex")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [activities, setActivities] = useState<string[]>([])
  const [vibes, setVibes] = useState<string[]>([])
  const [age, setAge] = useState("29")
  const [gender, setGender] = useState("")
  const [city, setCity] = useState("")
  const [oneLiner, setOneLiner] = useState("")
  const [characterTraits, setCharacterTraits] = useState<string[]>([])

  const toggleValue = (value: string, list: string[], setList: (next: string[]) => void) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value))
      return
    }
    setList([...list, value])
  }

  const canContinue = (() => {
    if (step === 2) {
      return firstName.trim() !== "" && email.trim() !== "" && password.trim().length >= 6 && acceptedTerms
    }
    if (step === 3) return activities.length > 0 && vibes.length > 0
    if (step === 4) return age.trim() !== "" && gender.trim() !== "" && city.trim() !== ""
    if (step === 5) return characterTraits.length >= 3
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
    setStep((prev) => (prev - 1) as HageeStep)
  }

  const handleContinue = () => {
    if (editMode) {
      router.push(ROUTES.profile)
      return
    }

    if (!isPrototypeMode() && !canContinue) return

    if (step < 6) {
      setStep((prev) => (prev + 1) as HageeStep)
      return
    }

    completeOnboarding("HAGEE")
    router.push(ROUTES.home)
  }

  const handleSkipIntro = () => setStep(2)

  const progress = !editMode && step > 1 && step < 6 ? ((step - 1) / 5) * 100 : editMode && step >= 2 ? ((step - 1) / 5) * 100 : undefined
  const ctaLabel = editMode ? "Save changes" : CONTINUE_LABELS[step]
  const displayName = firstName.trim() || "there"

  const renderIntro = () => (
    <>
      <div className="relative -mx-7 -mt-2 h-[min(42vh,340px)] overflow-hidden px-7">
        <div className="relative h-full overflow-hidden rounded-[24px]">
          <Image src={INTRO_HERO_IMAGE} alt="" fill className="object-cover" sizes="400px" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FCFFFF] via-[rgba(252,255,255,0.6)] via-40% to-transparent" />
        </div>
      </div>

      <div className="mt-7 space-y-4">
        <span className="inline-flex rounded-full border border-[rgba(91,191,181,0.25)] bg-[rgba(91,191,181,0.12)] px-3 py-0.5 text-[11px] font-semibold tracking-wide text-[#3DA89E]">
          1 of 3
        </span>
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-[#1A1A1E]">
          Real people.
          <br />
          Real time together.
        </h1>
        <p className="text-[15px] font-light leading-relaxed text-[#4A4A52]">
          Hagu connects you with thoughtful, vetted companions for shared experiences — a meal, a walk, a
          conversation that actually goes somewhere.
        </p>
        <div className="flex gap-1.5 pt-1">
          <span className="h-[3px] w-5 rounded-full bg-[#5BBFB5]" />
          <span className="h-[3px] w-1.5 rounded-full bg-black/[0.12]" />
          <span className="h-[3px] w-1.5 rounded-full bg-black/[0.12]" />
        </div>
      </div>
    </>
  )

  const renderCreateAccount = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">Create your account</h1>
        <p className="mt-1 text-sm font-light text-[#8A8A96]">Takes about 2 minutes.</p>
      </div>

      <div className="space-y-3">
        <GoogleSignInButton label="Sign in with Google" />
        <AppleSignInButton />
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-black/[0.08]" />
        <span className="text-xs text-[#8A8A96]">or</span>
        <div className="h-px flex-1 bg-black/[0.08]" />
      </div>

      <div className="space-y-4">
        <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Alex" />
        <Input label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@hagu.app" />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
      </div>

      <label className="flex items-start gap-2 text-xs text-[#8A8A96]">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="mt-0.5 size-4 rounded border-black/20"
        />
        I agree to the terms and privacy policy.
      </label>
    </div>
  )

  const renderPreferences = () => (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <h1 className="text-[26px] font-semibold tracking-[-0.5px] text-[#1A1A1E]">What are you looking for?</h1>
        <p className="text-sm font-light text-[#8A8A96]">This helps us match you with the right people.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ACTIVITY_OPTIONS.map((option) => (
          <HageeActivityCard
            key={option.id}
            icon={option.icon}
            label={option.label}
            subtitle={option.subtitle}
            selected={activities.includes(option.id)}
            onClick={() => toggleValue(option.id, activities, setActivities)}
          />
        ))}
      </div>

      <div className="pt-1">
        <p className="text-[13px] font-medium tracking-[0.1px] text-[#4A4A52]">What kind of energy?</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {VIBE_OPTIONS.map((option) => {
            const selected = vibes.includes(option)
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleValue(option, vibes, setVibes)}
                className={cn(
                  "rounded-full border px-[17px] py-2 text-[13px] transition",
                  selected ? selectedPillClass : unselectedPillClass,
                )}
              >
                {option}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">A little about you</h1>
        <p className="mt-1 text-sm font-light text-[#8A8A96]">This appears on your public profile.</p>
      </div>

      <div className="flex flex-col items-center pt-2">
        <div className="relative flex size-[120px] items-center justify-center rounded-full border-2 border-dashed border-[#D0F1F0] bg-[rgba(208,241,240,0.4)]">
          <Camera className="size-8 text-[#8A8A96]" />
          <button
            type="button"
            className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-[18px] border-[3px] border-[#FCFFFF] bg-[#2D1012] text-lg text-white"
          >
            +
          </button>
        </div>
        <p className="mt-3 text-[13px] font-medium text-[#1A1A1E]">Upload profile photo</p>
      </div>

      <div className="space-y-4">
        <Input label="Age" value={age} onChange={(e) => setAge(e.target.value)} placeholder="28" />
        <Input label="Gender" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Male" />
        <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Amsterdam" />
        <label className="flex w-full flex-col gap-1.5">
          <span className="text-xs text-[#4A4A52]">One line about you (optional)</span>
          <textarea
            value={oneLiner}
            onChange={(e) => setOneLiner(e.target.value)}
            placeholder="Tell people a little bit about your vibe."
            className="min-h-20 w-full rounded-[20px] border border-black/10 bg-white px-4 py-3 text-[15px] text-[#1A1A1E] outline-none transition placeholder:text-[#8A8A96] focus:border-[#D0F1F0] focus:ring-2 focus:ring-[#D0F1F0]/50"
          />
        </label>
      </div>
    </div>
  )

  const renderCharacter = () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-[#8A8A96]">Your character</p>
        <h1 className="mt-1 text-[26px] font-semibold tracking-tight text-[#1A1A1E]">What makes you a little different?</h1>
        <p className="mt-1 text-sm font-light text-[#8A8A96]">Choose at least 3 traits so people get your vibe.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CHARACTER_OPTIONS.map((option) => {
          const selected = characterTraits.includes(option.id)
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggleValue(option.id, characterTraits, setCharacterTraits)}
              className={cn(
                "rounded-[20px] border px-4 py-4 text-left transition",
                selected ? selectedCardClass : unselectedCardClass,
              )}
            >
              <p className="text-sm font-medium text-[#1A1A1E]">
                {option.emoji} {option.label}
              </p>
            </button>
          )
        })}
      </div>
      <p className="text-xs text-[#8A8A96]">Selected: {characterTraits.length}/3 minimum</p>
    </div>
  )

  const renderSuccess = () => <HageeOnboardingSuccess displayName={displayName} />

  const renderStepContent = () => {
    if (step === 1) return renderIntro()
    if (step === 2) return renderCreateAccount()
    if (step === 3) return renderPreferences()
    if (step === 4) return renderProfile()
    if (step === 5) return renderCharacter()
    return renderSuccess()
  }

  if (step === 1) {
    return (
      <HageeFlowScreen
        ctaLabel={ctaLabel}
        onCta={handleContinue}
        ctaDisabled={!isPrototypeMode() && !canContinue}
        headerAction={
          <button
            type="button"
            onClick={handleSkipIntro}
            className="pointer-events-auto px-1 py-2 text-[13px] font-medium text-[#8A8A96]"
          >
            Skip
          </button>
        }
        footer={
          <p className="mt-4 text-center text-[13px] text-[#8A8A96]">
            Already have an account?{" "}
            <Link href={ROUTES.login} className="font-medium text-[#1A1A1E]">
              Log in
            </Link>
          </p>
        }
      >
        {renderIntro()}
      </HageeFlowScreen>
    )
  }

  if (step === 6) {
    return (
      <HageeFlowScreen
        ctaLabel={ctaLabel}
        onCta={handleContinue}
        footer={
          <p className="mt-2 text-center text-xs text-hagu-placeholder">
            You can update your profile anytime in settings
          </p>
        }
      >
        {renderSuccess()}
      </HageeFlowScreen>
    )
  }

  return (
    <HageeFlowScreen
      onBack={handleBack}
      progress={progress}
      ctaLabel={ctaLabel}
      onCta={handleContinue}
      ctaDisabled={!editMode && !isPrototypeMode() && !canContinue}
    >
      {renderStepContent()}
    </HageeFlowScreen>
  )
}
