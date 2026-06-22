"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Check, ChevronLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PageActions, PageContent, PageShell } from "@/components/ui/page-shell"
import { ROUTES } from "@/lib/routes"
import { completeOnboarding } from "@/lib/session"
import { isPrototypeMode } from "@/lib/prototype"

type Step = 1 | 2 | 3 | 4 | 5 | 6

const activityOptions = [
  "Dinner date",
  "Coffee chat",
  "City walk",
  "Event buddy",
  "Deep talks",
  "Something spontaneous",
]

const vibeOptions = ["Playful", "Calm", "Curious", "Flirty", "Thoughtful"]

const characterOptions = [
  "Night owl",
  "Overthinker",
  "Dry humour",
  "Deep diver",
  "Spontaneous",
  "Good listener",
]

export default function HageeOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [activities, setActivities] = useState<string[]>([])
  const [vibes, setVibes] = useState<string[]>([])
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [city, setCity] = useState("")
  const [oneLiner, setOneLiner] = useState("")
  const [characterTraits, setCharacterTraits] = useState<string[]>([])

  const completedStep = Math.min(step, 5)
  const progressWidth = `${(completedStep / 5) * 100}%`

  const toggleValue = (value: string, list: string[], setList: (next: string[]) => void) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value))
      return
    }
    setList([...list, value])
  }

  const canContinue = (() => {
    if (step === 2) return firstName.trim() !== "" && email.trim() !== "" && password.trim().length >= 6 && acceptedTerms
    if (step === 3) return activities.length > 0 && vibes.length > 0
    if (step === 4) return age.trim() !== "" && gender.trim() !== "" && city.trim() !== ""
    if (step === 5) return characterTraits.length >= 3
    return true
  })()

  const handleContinue = () => {
    if (!isPrototypeMode() && !canContinue) return

    if (step < 6) {
      setStep((prev) => (prev + 1) as Step)
      return
    }
    completeOnboarding("HAGEE")
    router.push(ROUTES.discover)
  }

  const handleBack = () => {
    if (step === 1) {
      router.push(ROUTES.selectRole)
      return
    }
    setStep((prev) => (prev - 1) as Step)
  }

  const headerRight = (
    <Link href="/" aria-label="Close">
      <X className="size-4 text-[#2D1012]" />
    </Link>
  )

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <Card className="mt-6 overflow-hidden p-0">
          <div className="h-56 bg-gradient-to-b from-[#D0F1F0] to-[#FEFFFF]" />
          <div className="space-y-3 p-6">
            <p className="text-xs text-[#8a8a96]">1 of 3</p>
            <h1 className="text-2xl font-semibold text-[#2D1012]">Real people. Real time together.</h1>
            <p className="text-sm text-[#8a8a96]">
              Hagu connects you with thoughtful, vetted companions for shared experiences - a meal, a walk, a conversation that actually goes somewhere.
            </p>
            <div className="flex gap-2 pt-1">
              <span className="h-1 w-6 rounded-full bg-[#5bbfb5]" />
              <span className="h-1 w-2 rounded-full bg-black/15" />
              <span className="h-1 w-2 rounded-full bg-black/15" />
            </div>
          </div>
        </Card>
      )
    }

    if (step === 2) {
      return (
        <div className="mt-6 space-y-6">
          <div>
            <h1 className="text-3xl font-semibold text-[#2D1012]">Create your account</h1>
            <p className="mt-2 text-sm text-[#8a8a96]">Takes about 2 minutes.</p>
          </div>

          <button type="button" className="gsi-material-button" aria-label="Continue with Google">
            <div className="gsi-material-button-state" />
            <div className="gsi-material-button-content-wrapper">
              <div className="gsi-material-button-icon">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" className="block">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
              </div>
              <span className="gsi-material-button-contents">Sign in with Google</span>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-black/10" />
            <span className="text-xs text-[#8a8a96]">or</span>
            <div className="h-px flex-1 bg-black/10" />
          </div>

          <div className="space-y-4">
            <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Alex" />
            <Input label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@hagu.app" />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
          </div>

          <label className="flex items-start gap-2 text-xs text-[#8a8a96]">
            <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-0.5 size-4 rounded border-black/20" />
            I agree to the terms and privacy policy.
          </label>
        </div>
      )
    }

    if (step === 3) {
      return (
        <div className="mt-6 space-y-6">
          <div>
            <h1 className="text-3xl font-semibold text-[#2D1012]">What are you looking for?</h1>
            <p className="mt-2 text-sm text-[#8a8a96]">This helps us match you with the right people.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {activityOptions.map((option) => {
              const selected = activities.includes(option)
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleValue(option, activities, setActivities)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selected ? "border-hagu-accent bg-hagu-accent/40" : "border-black/10 bg-[#FEFFFF]"
                  }`}
                >
                  <p className="text-sm font-medium text-[#2D1012]">{option}</p>
                  <p className="mt-1 text-xs text-[#8a8a96]">Tap to select</p>
                </button>
              )
            })}
          </div>

          <div>
            <p className="text-sm font-medium text-[#2D1012]">What kind of energy?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {vibeOptions.map((option) => {
                const selected = vibes.includes(option)
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleValue(option, vibes, setVibes)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      selected ? "border-hagu-accent bg-hagu-accent/40 text-[#2D1012]" : "border-black/10 bg-[#FEFFFF] text-[#4a4a52]"
                    }`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )
    }

    if (step === 4) {
      return (
        <div className="mt-6 space-y-6">
          <div>
            <h1 className="text-3xl font-semibold text-[#2D1012]">A little about you</h1>
            <p className="mt-2 text-sm text-[#8a8a96]">This appears on your public profile.</p>
          </div>

          <div className="rounded-2xl border border-black/5 p-4">
            <p className="text-sm font-medium text-[#2D1012]">Profile photo</p>
            <p className="mt-1 text-xs text-[#8a8a96]">You can update this later.</p>
            <button type="button" className="mt-3 flex size-20 items-center justify-center rounded-2xl border-2 border-dashed border-hagu-accent bg-hagu-accent/30 text-sm text-[#2D1012]">
              Add
            </button>
          </div>

          <div className="space-y-4">
            <Input label="Age" value={age} onChange={(e) => setAge(e.target.value)} placeholder="28" />
            <Input label="Gender" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Male" />
            <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Amsterdam" />
            <label className="flex w-full flex-col gap-1.5">
              <span className="text-xs text-[#4a4a52]">One line about you (optional)</span>
              <textarea
                value={oneLiner}
                onChange={(e) => setOneLiner(e.target.value)}
                placeholder="Tell people a little bit about your vibe."
                className="min-h-20 w-full rounded-[20px] border border-black/10 bg-[#FEFFFF] px-4 py-3 text-[15px] text-[#2D1012] outline-none transition placeholder:text-[#8a8a96] focus:border-[#D0F1F0] focus:ring-2 focus:ring-[#D0F1F0]/50"
              />
            </label>
          </div>
        </div>
      )
    }

    if (step === 5) {
      return (
        <div className="mt-6 space-y-6">
          <div>
            <p className="text-sm text-[#8a8a96]">Your character</p>
            <h1 className="mt-1 text-3xl font-semibold text-[#2D1012]">What makes you a little different?</h1>
            <p className="mt-2 text-sm text-[#8a8a96]">Choose at least 3 traits so people get your vibe.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {characterOptions.map((option) => {
              const selected = characterTraits.includes(option)
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleValue(option, characterTraits, setCharacterTraits)}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    selected ? "border-hagu-accent bg-hagu-accent/40" : "border-black/10 bg-[#FEFFFF]"
                  }`}
                >
                  <p className="text-sm font-medium text-[#2D1012]">{option}</p>
                </button>
              )
            })}
          </div>
          <p className="text-xs text-[#8a8a96]">Selected: {characterTraits.length}/3 minimum</p>
        </div>
      )
    }

    return (
      <div className="mt-8 space-y-6">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-hagu-accent/40 text-hagu-primary">
          <Check className="size-8" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-[#2D1012]">You&apos;re all set, {firstName || "there"}.</h1>
          <p className="mt-2 text-sm text-[#8a8a96]">Your Hugee profile is ready. You can now explore companions and send your first request.</p>
        </div>
        <div className="space-y-3">
          <Card className="p-4">
            <p className="text-sm font-medium text-[#2D1012]">Browse companions</p>
            <p className="text-xs text-[#8a8a96]">Find people that match your vibe.</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm font-medium text-[#2D1012]">Send your first request</p>
            <p className="text-xs text-[#8a8a96]">It takes less than a minute.</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm font-medium text-[#2D1012]">Chat when matched</p>
            <p className="text-xs text-[#8a8a96]">Coordinate time and place safely.</p>
          </Card>
        </div>
      </div>
    )
  }

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
          <div className="flex size-11 items-center justify-center rounded-full border border-[#D0F1F0]/60 bg-white/30 backdrop-blur-xl">
            {headerRight}
          </div>
        </div>

        {step > 1 && step < 6 ? (
          <div className="mt-3 h-1 w-full rounded-full bg-black/10">
            <div className="h-1 rounded-full bg-hagu-accent transition-all duration-300" style={{ width: progressWidth }} />
          </div>
        ) : null}
        {renderStepContent()}
      </PageContent>

      <PageActions>
        <Button size="lg" className="w-full" onClick={handleContinue} disabled={!isPrototypeMode() && !canContinue}>
          {step < 6 ? "Continue" : "Start exploring"}
        </Button>
        {step === 1 ? (
          <p className="text-center text-sm text-[#8a8a96]">
            Already have an account? <Link href="/login" className="font-medium text-[#2D1012]">Log in</Link>
          </p>
        ) : null}
      </PageActions>
    </PageShell>
  )
}
