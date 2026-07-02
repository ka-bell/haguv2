"use client"

import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Check, Lock, ShieldCheck, Sparkles, Sun, Moon } from "lucide-react"
import {
  BookingStepHeading,
  bookingBannerClass,
  bookingCardClass,
  bookingDateClass,
  bookingPillClass,
} from "@/components/hagee/hagee-booking-chrome"
import { HaguFlowCta } from "@/components/hagu/hagu-flow-cta"
import { HaguFlowHeader } from "@/components/hagu/hagu-flow-header"
import { HaguFlowScreen } from "@/components/hagu/hagu-flow-screen"
import { ScreenLayout } from "@/components/ui/screen-layout"
import {
  createBookingRequestFromDraft,
  saveBookingRequest,
} from "@/lib/hagee-booking-storage"
import {
  BOOKING_CONTINUE_LABELS,
  BOOKING_DATE_OPTIONS,
  BOOKING_DURATIONS,
  BOOKING_FLOW_STEPS,
  BOOKING_TIPS,
  BOOKING_TIME_SLOTS,
  BOOKING_VIBES,
  ESCROW_STEPS,
  PAYMENT_METHODS,
  canContinueBooking,
  createBookingDraft,
  formatBookingDateLabel,
  formatEscrowAmount,
  formatRequestLine,
  getBookingDuration,
  getBookingTimeSlot,
  getBookingVibe,
  resolveBookingService,
  type BookingStep,
} from "@/lib/hagee-booking"
import type { HageeCompanionProfile } from "@/lib/hagee-companion-profiles"
import { isPrototypeMode } from "@/lib/prototype"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

type HageeBookingFlowProps = {
  profile: HageeCompanionProfile
}

const TIME_ICONS = { sun: Sun, moon: Moon, sparkles: Sparkles } as const

const STEP_META: Record<BookingStep, { label: string; title: string; subtitle?: string }> = {
  2: {
    label: "02 — When works for you?",
    title: "When works for you?",
    subtitle: "Pick a date, time, and how long you'd like to meet.",
  },
  3: {
    label: "03 — Add a note",
    title: "Say something",
    subtitle: "Help them understand what you're hoping for.",
  },
  4: {
    label: "04 — Confirm & pay",
    title: "Confirm your request",
    subtitle: "Your payment is held safely in escrow until after the meetup.",
  },
  5: { label: "", title: "Request sent", subtitle: "" },
}

export function HageeBookingFlow({ profile }: HageeBookingFlowProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceFromQuery = searchParams.get("service")
  const [step, setStep] = useState<BookingStep>(2)
  const [draft, setDraft] = useState(() => createBookingDraft(serviceFromQuery))

  useEffect(() => {
    if (!serviceFromQuery) {
      router.replace(ROUTES.exploreProfile(profile.id))
      return
    }
    setDraft((prev) => ({ ...prev, serviceId: serviceFromQuery }))
  }, [serviceFromQuery, profile.id, router])

  const service = resolveBookingService(profile, draft.serviceId)
  const slot = getBookingTimeSlot(draft.timeSlotId)
  const duration = getBookingDuration(draft.durationId)
  const vibe = getBookingVibe(draft.vibeId)
  const escrowAmount = formatEscrowAmount(service?.price ?? "€75")
  const canContinue = canContinueBooking(step, draft)
  const progress = step <= 4 ? ((step - 1) / BOOKING_FLOW_STEPS) * 100 : undefined

  const handleBack = () => {
    if (step === 2) {
      router.push(ROUTES.exploreProfile(profile.id))
      return
    }
    if (step === 5) return
    setStep((prev) => (prev - 1) as BookingStep)
  }

  const handleContinue = () => {
    if (!isPrototypeMode() && !canContinue) return
    if (step < 4) {
      setStep((prev) => (prev + 1) as BookingStep)
      return
    }
    if (step === 4) {
      saveBookingRequest(createBookingRequestFromDraft(profile, draft))
      setStep(5)
      return
    }
    router.push(`${ROUTES.chat}?tab=bookings`)
  }

  const ctaLabel =
    step === 4
      ? BOOKING_CONTINUE_LABELS[4].replace("{amount}", escrowAmount.replace("€", ""))
      : BOOKING_CONTINUE_LABELS[step]

  const renderScheduleStep = () => (
    <div className="space-y-5">
      {service ? (
        <div className="hagu-surface-card flex items-center gap-3 px-4 py-3.5">
          <span className="flex size-10 items-center justify-center rounded-[12px] bg-hagu-accent-soft text-base">🍽</span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-medium text-hagu-ink">{service.label}</p>
            <p className="text-[13px] text-hagu-text-secondary">{service.duration}</p>
          </div>
          <p className="text-[15px] font-semibold text-hagu-ink">{service.price}</p>
        </div>
      ) : null}

      <section>
        <p className="hagu-section-label">Pick a date</p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {BOOKING_DATE_OPTIONS.map((option) => {
            const selected = draft.day === option.day
            return (
              <button
                key={option.day}
                type="button"
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    day: option.day,
                    dateLabel: formatBookingDateLabel(option.day),
                  }))
                }
                className={bookingDateClass(selected)}
              >
                <span className="text-[11px] font-medium">{option.weekday}</span>
                <span className="mt-0.5 text-xl font-semibold leading-none">{option.day}</span>
                <span className="mt-1 text-[11px]">{option.month}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <p className="hagu-section-label">Preferred time</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {BOOKING_TIME_SLOTS.map((timeSlot) => {
            const selected = draft.timeSlotId === timeSlot.id
            const Icon = timeSlot.icon ? TIME_ICONS[timeSlot.icon] : Sparkles
            return (
              <button
                key={timeSlot.id}
                type="button"
                onClick={() => setDraft((prev) => ({ ...prev, timeSlotId: timeSlot.id }))}
                className={cn(bookingCardClass(selected), "px-3 py-3 text-center")}
              >
                <Icon className="mx-auto size-4 text-hagu-label" />
                <p className="mt-2 text-[13px] font-medium text-hagu-ink">{timeSlot.label}</p>
                <p className="mt-0.5 text-[11px] text-hagu-text-secondary">{timeSlot.subtitle}</p>
              </button>
            )
          })}
        </div>
      </section>

      <div className={cn(bookingBannerClass(), "flex items-start gap-3")}>
        <div className="relative size-7 shrink-0 overflow-hidden rounded-full border-2 border-white">
          <Image src={profile.photo} alt="" fill className="object-cover" sizes="28px" />
        </div>
        <p className="text-[13px] leading-relaxed text-hagu-label">
          {profile.name} is usually free {profile.availabilityLabel.toLowerCase()}. They&apos;ll confirm the exact time
          in chat.
        </p>
      </div>

      <section>
        <p className="hagu-section-label">How long?</p>
        <div className="mt-3 flex gap-2">
          {BOOKING_DURATIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setDraft((prev) => ({ ...prev, durationId: item.id }))}
              className={cn(bookingPillClass(draft.durationId === item.id), "flex-1 text-center")}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  )

  const renderNoteStep = () => (
    <div className="space-y-5">
      <section className="hagu-surface-card p-4">
        <p className="hagu-section-label">Your request so far</p>
        <div className="mt-3 space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-hagu-accent-soft text-sm">🍽</span>
            <p className="text-sm text-hagu-ink">{service?.label ?? "Activity"}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-hagu-accent-soft text-sm">📅</span>
            <p className="text-sm text-hagu-ink">
              {draft.dateLabel ?? "Date"} · {slot?.label ?? "Time"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative size-8 shrink-0 overflow-hidden rounded-full border-2 border-white">
              <Image src={profile.photo} alt="" fill className="object-cover" sizes="32px" />
            </div>
            <p className="text-sm text-hagu-ink">
              {duration?.label ?? "Duration"} with {profile.name}
            </p>
          </div>
        </div>
      </section>

      <section>
        <p className="hagu-section-label">What should be the vibe?</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {BOOKING_VIBES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setDraft((prev) => ({ ...prev, vibeId: item.id }))}
              className={cn(bookingCardClass(draft.vibeId === item.id), "px-3 py-3 text-left")}
            >
              <p className="text-[13px] font-medium text-hagu-ink">{item.label}</p>
              <p className="mt-1 text-[11px] leading-snug text-hagu-text-secondary">{item.subtitle}</p>
            </button>
          ))}
        </div>
      </section>

      <label className="flex w-full flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-hagu-label">Your note</span>
          <span className="text-[11px] text-hagu-text-secondary">Optional</span>
        </div>
        <textarea
          value={draft.message}
          onChange={(e) => setDraft((prev) => ({ ...prev, message: e.target.value }))}
          placeholder={`Hi ${profile.name}, I'd love to keep it low-key...`}
          className="min-h-32 w-full rounded-[20px] border border-black/[0.06] bg-hagu-white px-4 py-3 text-[15px] text-hagu-ink outline-none transition placeholder:text-hagu-text-secondary focus:border-hagu-accent-strong focus:ring-2 focus:ring-hagu-accent/50"
        />
      </label>

      <section className={bookingBannerClass()}>
        <p className="hagu-section-label text-hagu-accent-strong">What works well</p>
        <ul className="mt-2 space-y-1.5">
          {BOOKING_TIPS.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-[13px] text-hagu-label">
              <Check className="mt-0.5 size-3.5 shrink-0 text-hagu-accent-strong" />
              {tip}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )

  const renderConfirmStep = () => (
    <div className="space-y-5">
      <span className="inline-flex rounded-full border border-hagu-accent-strong/30 bg-hagu-accent-selected px-3 py-1 text-[11px] font-semibold text-hagu-accent-strong">
        {escrowAmount} held in escrow
      </span>

      <section className="hagu-surface-card overflow-hidden">
        <div className="border-b border-hagu-border px-4 py-3">
          <p className="hagu-section-label text-hagu-text-secondary">You&apos;re requesting</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-[20px] border-2 border-white">
            <Image src={profile.photo} alt="" fill className="object-cover" sizes="48px" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-hagu-ink">{profile.name}</p>
            <p className="mt-0.5 text-[13px] leading-snug text-hagu-text-secondary">{formatRequestLine(profile, draft)}</p>
          </div>
          <span className="rounded-full bg-hagu-surface-muted px-2.5 py-1 text-[11px] font-semibold text-hagu-ink">88%</span>
        </div>
        <div className="mx-4 mb-4 rounded-[16px] bg-hagu-surface-muted px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-hagu-label">Amount reserved</p>
            <p className="text-xl font-semibold text-hagu-ink">{escrowAmount}</p>
          </div>
          <div className="mt-3 space-y-2 border-t border-hagu-border pt-3 text-xs text-hagu-text-secondary">
            <div className="flex justify-between">
              <span>Service fee</span>
              <span>Included</span>
            </div>
            <div className="flex justify-between">
              <span>Platform fee</span>
              <span>€0.00</span>
            </div>
          </div>
        </div>
      </section>

      <section className="hagu-surface-card p-4">
        <p className="hagu-section-label text-hagu-text-secondary">How your {escrowAmount} is protected</p>
        <div className="mt-4 space-y-4">
          {ESCROW_STEPS.map((item, index) => (
            <div key={item.title} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="flex size-7 items-center justify-center rounded-full bg-hagu-heading text-xs font-semibold text-white">
                  {index + 1}
                </span>
                {index < ESCROW_STEPS.length - 1 ? <span className="mt-1 w-px flex-1 bg-hagu-border" /> : null}
              </div>
              <div className="pb-1">
                <p className="text-sm font-medium text-hagu-ink">{item.title}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-hagu-text-secondary">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="hagu-surface-card flex gap-3 p-4">
        <ShieldCheck className="size-4 shrink-0 text-hagu-accent-strong" />
        <div>
          <p className="text-sm font-medium text-hagu-ink">Free cancellation</p>
          <p className="mt-0.5 text-[13px] text-hagu-text-secondary">
            Full refund if {profile.name} declines or does not respond within 24 hours.
          </p>
        </div>
      </section>

      <section className="hagu-surface-card p-4">
        <p className="hagu-section-label text-hagu-text-secondary">Pay with</p>
        <div className="mt-3 space-y-2">
          {PAYMENT_METHODS.map((method) => {
            const selected = draft.paymentMethod === method.id
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setDraft((prev) => ({ ...prev, paymentMethod: method.id }))}
                className={cn(bookingCardClass(selected), "flex w-full items-center gap-3 px-4 py-3")}
              >
                <span className="flex h-8 min-w-12 items-center justify-center rounded-lg bg-hagu-surface-muted px-2 text-[11px] font-semibold text-hagu-ink">
                  {method.id === "apple-pay" ? "Pay" : method.id === "ideal" ? "iDEAL" : "Card"}
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block text-sm font-medium text-hagu-ink">{method.label}</span>
                  <span className="block text-xs text-hagu-text-secondary">{method.subtitle}</span>
                </span>
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full border",
                    selected ? "border-hagu-accent-strong bg-hagu-accent-strong" : "border-hagu-border",
                  )}
                >
                  {selected ? <Check className="size-2.5 text-white" strokeWidth={3} /> : null}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-hagu-text-secondary">
        <Lock className="size-3" />
        Payments are encrypted and held in escrow until your meetup is complete.
      </p>
    </div>
  )

  const renderSuccessStep = () => (
    <div className="flex flex-col items-center px-2 pt-8 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-hagu-accent-soft">
        <Check className="size-9 text-hagu-accent-strong" strokeWidth={2.5} />
      </div>
      <h1 className="mt-6 hagu-page-title text-hagu-heading">Request sent</h1>
      <p className="mt-2 max-w-[300px] text-sm font-light leading-relaxed text-hagu-text-secondary">
        {profile.name} will review your request. They can message you first — you&apos;ll be able to reply once
        they confirm.
      </p>

      <div className="mt-6 w-full hagu-surface-card px-4 py-4 text-left">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-hagu-accent-selected">
            <Lock className="size-4 text-hagu-accent-strong" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-hagu-ink">{escrowAmount} reserved</p>
            <p className="text-[13px] text-hagu-text-secondary">
              Auto-released to {profile.name} 2 hrs after your meetup
            </p>
          </div>
          <span className="rounded-full bg-hagu-accent-selected px-2.5 py-1 text-[10px] font-semibold text-hagu-accent-strong">
            Held
          </span>
        </div>
      </div>

      <article className="mt-4 w-full hagu-surface-card p-4 text-left">
        <div className="flex items-center gap-3">
          <div className="relative size-11 shrink-0 overflow-hidden rounded-[18px] border-2 border-white">
            <Image src={profile.photo} alt="" fill className="object-cover" sizes="44px" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-hagu-ink">{profile.name}</p>
            <p className="flex items-center gap-1.5 text-xs text-hagu-text-secondary">
              <span className="size-1.5 rounded-full bg-amber-400" />
              Awaiting response
            </p>
          </div>
          <span className="rounded-full bg-hagu-surface-muted px-2.5 py-1 text-[11px] font-medium text-hagu-ink">Pending</span>
        </div>
        <div className="mt-4 space-y-2 text-sm text-hagu-label">
          <p>· {service?.label}</p>
          <p>
            · {draft.dateLabel} · {slot?.label}
          </p>
          <p>· {vibe?.label} vibe</p>
        </div>
      </article>
    </div>
  )

  if (step === 5) {
    return (
      <ScreenLayout
        className="bg-hagu-canvas"
        reserveHeader
        headerVariant="brand"
        header={<HaguFlowHeader closeHref={ROUTES.explore} />}
        footer={<HaguFlowCta label={BOOKING_CONTINUE_LABELS[5]} onClick={handleContinue} />}
      >
        {renderSuccessStep()}
      </ScreenLayout>
    )
  }

  const meta = STEP_META[step]

  return (
    <HaguFlowScreen
      className="bg-hagu-canvas"
      onBack={handleBack}
      closeHref={ROUTES.exploreProfile(profile.id)}
      progress={progress}
      ctaLabel={ctaLabel}
      onCta={handleContinue}
      ctaDisabled={!isPrototypeMode() && !canContinue}
    >
      <BookingStepHeading title={meta.title} subtitle={meta.subtitle} stepLabel={meta.label} />
      <div className="mt-6">
        {step === 2 ? renderScheduleStep() : null}
        {step === 3 ? renderNoteStep() : null}
        {step === 4 ? renderConfirmStep() : null}
      </div>
    </HaguFlowScreen>
  )
}
