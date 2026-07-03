"use client"

import {
  acceptReschedule,
  declineReschedule,
  withdrawReschedule,
} from "@/lib/hagee-booking-storage"
import type { RescheduleRequest } from "@/lib/hagee-reschedule"
import { ScreenPrimaryButton, ScreenSecondaryButton } from "@/components/ui/screen-footer"
import { cn } from "@/lib/utils"

type RescheduleRequestBannerProps = {
  bookingId: string
  counterpartyName: string
  rescheduleRequest: RescheduleRequest
  rescheduleDiff: string
  canRespond: boolean
  canWithdraw: boolean
  onUpdated?: () => void
  className?: string
}

export function RescheduleRequestBanner({
  bookingId,
  counterpartyName,
  rescheduleRequest,
  rescheduleDiff,
  canRespond,
  canWithdraw,
  onUpdated,
  className,
}: RescheduleRequestBannerProps) {
  const firstName = counterpartyName.split(" ")[0]

  const handleAccept = () => {
    acceptReschedule(bookingId)
    onUpdated?.()
  }

  const handleDecline = () => {
    declineReschedule(bookingId)
    onUpdated?.()
  }

  const handleWithdraw = () => {
    withdrawReschedule(bookingId)
    onUpdated?.()
  }

  return (
    <section className={cn("rounded-[16px] border border-hagu-border bg-hagu-canvas px-4 py-3.5", className)}>
      <p className="text-[13px] font-medium text-hagu-ink">
        {canRespond ? "Reschedule request" : `Waiting for ${firstName}`}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-hagu-label">{rescheduleDiff}</p>
      {rescheduleRequest.message ? (
        <p className="mt-2 text-xs italic leading-relaxed text-hagu-text-secondary">
          &ldquo;{rescheduleRequest.message}&rdquo;
        </p>
      ) : null}

      {canRespond ? (
        <div className="mt-3 flex gap-2">
          <ScreenSecondaryButton onClick={handleDecline} className="flex-1">
            Decline
          </ScreenSecondaryButton>
          <ScreenPrimaryButton onClick={handleAccept} className="flex-1 !w-auto">
            Accept
          </ScreenPrimaryButton>
        </div>
      ) : canWithdraw ? (
        <button
          type="button"
          onClick={handleWithdraw}
          className="mt-3 text-xs font-medium text-hagu-label underline-offset-2 hover:underline"
        >
          Withdraw request
        </button>
      ) : null}
    </section>
  )
}
