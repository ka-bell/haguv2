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
import { getSavedExploreMatches } from "@/lib/hagee-saved-storage"
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
    <div className="flex rounded-[28px] bg-hagu-surface-muted p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex-1 rounded-[28px] py-2.5 text-[13px] transition",
            active === tab.id
              ? "bg-hagu-white font-semibold text-hagu-heading shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
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
      className="flex items-center gap-4 border-b border-hagu-border py-4"
    >
      <div className="relative shrink-0">
        <div className="relative size-[54px] overflow-hidden rounded-full">
          <Image src={chat.avatar} alt={chat.name} fill className="object-cover" sizes="54px" />
        </div>
        {chat.online ? (
          <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-hagu-canvas bg-hagu-accent-strong" />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[15px] font-semibold text-hagu-heading">{chat.name}</p>
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
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-hagu-accent-strong text-[10px] font-bold text-white">
          {chat.unreadCount}
        </span>
      ) : null}
    </Link>
  )
}

function BookingsTab() {
  return (
    <div className="space-y-3 pt-2">
      {HAGEE_CONNECTIONS_BOOKINGS.map((booking) => (
        <article
          key={booking.id}
          className="rounded-[20px] border border-hagu-border bg-hagu-white p-4 shadow-[0px_1px_4px_rgba(0,0,0,0.05)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[15px] font-semibold text-hagu-heading">{booking.title}</p>
              <p className="mt-1 text-[13px] text-hagu-text-secondary">{booking.date}</p>
            </div>
            <span className="rounded-full bg-hagu-accent-selected px-2.5 py-1 text-[10px] font-bold uppercase text-hagu-accent-strong">
              {booking.status}
            </span>
          </div>
        </article>
      ))}
    </div>
  )
}

function LikedTab({ saved }: { saved: HageeExploreMatch[] }) {
  if (saved.length === 0) {
    return (
      <div className="rounded-[20px] border border-dashed border-hagu-border bg-hagu-white px-4 py-10 text-center">
        <p className="text-sm text-hagu-text-secondary">
          Nog geen bewaarde profielen. Swipe naar rechts in Explore om iemand te bewaren.
        </p>
        <Link href={ROUTES.explore} className="mt-3 inline-block text-sm font-medium text-hagu-accent-strong">
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
          href={ROUTES.explore}
          className="flex items-center gap-4 rounded-[20px] border border-hagu-border bg-hagu-white p-3 shadow-[0px_1px_4px_rgba(0,0,0,0.05)]"
        >
          <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl">
            <Image src={profile.photo} alt={profile.name} fill className="object-cover" sizes="56px" />
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-hagu-heading">
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
  const tabFromQuery = searchParams.get("tab")
  const [tab, setTab] = useState<ConnectionsTab>(() => parseConnectionsTab(tabFromQuery))
  const [saved, setSaved] = useState<HageeExploreMatch[]>([])

  useEffect(() => {
    setTab(parseConnectionsTab(tabFromQuery))
  }, [tabFromQuery])

  useEffect(() => {
    setSaved(getSavedExploreMatches())
  }, [])

  return (
    <HageeTabShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-hagu-heading">Connections</h1>
          <button
            type="button"
            aria-label="Search"
            className="flex size-9 items-center justify-center rounded-full border border-hagu-border bg-hagu-white shadow-[0px_2px_5px_rgba(0,0,0,0.03)]"
          >
            <Search className="size-[18px] text-hagu-heading" />
          </button>
        </div>

        <ConnectionsTabs active={tab} onChange={setTab} />

        {tab === "chats" ? (
          <div>
            {HAGEE_CHAT_PREVIEWS.map((chat) => (
              <ChatRow key={chat.id} chat={chat} />
            ))}
          </div>
        ) : null}

        {tab === "bookings" ? <BookingsTab /> : null}
        {tab === "liked" ? <LikedTab saved={saved} /> : null}
      </div>
    </HageeTabShell>
  )
}
