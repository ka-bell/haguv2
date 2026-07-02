"use client"

import { Calendar, MapPin, MessageCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { HaguPrototypeSheet } from "@/components/hagu/hagu-prototype-sheet"
import { SCREEN_FOOTER_SCROLL_PAD, ScreenFooter, ScreenPrimaryButton, ScreenSecondaryButton } from "@/components/ui/screen-footer"
import { getBookingOverview, type BookingOverview, type BookingOverviewTone } from "@/lib/hagu-provider-booking-detail"
import {
  confirmBookingRequest,
  declineBookingRequest,
  HAGEE_BOOKING_UPDATED_EVENT,
} from "@/lib/hagee-booking-storage"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

type HaguBookingDetailScreenProps = {
  bookingId: string
}

const STATUS_STYLES: Record<BookingOverviewTone, string> = {
  confirmed: "bg-[#EAF7F5] text-[#3DA89E]",
  pending: "bg-[#FFF8E7] text-[#D4900A]",
  completed: "bg-[#F7F6F3] text-[#8A8A96]",
  cancelled: "bg-[#FCEAEA] text-[#DC3232]",
  new: "bg-[#FFF8E7] text-[#D4900A]",
}

export function HaguBookingDetailScreen({ bookingId }: HaguBookingDetailScreenProps) {
  const router = useRouter()
  const [overview, setOverview] = useState<BookingOverview | null>(null)
  const [localCategory, setLocalCategory] = useState<BookingOverview["category"] | null>(null)
  const [showCancelSheet, setShowCancelSheet] = useState(false)

  const refresh = useCallback(() => {
    setOverview(getBookingOverview(bookingId))
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
        <p className="text-sm text-[#8A8A96]">Booking not found.</p>
        <button
          type="button"
          onClick={() => router.push(ROUTES.bookings)}
          className="mt-4 text-sm font-medium text-[#3DA89E]"
        >
          Back to bookings
        </button>
      </div>
    )
  }

  const category = localCategory ?? overview.category
  const statusTone: BookingOverviewTone =
    category === "cancelled"
      ? "cancelled"
      : category === "completed"
        ? "completed"
        : category === "request"
          ? "new"
          : overview.statusTone
  const statusLabel =
    category === "cancelled"
      ? "Cancelled"
      : category === "completed"
        ? "Completed"
        : category === "request"
          ? "New request"
          : overview.statusLabel

  const detailRows = [
    { label: "Activity", value: overview.activity },
    { label: "Date & time", value: overview.date },
    overview.duration ? { label: "Duration", value: overview.duration } : null,
    overview.location ? { label: "Location", value: overview.location } : null,
    overview.vibe ? { label: "Vibe", value: overview.vibe } : null,
    { label: "Total", value: overview.price, bold: true },
  ].filter(Boolean) as { label: string; value: string; bold?: boolean }[]

  const openChat = () => router.push(ROUTES.chatThread(overview.chatId))

  const handleAccept = () => {
    if (overview.storageId) {
      confirmBookingRequest(overview.storageId)
    }
    router.push(ROUTES.chatThread(overview.chatId))
  }

  const handleDecline = () => {
    if (overview.storageId) {
      declineBookingRequest(overview.storageId)
    }
    router.push(ROUTES.bookings)
  }

  const handleCancelBooking = () => {
    setLocalCategory("cancelled")
    setShowCancelSheet(false)
  }

  const firstName = overview.clientName.split(" ")[0]

  return (
    <>
      <div className={cn("space-y-5", SCREEN_FOOTER_SCROLL_PAD)}>
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.5px] text-[#1A1A1E]">Booking</h1>
          <p className="mt-1 text-sm text-[#8A8A96]">Manage this session with {firstName}</p>
        </div>

        <div className="rounded-[20px] border border-black/[0.06] bg-white px-5 pb-5 pt-4 shadow-[0px_2px_8px_rgba(26,26,30,0.04)]">
          <div className="flex items-center gap-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-[28px]">
              <Image src={overview.clientAvatar} alt={overview.clientName} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[17px] font-semibold text-[#1A1A1E]">{overview.clientName}</p>
              {overview.clientSubtitle ? (
                <p className="text-xs text-[#8A8A96]">{overview.clientSubtitle}</p>
              ) : null}
            </div>
            <span className={cn("shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold", STATUS_STYLES[statusTone])}>
              {statusLabel}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F7F6F3] px-3 py-1.5 text-xs text-[#4A4A52]">
              <Calendar className="size-3 shrink-0" />
              {overview.date}
            </span>
            {overview.location ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F7F6F3] px-3 py-1.5 text-xs text-[#4A4A52]">
                <MapPin className="size-3 shrink-0" />
                {overview.location}
              </span>
            ) : null}
          </div>
        </div>

        <section className="rounded-[20px] border border-black/[0.06] bg-white p-5 shadow-[0px_2px_8px_rgba(26,26,30,0.04)]">
          <p className="text-xs font-medium uppercase tracking-wide text-[#8A8A96]">Details</p>
          <div className="mt-4 space-y-2.5">
            {detailRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3 text-xs">
                <span className="text-[#8A8A96]">{row.label}</span>
                <span
                  className={cn(
                    "text-right text-[#1A1A1E]",
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
          <section className="rounded-[20px] border border-black/[0.06] bg-white p-5 shadow-[0px_2px_8px_rgba(26,26,30,0.04)]">
            <p className="text-xs font-medium uppercase tracking-wide text-[#8A8A96]">Message from {firstName}</p>
            <p className="mt-3 text-[14px] leading-relaxed text-[#4A4A52]">&ldquo;{overview.message}&rdquo;</p>
          </section>
        ) : null}

        {overview.escrowLabel && category !== "cancelled" ? (
          <section className="rounded-[14px] bg-[#EAF7F5] px-4 py-3.5">
            <p className="text-[13px] font-medium text-[#1A1A1E]">Payment</p>
            <p className="mt-1 text-xs leading-relaxed text-[#4A4A52]">{overview.escrowLabel}</p>
          </section>
        ) : null}

        {category === "request" ? (
          <p className="text-[12px] leading-relaxed text-[#8A8A96]">
            You can message {firstName} before accepting. Funds are held in escrow once you confirm.
          </p>
        ) : null}
      </div>

      <ScreenFooter>
        {category === "request" ? (
          <>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={handleDecline}
                className="flex h-14 w-[98px] shrink-0 items-center justify-center rounded-full border border-[#5BBFB5] text-[13px] font-medium text-[#3DA89E] transition active:opacity-80"
              >
                Decline
              </button>
              <ScreenPrimaryButton onClick={handleAccept} className="h-14 flex-1 rounded-full text-[13px]">
                Accept · {overview.price}
              </ScreenPrimaryButton>
            </div>
            <ScreenSecondaryButton onClick={openChat} className="h-12 rounded-full text-[13px]">
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="size-4" />
                Message {firstName}
              </span>
            </ScreenSecondaryButton>
          </>
        ) : category === "upcoming" && statusTone !== "cancelled" ? (
          <>
            <ScreenPrimaryButton onClick={openChat} className="h-14 rounded-full text-[15px]">
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="size-4" />
                Message {firstName}
              </span>
            </ScreenPrimaryButton>
            <ScreenSecondaryButton
              onClick={() => setShowCancelSheet(true)}
              className="h-12 rounded-full border-[#F0D4D4] text-[13px] text-[#DC3232]"
            >
              Cancel booking
            </ScreenSecondaryButton>
          </>
        ) : category === "completed" ? (
          <>
            <ScreenPrimaryButton onClick={openChat} className="h-14 rounded-full text-[15px]">
              Message {firstName}
            </ScreenPrimaryButton>
            {overview.reviewId ? (
              <ScreenSecondaryButton
                onClick={() => router.push(ROUTES.review(overview.reviewId!))}
                className="h-12 rounded-full text-[13px]"
              >
                Leave a review
              </ScreenSecondaryButton>
            ) : null}
          </>
        ) : (
          <ScreenPrimaryButton onClick={openChat} className="h-14 rounded-full text-[15px]">
            Message {firstName}
          </ScreenPrimaryButton>
        )}
      </ScreenFooter>

      <HaguPrototypeSheet
        open={showCancelSheet}
        onClose={() => setShowCancelSheet(false)}
        title="Cancel this booking?"
        figmaLabel="Sheet · Cancel booking"
      >
        <p className="text-sm leading-relaxed text-[#8A8A96]">
          {firstName} will be notified. Escrow is refunded automatically for cancellations more than 24 hours
          before the session.
        </p>
        <ScreenPrimaryButton onClick={handleCancelBooking} className="mt-4 h-12 rounded-full text-[13px]">
          Yes, cancel booking
        </ScreenPrimaryButton>
        <ScreenSecondaryButton onClick={() => setShowCancelSheet(false)} className="mt-2 h-12 rounded-full text-[13px]">
          Keep booking
        </ScreenSecondaryButton>
      </HaguPrototypeSheet>
    </>
  )
}
