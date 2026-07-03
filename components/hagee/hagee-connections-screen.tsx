"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { HageeTabShell } from "@/components/hagee/hagee-tab-shell"
import { HAGEE_CHAT_PREVIEWS, type HageeChatPreview } from "@/lib/hagee-chat"
import {
  activeConnectionBookings,
  connectionBookingDate,
  connectionBookingStatusLabel,
  connectionBookingTitle,
} from "@/lib/hagee-client-booking-detail"
import {
  getBookingRequests,
  HAGEE_BOOKING_UPDATED_EVENT,
  type HageeBookingRequest,
} from "@/lib/hagee-booking-storage"
import { getSavedExploreMatches } from "@/lib/hagee-saved-storage"
import { useClientReady } from "@/hooks/use-client-ready"
import type { HageeExploreMatch } from "@/lib/hagee-explore"
import { ROUTES } from "@/lib/routes"
import { selectionPillClass } from "@/lib/hagu-selection-styles"
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
    <div className="flex gap-2">
      {tabs.map((tab) => {
        const selected = active === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              selectionPillClass(selected, "sm"),
              "flex flex-1 items-center justify-center",
            )}
          >
            {tab.label}
          </button>
        )
      })}
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
          <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-hagu-canvas bg-hagu-heading" />
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
  const router = useRouter()
  const bookings = activeConnectionBookings(requests)

  if (bookings.length === 0) {
    return (
      <div className="hagu-surface-card border-dashed px-4 py-10 text-center">
        <p className="text-sm text-hagu-text-secondary">No bookings yet. Book someone from Explore to get started.</p>
        <Link href={ROUTES.explore} className="mt-3 inline-block text-[13px] font-medium text-hagu-label">
          Naar Explore
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3 pt-2">
      {bookings.map((booking) => {
        const statusLabel = connectionBookingStatusLabel(booking.status)

        return (
          <button
            key={booking.id}
            type="button"
            onClick={() => router.push(ROUTES.booking(booking.id))}
            className="hagu-surface-card flex w-full items-center gap-3.5 p-4 text-left transition active:opacity-95"
          >
            <div className="relative size-[52px] shrink-0 overflow-hidden rounded-[20px]">
              <Image
                src={booking.profilePhoto}
                alt={booking.profileName}
                fill
                className="object-cover"
                sizes="52px"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium text-hagu-ink">{connectionBookingTitle(booking)}</p>
              <p className="mt-1 text-[13px] text-hagu-text-secondary">{connectionBookingDate(booking)}</p>
            </div>

            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold",
                booking.status === "confirmed"
                  ? "border border-hagu-border bg-hagu-canvas text-hagu-ink"
                  : "bg-[#FFF8E7] text-[#D4900A]",
              )}
            >
              {statusLabel}
            </span>
          </button>
        )
      })}
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
        <Link href={ROUTES.explore} className="mt-3 inline-block text-[13px] font-medium text-hagu-label">
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
  const router = useRouter()
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

  const handleTabChange = (next: ConnectionsTab) => {
    setTab(next)
    const href = next === "chats" ? ROUTES.chat : ROUTES.connectionsTab(next)
    router.replace(href, { scroll: false })
  }

  return (
    <HageeTabShell>
      <div className="space-y-5">
        <h1 className="hagu-page-title">Connections</h1>

        <ConnectionsTabs active={tab} onChange={handleTabChange} />

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
