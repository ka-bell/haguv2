"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Check, ChevronLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PageActions, PageContent, PageShell } from "@/components/ui/page-shell"
import { ROUTES } from "@/lib/routes"
import { completeOnboarding } from "@/lib/session"

type Step = 1 | 2 | 3 | 4

const traitOptions = ["Night owl", "Dry humour", "Deep diver", "Good listener", "Spontaneous", "Overthinker"]

export default function HaguOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [displayName, setDisplayName] = useState("Anouk V.")
  const [tagline, setTagline] = useState("")
  const [age, setAge] = useState("28")
  const [gender, setGender] = useState("Female")
  const [traits, setTraits] = useState<string[]>([])
  const [availability, setAvailability] = useState("Weekends")

  const progressWidth = `${(Math.min(step, 3) / 3) * 100}%`

  const toggleTrait = (trait: string) => {
    if (traits.includes(trait)) {
      setTraits(traits.filter((item) => item !== trait))
      return
    }
    setTraits([...traits, trait])
  }

  const canContinue = (() => {
    if (step === 1) return displayName.trim() !== "" && age.trim() !== "" && gender.trim() !== ""
    if (step === 2) return traits.length >= 2
    if (step === 3) return availability.trim() !== ""
    return true
  })()

  const handleContinue = () => {
    if (!canContinue) return

    if (step < 4) {
      setStep((prev) => (prev + 1) as Step)
      return
    }

    completeOnboarding("HAGU")
    router.push(ROUTES.discover)
  }

  const handleBack = () => {
    if (step === 1) {
      router.push(ROUTES.selectRole)
      return
    }
    setStep((prev) => (prev - 1) as Step)
  }

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <>
          <h1 className="mt-6 text-3xl font-semibold text-[#2D1012]">Build your profile</h1>
          <p className="mt-1 text-sm text-[#8a8a96]">The basics. This is what clients will see first.</p>

          <div className="mt-8 flex flex-col items-center">
            <div className="relative flex size-28 items-center justify-center rounded-full border-2 border-dashed border-[#D0F1F0] bg-[#D0F1F0]/40">
              <span className="text-[#8a8a96]">Photo</span>
              <button type="button" className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-[#2D1012] text-white">
                +
              </button>
            </div>
            <p className="mt-3 text-sm text-[#2D1012]">Upload profile photo</p>
          </div>

          <div className="mt-8 space-y-4">
            <Input label="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            <Input label="Tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g. Art lover & great listener" />
            <Input label="Age" value={age} onChange={(e) => setAge(e.target.value)} />
            <Input label="Gender" value={gender} onChange={(e) => setGender(e.target.value)} />
          </div>
        </>
      )
    }

    if (step === 2) {
      return (
        <>
          <h1 className="mt-6 text-3xl font-semibold text-[#2D1012]">The real you</h1>
          <p className="mt-1 text-sm text-[#8a8a96]">Pick traits that describe your vibe as a HAGU.</p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {traitOptions.map((trait) => {
              const selected = traits.includes(trait)
              return (
                <button
                  key={trait}
                  type="button"
                  onClick={() => toggleTrait(trait)}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    selected ? "border-hagu-accent bg-hagu-accent/40" : "border-black/10 bg-[#FEFFFF]"
                  }`}
                >
                  <p className="text-sm font-medium text-[#2D1012]">{trait}</p>
                </button>
              )
            })}
          </div>
          <p className="mt-3 text-xs text-[#8a8a96]">Selected: {traits.length}/2 minimum</p>
        </>
      )
    }

    if (step === 3) {
      return (
        <>
          <h1 className="mt-6 text-3xl font-semibold text-[#2D1012]">Set your availability</h1>
          <p className="mt-1 text-sm text-[#8a8a96]">When are you usually open for bookings?</p>

          <div className="mt-8 space-y-4">
            {["Weekdays", "Weekends", "Evenings", "Flexible"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setAvailability(option)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  availability === option ? "border-hagu-accent bg-hagu-accent/40" : "border-black/10 bg-[#FEFFFF]"
                }`}
              >
                <p className="text-sm font-medium text-[#2D1012]">{option}</p>
              </button>
            ))}
          </div>
        </>
      )
    }

    return (
      <div className="mt-8 space-y-6">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-hagu-accent/40 text-hagu-primary">
          <Check className="size-8" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-[#2D1012]">You&apos;re ready, {displayName.split(" ")[0] || "there"}.</h1>
          <p className="mt-2 text-sm text-[#8a8a96]">Your HAGU profile is live. You can now receive booking requests.</p>
        </div>
        <Card>
          <CardTitle>Next up</CardTitle>
          <CardDescription>Review requests, manage your calendar, and chat with matches.</CardDescription>
        </Card>
      </div>
    )
  }

  const continueLabel = step === 1 ? "Next: The real you" : step === 2 ? "Next: Availability" : step === 3 ? "Finish profile" : "Start exploring"

  return (
    <PageShell>
      <PageContent className="pt-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back to previous step"
            className="flex size-11 items-center justify-center rounded-full border border-[#D0F1F0]/60 bg-white/30 backdrop-blur-xl"
          >
            <ChevronLeft className="size-4 text-[#2D1012]" />
          </button>
          <div className="rounded-full border border-[#D0F1F0]/60 bg-white/30 px-8 py-2 backdrop-blur-xl">
            <span className="text-[32px] font-bold leading-none tracking-tight text-[#2D1012]">HAGU</span>
          </div>
          <Link href={ROUTES.entry} aria-label="Close" className="flex size-11 items-center justify-center rounded-full border border-[#D0F1F0]/60 bg-white/30 backdrop-blur-xl">
            <X className="size-4 text-[#2D1012]" />
          </Link>
        </div>

        {step < 4 ? (
          <div className="mt-3 h-1 w-full rounded-full bg-black/10">
            <div className="h-1 rounded-full bg-hagu-accent transition-all duration-300" style={{ width: progressWidth }} />
          </div>
        ) : null}

        {renderStepContent()}
      </PageContent>

      <PageActions>
        <Button size="lg" className="w-full" onClick={handleContinue} disabled={!canContinue}>
          {continueLabel}
        </Button>
      </PageActions>
    </PageShell>
  )
}
