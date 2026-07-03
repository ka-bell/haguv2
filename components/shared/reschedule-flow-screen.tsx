"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { BookingStepHeading } from "@/components/hagee/hagee-booking-chrome"
import { BookingSchedulePicker } from "@/components/hagee/booking-schedule-picker"
import { HaguFlowScreen } from "@/components/hagu/hagu-flow-screen"
import {
  getBookingRequest,
  requestReschedule,
  type HageeBookingRequest,
} from "@/lib/hagee-booking-storage"
import { getBookingTimeSlot } from "@/lib/hagee-booking"
import {
  bookingDateLine,
  canProposeReschedule,
  canContinueRescheduleDraft,
  counterpartyNameForRole,
  createRescheduleDraft,
  type RescheduleDraft,
} from "@/lib/hagee-reschedule"
import { isPrototypeMode } from "@/lib/prototype"
import { ROUTES } from "@/lib/routes"
import { getSession, type UserRole } from "@/lib/session"

type RescheduleFlowScreenProps = {
  bookingId: string
}

type RescheduleStep = 1 | 2

export function RescheduleFlowScreen({ bookingId }: RescheduleFlowScreenProps) {
  const router = useRouter()
  const [role, setRole] = useState<UserRole | null>(null)
  const [booking, setBooking] = useState<HageeBookingRequest | null>(null)
  const [step, setStep] = useState<RescheduleStep>(1)
  const [draft, setDraft] = useState<RescheduleDraft>(() => createRescheduleDraft())

  useEffect(() => {
    setRole(getSession().role)
    setBooking(getBookingRequest(bookingId) ?? null)
  }, [bookingId])

  if (!role || !booking) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-hagu-text-secondary">Loading…</p>
      </div>
    )
  }

  if (!canProposeReschedule(booking, role)) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-hagu-text-secondary">This booking can&apos;t be rescheduled right now.</p>
        <button
          type="button"
          onClick={() => router.push(ROUTES.booking(bookingId))}
          className="mt-4 text-sm font-medium text-hagu-ink"
        >
          Back to booking
        </button>
      </div>
    )
  }

  const counterpartyName = counterpartyNameForRole(booking, role)
  const counterpartyPhoto = role === "HAGEE" ? booking.profilePhoto : booking.clientPhoto
  const counterpartyFirstName = counterpartyName.split(" ")[0]
  const currentDate = bookingDateLine(booking)
  const slot = getBookingTimeSlot(draft.timeSlotId)
  const proposedDate = [draft.dateLabel, slot?.label].filter(Boolean).join(" · ")
  const canContinue = canContinueRescheduleDraft(draft)
  const backHref = ROUTES.booking(bookingId)

  const handleBack = () => {
    if (step === 1) {
      router.push(backHref)
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

    requestReschedule(bookingId, role, {
      dateLabel: draft.dateLabel!,
      timeLabel: slot?.label ?? "",
      message: draft.message,
    })
    router.push(backHref)
  }

  return (
    <HaguFlowScreen
      className="bg-hagu-canvas"
      onBack={handleBack}
      closeHref={backHref}
      ctaLabel={step === 1 ? "Continue" : "Send reschedule request"}
      onCta={handleContinue}
      ctaDisabled={!isPrototypeMode() && !canContinue}
    >
      {step === 1 ? (
        <div className="space-y-6">
          <BookingStepHeading
            title="Pick a new time"
            subtitle={`Choose when you'd like to meet ${counterpartyFirstName} instead.`}
          />

          <div className="hagu-surface-card flex items-center gap-3 px-4 py-3.5">
            <div className="relative size-11 shrink-0 overflow-hidden rounded-[16px]">
              <Image src={counterpartyPhoto} alt={counterpartyName} fill className="object-cover" sizes="44px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-hagu-ink">{booking.serviceLabel}</p>
              <p className="text-xs text-hagu-text-secondary">with {counterpartyName}</p>
              <p className="mt-1 text-xs text-hagu-label">Currently: {currentDate}</p>
            </div>
          </div>

          <BookingSchedulePicker
            value={draft}
            onChange={(next) => setDraft((prev) => ({ ...prev, ...next }))}
            showDuration={false}
          />

          <label className="flex w-full flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-hagu-label">Note</span>
              <span className="text-[11px] text-hagu-text-secondary">Optional</span>
            </div>
            <textarea
              value={draft.message}
              onChange={(e) => setDraft((prev) => ({ ...prev, message: e.target.value }))}
              placeholder={`Let ${counterpartyFirstName} know why you're moving the time…`}
              className="min-h-24 w-full rounded-[20px] border border-hagu-border bg-hagu-white px-4 py-3 text-[15px] text-hagu-ink outline-none transition placeholder:text-hagu-text-secondary focus:border-hagu-accent focus:ring-2 focus:ring-hagu-accent/50"
            />
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          <BookingStepHeading
            title="Confirm change"
            subtitle={`${counterpartyFirstName} will need to accept before the new time is confirmed.`}
          />

          <section className="hagu-surface-card p-5">
            <p className="hagu-section-label">Schedule change</p>
            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-hagu-text-secondary">Current</span>
                <span className="text-right text-[13px] font-medium text-hagu-ink">{currentDate}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-hagu-text-secondary">Proposed</span>
                <span className="text-right text-sm font-semibold text-hagu-ink">{proposedDate}</span>
              </div>
            </div>
          </section>

          {draft.message ? (
            <section className="hagu-surface-card p-5">
              <p className="hagu-section-label">Your note</p>
              <p className="mt-3 text-[14px] leading-relaxed text-hagu-label">&ldquo;{draft.message}&rdquo;</p>
            </section>
          ) : null}
        </div>
      )}
    </HaguFlowScreen>
  )
}
