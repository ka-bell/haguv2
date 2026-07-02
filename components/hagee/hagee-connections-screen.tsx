"use client"

import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { HageeTabShell } from "@/components/hagee/hagee-tab-shell"
import {
  HAGEE_CHAT_PREVIEWS,
  HAGEE_CONNECTIONS_BOOKINGS,
  type HageeChatPreview,
} from "@/lib/hagee-chat"
import {
  getBookingRequests,
  HAGEE_BOOKING_UPDATED_EVENT,
  type HageeBookingRequest,
} from "@/lib/hagee-booking-storage"
import { getSavedExploreMatches } from "@/lib/hagee-saved-storage"
import { useClientReady } from "@/hooks/use-client-ready"
import type { HageeExploreMatch } from "@/lib/hagee-explore"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

type ConnectionsTab = "chats" | "bookings" | "liked"

function parseConnectionsTab(value: string | null): ConnectionsTab {
  if (value === "liked" || value === "bookings" || value === "chats") return value
  return "chats"
}

function ConnectionsTabs({
  active,
  onChange,
}: {
  active: ConnectionsTab
  onChange: (tab: ConnectionsTab) => void
}) {
  const tabs: { id: ConnectionsTab; label: string }[] = [
    { id: "chats", label: "Chats" },
    { id: "bookings", label: "Bookings" },
    { id: "liked", label: "Liked" },
  ]

  return (
    <div className="flex rounded-2xl bg-hagu-surface-muted p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex-1 rounded-xl py-2 text-[13px] transition",
            active === tab.id
              ? "bg-hagu-white font-semibold text-hagu-ink shadow-[0px_1px_3px_rgba(26,26,30,0.06)]"
              : "font-medium text-hagu-text-secondary",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

function ChatRow({ chat }: { chat: HageeChatPreview }) {
  return (
    <Link
      href={ROUTES.chatThread(chat.id)}
      className="flex items-center gap-4 border-b border-hagu-border py-4 last:border-b-0"
    >
      <div className="relative shrink-0">
        <div className="relative size-[52px] overflow-hidden rounded-[20px]">
          <Image src={chat.avatar} alt={chat.name} fill className="object-cover" sizes="52px" />
        </div>
        {chat.online ? (
          <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-hagu-canvas bg-hagu-accent-strong" />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[15px] font-medium text-hagu-ink">{chat.name}</p>
          <span className="shrink-0 text-[11px] text-hagu-text-secondary">{chat.time}</span>
        </div>
        <p
          className={cn(
            "truncate text-[13px]",
            chat.unread ? "font-medium text-hagu-label" : "text-hagu-text-secondary",
          )}
        >
          {chat.preview}
        </p>
      </div>

      {chat.unreadCount ? (
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-hagu-heading text-[10px] font-semibold text-white">
          {chat.unreadCount}
        </span>
      ) : null}
    </Link>
  )
}

function BookingsTab({ requests }: { requests: HageeBookingRequest[] }) {
  const storedBookings = requests.map((request) => ({
    id: request.id,
    title: `${request.serviceLabel} with ${request.profileName}`,
    date: [request.dateLabel, request.timeLabel].filter(Boolean).join(" · ") || "Date TBD",
    status: request.status === "pending" ? "Awaiting confirmation" : request.status === "confirmed" ? "Confirmed" : "Declined",
    chatId: request.chatId,
    locked: request.status === "pending",
  }))

  const bookings = [
    ...storedBookings,
    ...HAGEE_CONNECTIONS_BOOKINGS.map((booking) => ({ ...booking, chatId: null as string | null, locked: false })),
  ]

  return (
    <div className="space-y-3 pt-2">
      {bookings.map((booking) => (
        <article key={booking.id} className="hagu-surface-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[15px] font-medium text-hagu-ink">{booking.title}</p>
              <p className="mt-1 text-[13px] text-hagu-text-secondary">{booking.date}</p>
              {booking.locked ? (
                <p className="mt-2 text-[12px] text-hagu-text-secondary">
                  They may reach out first — you can reply once they confirm
                </p>
              ) : null}
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                booking.status === "Confirmed"
                  ? "bg-hagu-accent-selected text-hagu-accent-strong"
                  : booking.status === "Declined"
                    ? "bg-hagu-surface-muted text-hagu-text-secondary"
                    : "bg-amber-50 text-amber-700",
              )}
            >
              {booking.status}
            </span>
          </div>
          {"chatId" in booking && booking.chatId && booking.status === "Confirmed" ? (
            <Link
              href={ROUTES.chatThread(booking.chatId)}
              className="mt-3 inline-block text-[13px] font-medium text-hagu-accent-strong"
            >
              Open chat
            </Link>
          ) : null}
        </article>
      ))}
    </div>
  )
}

function LikedTab({ saved }: { saved: HageeExploreMatch[] }) {
  if (saved.length === 0) {
    return (
      <div className="hagu-surface-card border-dashed px-4 py-10 text-center">
        <p className="text-sm text-hagu-text-secondary">
          Nog geen bewaarde profielen. Swipe naar rechts in Explore om iemand te bewaren.
        </p>
        <Link href={ROUTES.explore} className="mt-3 inline-block text-[13px] font-medium text-hagu-accent-strong">
          Naar Explore
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3 pt-2">
      {saved.map((profile) => (
        <Link
          key={profile.id}
          href={ROUTES.exploreProfile(profile.id)}
          className="flex items-center gap-4 hagu-surface-card p-3"
        >
          <div className="relative size-14 shrink-0 overflow-hidden rounded-[20px]">
            <Image src={profile.photo} alt={profile.name} fill className="object-cover" sizes="56px" />
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-medium text-hagu-ink">
              {profile.name}, {profile.age}
            </p>
            <p className="truncate text-[13px] text-hagu-text-secondary">{profile.tagline}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export function HageeConnectionsScreen() {
  const searchParams = useSearchParams()
  const ready = useClientReady()
  const tabFromQuery = searchParams.get("tab")
  const [tab, setTab] = useState<ConnectionsTab>(() => parseConnectionsTab(tabFromQuery))
  const [saved, setSaved] = useState<HageeExploreMatch[]>([])
  const [bookingRequests, setBookingRequests] = useState<HageeBookingRequest[]>([])

  useEffect(() => {
    setTab(parseConnectionsTab(tabFromQuery))
  }, [tabFromQuery])

  useEffect(() => {
    if (!ready) return
    setSaved(getSavedExploreMatches())
    const refreshBookings = () => setBookingRequests(getBookingRequests())
    refreshBookings()
    window.addEventListener(HAGEE_BOOKING_UPDATED_EVENT, refreshBookings)
    window.addEventListener("storage", refreshBookings)
    return () => {
      window.removeEventListener(HAGEE_BOOKING_UPDATED_EVENT, refreshBookings)
      window.removeEventListener("storage", refreshBookings)
    }
  }, [ready])

  const pendingChatIds = new Set(
    bookingRequests.filter((request) => request.status === "pending").map((request) => request.chatId),
  )
  const confirmedChats: HageeChatPreview[] = bookingRequests
    .filter((request) => request.status === "confirmed")
    .map((request) => ({
      id: request.chatId,
      name: request.profileName,
      avatar: request.profilePhoto,
      preview: "Booking confirmed — say hi to coordinate details",
      time: "Now",
      online: true,
    }))
  const staticChatIds = new Set(HAGEE_CHAT_PREVIEWS.map((chat) => chat.id))
  const visibleChats = [
    ...confirmedChats.filter((chat) => !staticChatIds.has(chat.id)),
    ...HAGEE_CHAT_PREVIEWS.filter((chat) => !pendingChatIds.has(chat.id)),
  ]

  return (
    <HageeTabShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="hagu-page-title">Connections</h1>
          <button
            type="button"
            aria-label="Search"
            className="flex size-9 items-center justify-center rounded-[10px] bg-hagu-surface-muted text-hagu-ink"
          >
            <Search className="size-[18px]" />
          </button>
        </div>

        <ConnectionsTabs active={tab} onChange={setTab} />

        {tab === "chats" ? (
          <div className="hagu-surface-card px-4">
            {visibleChats.length > 0 ? (
              visibleChats.map((chat) => <ChatRow key={chat.id} chat={chat} />)
            ) : (
              <p className="py-8 text-center text-sm text-hagu-text-secondary">
                No active chats yet. Book someone and wait for their confirmation to start messaging.
              </p>
            )}
          </div>
        ) : null}

        {tab === "bookings" ? <BookingsTab requests={bookingRequests} /> : null}
        {tab === "liked" ? <LikedTab saved={saved} /> : null}
      </div>
    </HageeTabShell>
  )
}
