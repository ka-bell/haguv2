"use client"

import { Calendar, MessageCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import {
  clientBookingTabCounts,
  clientBookingsForTab,
  type HageeClientBookingOverview,
  type HageeClientBookingTab,
} from "@/lib/hagee-client-booking-detail"
import { getClientBookings, HAGEE_BOOKING_UPDATED_EVENT } from "@/lib/hagee-booking-storage"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

const TABS: { value: HageeClientBookingTab; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "pending", label: "Pending" },
  { value: "past", label: "Past" },
]

const STATUS_STYLES: Record<HageeClientBookingOverview["statusTone"], string> = {
  confirmed: "border border-hagu-border bg-hagu-canvas text-hagu-ink",
  pending: "bg-[#FFF8E7] text-[#D4900A]",
  cancelled: "bg-[#FCEAEA] text-[#DC3232]",
  declined: "border border-hagu-border bg-hagu-canvas text-hagu-text-secondary",
}

function BookingCard({
  booking,
  onOpen,
}: {
  booking: HageeClientBookingOverview
  onOpen: () => void
}) {
  const router = useRouter()

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onOpen()
        }
      }}
      className="hagu-surface-card w-full cursor-pointer px-5 pb-5 pt-4 text-left transition active:opacity-95"
    >
      <div className="flex items-center gap-3">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-[20px]">
          <Image src={booking.companionPhoto} alt={booking.companionName} fill className="object-cover" sizes="48px" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-hagu-ink">{booking.companionName}</p>
          <p className="text-xs text-hagu-text-secondary">{booking.activity}</p>
        </div>
        {booking.canMessage ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              router.push(ROUTES.chatThread(booking.chatId))
            }}
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-hagu-border bg-hagu-canvas text-hagu-ink transition active:opacity-80"
            aria-label={`Message ${booking.companionName}`}
          >
            <MessageCircle className="size-4" />
          </button>
        ) : null}
        <span className={cn("shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold", STATUS_STYLES[booking.statusTone])}>
          {booking.statusLabel}
        </span>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-hagu-border bg-hagu-canvas px-3 py-1.5 text-xs text-hagu-label">
          <Calendar className="size-3 shrink-0" />
          {booking.date}
        </span>
        <span className="inline-flex items-center rounded-lg border border-hagu-border bg-hagu-canvas px-3 py-1.5 text-xs font-semibold text-hagu-ink">
          {booking.price}
        </span>
      </div>
    </article>
  )
}

export function HageeBookingsScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<HageeClientBookingTab>("upcoming")
  const [bookings, setBookings] = useState(() => getClientBookings())

  const refresh = useCallback(() => {
    setBookings(getClientBookings())
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener(HAGEE_BOOKING_UPDATED_EVENT, refresh)
    window.addEventListener("storage", refresh)
    return () => {
      window.removeEventListener(HAGEE_BOOKING_UPDATED_EVENT, refresh)
      window.removeEventListener("storage", refresh)
    }
  }, [refresh])

  const counts = clientBookingTabCounts(bookings)
  const items = clientBookingsForTab(bookings, activeTab)

  return (
    <div className="space-y-5 pb-4">
      <div>
        <h1 className="hagu-page-title">My bookings</h1>
        <p className="mt-1 text-sm text-hagu-text-secondary">View, change, or cancel your upcoming time together.</p>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.value
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-[18px] py-2 text-[13px] font-medium transition",
                isActive ? "bg-hagu-ink text-white" : "border border-black/[0.08] bg-hagu-white text-hagu-text-secondary",
              )}
            >
              <span>{tab.label}</span>
              <span className={cn("tabular-nums", isActive ? "text-white/55" : "text-hagu-placeholder")}>
                {counts[tab.value]}
              </span>
            </button>
          )
        })}
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="hagu-surface-card px-5 py-10 text-center">
            <p className="text-sm text-hagu-text-secondary">No bookings in this tab yet.</p>
            <button
              type="button"
              onClick={() => router.push(ROUTES.explore)}
              className="mt-4 text-sm font-medium text-hagu-ink"
            >
              Find someone to meet
            </button>
          </div>
        ) : (
          items.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onOpen={() => router.push(ROUTES.booking(booking.id))}
            />
          ))
        )}
      </div>
    </div>
  )
}
