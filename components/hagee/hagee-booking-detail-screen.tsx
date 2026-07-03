"use client"

import { Calendar, MessageCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { HaguPrototypeSheet } from "@/components/hagu/hagu-prototype-sheet"
import { RescheduleRequestBanner } from "@/components/shared/reschedule-request-banner"
import {
  SCREEN_FOOTER_SCROLL_PAD_TALL,
  ScreenDestructiveButton,
  ScreenFooter,
  ScreenPrimaryButton,
  ScreenSecondaryButton,
} from "@/components/ui/screen-footer"
import {
  getClientBookingOverview,
  type HageeClientBookingOverview,
  type HageeClientBookingTone,
} from "@/lib/hagee-client-booking-detail"
import { cancelBookingRequest, HAGEE_BOOKING_UPDATED_EVENT } from "@/lib/hagee-booking-storage"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

type HageeBookingDetailScreenProps = {
  bookingId: string
}

const STATUS_STYLES: Record<HageeClientBookingTone, string> = {
  confirmed: "border border-hagu-border bg-hagu-canvas text-hagu-ink",
  pending: "bg-[#FFF8E7] text-[#D4900A]",
  cancelled: "bg-[#FCEAEA] text-[#DC3232]",
  declined: "border border-hagu-border bg-hagu-canvas text-hagu-text-secondary",
}

export function HageeBookingDetailScreen({ bookingId }: HageeBookingDetailScreenProps) {
  const router = useRouter()
  const [overview, setOverview] = useState<HageeClientBookingOverview | null>(null)
  const [showCancelSheet, setShowCancelSheet] = useState(false)

  const refresh = useCallback(() => {
    setOverview(getClientBookingOverview(bookingId))
  }, [bookingId])

  useEffect(() => {
    refresh()
    window.addEventListener(HAGEE_BOOKING_UPDATED_EVENT, refresh)
    window.addEventListener("storage", refresh)
    return () => {
      window.removeEventListener(HAGEE_BOOKING_UPDATED_EVENT, refresh)
      window.removeEventListener("storage", refresh)
    }
  }, [refresh])

  if (!overview) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-hagu-text-secondary">Booking not found.</p>
        <button
          type="button"
          onClick={() => router.push(ROUTES.connectionsTab("bookings"))}
          className="mt-4 text-sm font-medium text-hagu-ink"
        >
          Back to bookings
        </button>
      </div>
    )
  }

  const firstName = overview.companionName.split(" ")[0]
  const detailRows = [
    { label: "Activity", value: overview.activity },
    { label: "Date & time", value: overview.date },
    overview.duration ? { label: "Duration", value: overview.duration } : null,
    overview.vibe ? { label: "Vibe", value: overview.vibe } : null,
    { label: "Total", value: overview.price, bold: true },
  ].filter(Boolean) as { label: string; value: string; bold?: boolean }[]

  const handleCancel = () => {
    cancelBookingRequest(bookingId)
    setShowCancelSheet(false)
    refresh()
  }

  const openChat = () => router.push(ROUTES.chatThread(overview.chatId))
  const reschedule = () => router.push(ROUTES.bookingReschedule(bookingId))

  const footerPad = SCREEN_FOOTER_SCROLL_PAD_TALL

  return (
    <>
      <div className={cn("space-y-5", footerPad)}>
        <div>
          <h1 className="hagu-page-title">Your booking</h1>
          <p className="mt-1 text-sm text-hagu-text-secondary">With {overview.companionName}</p>
        </div>

        {overview.rescheduleRequest && overview.rescheduleDiff ? (
          <RescheduleRequestBanner
            bookingId={bookingId}
            counterpartyName={overview.companionName}
            rescheduleRequest={overview.rescheduleRequest}
            rescheduleDiff={overview.rescheduleDiff}
            canRespond={overview.canRespondToReschedule}
            canWithdraw={overview.canWithdrawReschedule}
            onUpdated={refresh}
          />
        ) : null}

        <div className="hagu-surface-card px-5 pb-5 pt-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push(ROUTES.exploreProfile(overview.profileId))}
              className="relative size-14 shrink-0 overflow-hidden rounded-[20px]"
            >
              <Image src={overview.companionPhoto} alt={overview.companionName} fill className="object-cover" sizes="56px" />
            </button>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-[17px] font-semibold text-hagu-ink">{overview.companionName}</p>
              <p className="text-xs text-hagu-text-secondary">{overview.activity}</p>
            </div>
            <span className={cn("shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold", STATUS_STYLES[overview.statusTone])}>
              {overview.statusLabel}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-hagu-border bg-hagu-canvas px-3 py-1.5 text-xs text-hagu-label">
              <Calendar className="size-3 shrink-0" />
              {overview.date}
            </span>
          </div>
        </div>

        <section className="hagu-surface-card p-5">
          <p className="hagu-section-label">Details</p>
          <div className="mt-4 space-y-2.5">
            {detailRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3 text-xs">
                <span className="text-hagu-text-secondary">{row.label}</span>
                <span
                  className={cn(
                    "text-right text-hagu-ink",
                    row.bold ? "text-sm font-bold" : "text-[13px] font-medium",
                  )}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {overview.message ? (
          <section className="hagu-surface-card p-5">
            <p className="hagu-section-label">Your note</p>
            <p className="mt-3 text-[14px] leading-relaxed text-hagu-label">&ldquo;{overview.message}&rdquo;</p>
          </section>
        ) : null}

        {overview.escrowLabel && overview.statusTone !== "cancelled" && overview.statusTone !== "declined" ? (
          <section className="rounded-[16px] border border-hagu-border bg-hagu-canvas px-4 py-3.5">
            <p className="text-[13px] font-medium text-hagu-ink">Payment</p>
            <p className="mt-1 text-xs leading-relaxed text-hagu-label">{overview.escrowLabel}</p>
          </section>
        ) : null}

        {overview.statusTone === "pending" ? (
          <p className="text-[12px] leading-relaxed text-hagu-text-secondary">
            {firstName} will confirm your request soon. You can message them once the booking is accepted.
          </p>
        ) : null}
      </div>

      <ScreenFooter>
        {overview.statusTone === "pending" ? (
          <>
            <ScreenPrimaryButton disabled>Waiting for {firstName}</ScreenPrimaryButton>
            {overview.canCancel ? (
              <ScreenDestructiveButton onClick={() => setShowCancelSheet(true)}>
                Cancel request
              </ScreenDestructiveButton>
            ) : null}
          </>
        ) : overview.canReschedule || overview.canRespondToReschedule ? (
          <>
            <ScreenPrimaryButton onClick={openChat}>
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="size-4" />
                Message {firstName}
              </span>
            </ScreenPrimaryButton>
            {overview.canReschedule ? (
              <ScreenSecondaryButton onClick={reschedule}>Reschedule</ScreenSecondaryButton>
            ) : null}
            {overview.canCancel ? (
              <ScreenDestructiveButton onClick={() => setShowCancelSheet(true)}>
                Cancel booking
              </ScreenDestructiveButton>
            ) : null}
          </>
        ) : overview.canMessage ? (
          <ScreenPrimaryButton onClick={openChat}>Message {firstName}</ScreenPrimaryButton>
        ) : (
          <ScreenPrimaryButton onClick={() => router.push(ROUTES.explore)}>Book someone new</ScreenPrimaryButton>
        )}
      </ScreenFooter>

      <HaguPrototypeSheet
        open={showCancelSheet}
        onClose={() => setShowCancelSheet(false)}
        title={overview.statusTone === "pending" ? "Cancel this request?" : "Cancel this booking?"}
        figmaLabel="Sheet · Cancel booking"
      >
        <p className="text-sm leading-relaxed text-hagu-text-secondary">
          {firstName} will be notified. Escrow is refunded automatically for cancellations more than 24 hours before
          your session.
        </p>
        <ScreenDestructiveButton onClick={handleCancel} className="mt-4">
          Yes, cancel
        </ScreenDestructiveButton>
        <ScreenSecondaryButton onClick={() => setShowCancelSheet(false)} className="mt-2">
          Keep booking
        </ScreenSecondaryButton>
      </HaguPrototypeSheet>
    </>
  )
}
