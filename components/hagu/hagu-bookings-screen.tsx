"use client"

import { Calendar, MessageCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { HaguRequestCard } from "@/components/hagu/hagu-request-card"
import {
  PROVIDER_BOOKINGS,
  PROVIDER_REQUESTS,
  type FeedItem,
  type ProviderBooking,
  type ProviderRequest,
} from "@/lib/hagu-provider-feed"
import {
  bookingRequestToProviderRequest,
  confirmBookingRequest,
  declineBookingRequest,
  getBookingRequests,
  getStoredProviderBookings,
  HAGEE_BOOKING_UPDATED_EVENT,
  mergeProviderBookings,
} from "@/lib/hagee-booking-storage"
import { dismissDemoRequestId, readDismissedDemoRequestIds } from "@/lib/hagu-demo-request-dismiss"
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
    return { label: "Completed", className: "border border-black/[0.06] bg-hagu-canvas text-[#8A8A96]" }
  }
  if (booking.category === "cancelled") {
    return { label: "Cancelled", className: "bg-[#FCEAEA] text-[#DC3232]" }
  }
  if (booking.status === "pending") {
    return { label: "Reschedule pending", className: "bg-[#FFF8E7] text-[#D4900A]" }
  }
  return { label: "Confirmed", className: "border border-hagu-border bg-hagu-canvas text-hagu-ink" }
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
        <span className={cn("shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold", badge.className)}>
          {badge.label}
        </span>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.06] bg-hagu-canvas px-3 py-1.5 text-xs text-[#4A4A52]">
          {booking.showCalendarIcon ? <Calendar className="size-3 shrink-0" /> : null}
          {booking.date}
        </span>
        <span className="inline-flex items-center rounded-lg border border-black/[0.06] bg-hagu-canvas px-3 py-1.5 text-xs font-semibold text-[#1A1A1E]">
          {booking.price}
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onNavigate(ROUTES.booking(booking.id))
          }}
          className="hagu-action-btn-muted"
        >
          View booking
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onNavigate(ROUTES.chatThread(booking.chatId))
          }}
          className="hagu-action-btn-dark"
        >
          <MessageCircle className="size-3.5" />
          Chat
        </button>
      </div>
    </article>
  )
}

function visibleFeed(
  activeTab: BookingTab,
  storedBookings: ProviderBooking[],
  storedRequests: ReturnType<typeof bookingRequestToProviderRequest>[],
  dismissedDemoIds: string[],
): FeedItem[] {
  const mergedBookings = mergeProviderBookings(PROVIDER_BOOKINGS, storedBookings)
  const staticRequests = PROVIDER_REQUESTS.filter((request) => !dismissedDemoIds.includes(request.id))

  if (activeTab === "all") {
    const storedRequestItems = storedRequests.map((request) => ({ kind: "request" as const, data: request }))
    const staticRequestItems = staticRequests.map((request) => ({ kind: "request" as const, data: request }))
    const bookingItems = mergedBookings.map((booking) => ({ kind: "booking" as const, data: booking }))
    return [...storedRequestItems, ...staticRequestItems, ...bookingItems]
  }

  if (activeTab === "requests") {
    return [
      ...storedRequests.map((request) => ({ kind: "request" as const, data: request })),
      ...staticRequests.map((request) => ({ kind: "request" as const, data: request })),
    ]
  }

  return mergedBookings
    .filter((booking) => booking.category === activeTab)
    .map((booking) => ({ kind: "booking" as const, data: booking }))
}

export function HaguBookingsScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<BookingTab>("all")
  const [storedBookings, setStoredBookings] = useState<ProviderBooking[]>([])
  const [storedRequests, setStoredRequests] = useState<ReturnType<typeof bookingRequestToProviderRequest>[]>([])
  const [dismissedDemoIds, setDismissedDemoIds] = useState<string[]>([])

  useEffect(() => {
    setDismissedDemoIds(readDismissedDemoRequestIds())
  }, [])

  const dismissDemoRequest = (id: string) => {
    setDismissedDemoIds(dismissDemoRequestId(id))
  }

  const handleAcceptRequest = (request: ProviderRequest | ReturnType<typeof bookingRequestToProviderRequest>) => {
    if ("fromStorage" in request && request.fromStorage) {
      confirmBookingRequest(request.id)
      return
    }
    dismissDemoRequest(request.id)
  }

  const handleDeclineRequest = (request: ProviderRequest | ReturnType<typeof bookingRequestToProviderRequest>) => {
    if ("fromStorage" in request && request.fromStorage) {
      declineBookingRequest(request.id)
      return
    }
    dismissDemoRequest(request.id)
  }

  useEffect(() => {
    const refresh = () => {
      setStoredBookings(getStoredProviderBookings())
      setStoredRequests(
        getBookingRequests()
          .filter((request) => request.status === "pending")
          .map(bookingRequestToProviderRequest),
      )
    }
    refresh()
    window.addEventListener(HAGEE_BOOKING_UPDATED_EVENT, refresh)
    window.addEventListener("storage", refresh)
    return () => {
      window.removeEventListener(HAGEE_BOOKING_UPDATED_EVENT, refresh)
      window.removeEventListener("storage", refresh)
    }
  }, [])

  const items = useMemo(
    () => visibleFeed(activeTab, storedBookings, storedRequests, dismissedDemoIds),
    [activeTab, storedBookings, storedRequests, dismissedDemoIds],
  )

  const tabCounts = useMemo(() => {
    const mergedBookings = mergeProviderBookings(PROVIDER_BOOKINGS, storedBookings)
    const visibleStaticRequests = PROVIDER_REQUESTS.filter((request) => !dismissedDemoIds.includes(request.id))

    return {
      all: storedRequests.length + visibleStaticRequests.length + mergedBookings.length,
      requests: storedRequests.length + visibleStaticRequests.length,
      upcoming: mergedBookings.filter((booking) => booking.category === "upcoming").length,
      completed: mergedBookings.filter((booking) => booking.category === "completed").length,
      cancelled: mergedBookings.filter((booking) => booking.category === "cancelled").length,
    }
  }, [storedBookings, storedRequests, dismissedDemoIds])

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
                  tab.value === "requests" && !isActive && tabCounts.requests > 0
                    ? "font-semibold text-[#D4900A]"
                    : null,
                )}
              >
                {tabCounts[tab.value]}
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
                onAccept={() => handleAcceptRequest(item.data)}
                onDecline={() => handleDeclineRequest(item.data)}
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
