"use client"

import { Calendar, MessageCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { HaguRequestCard } from "@/components/hagu/hagu-request-card"
import {
  PROVIDER_ALL_FEED,
  PROVIDER_BOOKINGS,
  PROVIDER_FEED_TAB_COUNTS,
  PROVIDER_REQUESTS,
  type FeedItem,
  type ProviderBooking,
} from "@/lib/hagu-provider-feed"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

type BookingTab = "all" | "requests" | "upcoming" | "completed" | "cancelled"

const TABS: { value: BookingTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "requests", label: "Requests" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

function bookingBadge(booking: ProviderBooking) {
  if (booking.category === "completed") {
    return { label: "Completed", className: "bg-[#F7F6F3] text-[#8A8A96]" }
  }
  if (booking.category === "cancelled") {
    return { label: "Cancelled", className: "bg-[#FCEAEA] text-[#DC3232]" }
  }
  if (booking.status === "pending") {
    return { label: "Pending", className: "bg-[#FFF8E7] text-[#D4900A]" }
  }
  return { label: "Confirmed", className: "bg-[#EAF7F5] text-[#3DA89E]" }
}

function BookingCard({
  booking,
  onNavigate,
}: {
  booking: ProviderBooking
  onNavigate: (href: string) => void
}) {
  const badge = bookingBadge(booking)

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onNavigate(ROUTES.booking(booking.id))}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onNavigate(ROUTES.booking(booking.id))
        }
      }}
      className="w-full cursor-pointer rounded-[20px] border border-black/[0.06] bg-white px-5 pb-5 pt-4 text-left shadow-[0px_2px_8px_rgba(26,26,30,0.04)] transition active:opacity-95"
    >
      <div className="flex items-center gap-3">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-[24px]">
          <Image src={booking.avatar} alt={booking.name} fill className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-[#1A1A1E]">{booking.name}</p>
          <p className="text-xs text-[#8A8A96]">{booking.activity}</p>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onNavigate(ROUTES.chatThread(booking.chatId))
          }}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F7F6F3] text-[#1A1A1E] transition active:opacity-80"
          aria-label={`Message ${booking.name}`}
        >
          <MessageCircle className="size-4" />
        </button>
        <span className={cn("shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold", badge.className)}>
          {badge.label}
        </span>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F7F6F3] px-3 py-1.5 text-xs text-[#4A4A52]">
          {booking.showCalendarIcon ? <Calendar className="size-3 shrink-0" /> : null}
          {booking.date}
        </span>
        <span className="inline-flex items-center rounded-lg bg-[#F7F6F3] px-3 py-1.5 text-xs font-semibold text-[#1A1A1E]">
          {booking.price}
        </span>
      </div>
    </article>
  )
}

function visibleFeed(activeTab: BookingTab): FeedItem[] {
  if (activeTab === "all") return PROVIDER_ALL_FEED
  if (activeTab === "requests") {
    return PROVIDER_REQUESTS.map((request) => ({ kind: "request" as const, data: request }))
  }
  return PROVIDER_BOOKINGS.filter((booking) => booking.category === activeTab).map((booking) => ({
    kind: "booking" as const,
    data: booking,
  }))
}

export function HaguBookingsScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<BookingTab>("all")
  const items = visibleFeed(activeTab)

  return (
    <div className="space-y-5">
      <h1 className="text-[26px] font-semibold tracking-[-0.5px] text-[#1A1A1E]">Bookings</h1>

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
                isActive
                  ? "bg-[#1A1A1E] text-white"
                  : "border border-black/[0.08] bg-white text-[#8A8A96]",
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "tabular-nums",
                  isActive ? "text-white/55" : "text-[#B8B8C0]",
                  tab.value === "requests" && !isActive && PROVIDER_FEED_TAB_COUNTS.requests > 0
                    ? "font-semibold text-[#D4900A]"
                    : null,
                )}
              >
                {PROVIDER_FEED_TAB_COUNTS[tab.value]}
              </span>
            </button>
          )
        })}
      </div>

      <div className="space-y-5">
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#8A8A96]">No bookings in this tab yet.</p>
        ) : (
          items.map((item) =>
            item.kind === "request" ? (
              <HaguRequestCard
                key={item.data.id}
                request={item.data}
                onOpen={() => router.push(ROUTES.booking(item.data.id))}
                onMessage={() => router.push(ROUTES.chatThread(item.data.chatId))}
              />
            ) : (
              <BookingCard key={item.data.id} booking={item.data} onNavigate={router.push} />
            ),
          )
        )}
      </div>
    </div>
  )
}
