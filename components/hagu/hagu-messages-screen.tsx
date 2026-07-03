"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { HaguProviderTabShell } from "@/components/hagu/hagu-provider-tab-shell"
import { getProviderMessagePreviews, type ProviderMessagePreview } from "@/lib/hagu-chat-threads"
import { PROVIDER_UNREAD_TOTAL } from "@/lib/hagu-provider-feed"
import { HAGEE_BOOKING_UPDATED_EVENT } from "@/lib/hagee-booking-storage"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

function MessageRow({ chat }: { chat: ProviderMessagePreview }) {
  return (
    <Link
      href={ROUTES.chatThread(chat.id)}
      className="hagu-surface-card flex items-center gap-4 p-4 transition active:opacity-95"
    >
      <div className="relative shrink-0">
        <div className="relative size-[52px] overflow-hidden rounded-[20px]">
          <Image src={chat.avatar} alt={chat.name} fill className="object-cover" sizes="52px" />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[15px] font-medium text-hagu-ink">{chat.name}</p>
          {chat.time ? (
            <span className="shrink-0 text-[11px] text-hagu-text-secondary">{chat.time}</span>
          ) : null}
        </div>
        {chat.subtitle ? (
          <p className="truncate text-[11px] text-hagu-text-secondary">{chat.subtitle}</p>
        ) : null}
        <p
          className={cn(
            "truncate text-[13px]",
            chat.unreadCount > 0 ? "font-medium text-hagu-label" : "text-hagu-text-secondary",
          )}
        >
          {chat.preview}
        </p>
      </div>

      {chat.unreadCount > 0 ? (
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-hagu-heading text-[10px] font-semibold text-white">
          {chat.unreadCount}
        </span>
      ) : null}
    </Link>
  )
}

export function HaguMessagesScreen() {
  const [previews, setPreviews] = useState<ProviderMessagePreview[]>([])

  useEffect(() => {
    const refresh = () => setPreviews(getProviderMessagePreviews())
    refresh()
    window.addEventListener(HAGEE_BOOKING_UPDATED_EVENT, refresh)
    window.addEventListener("storage", refresh)
    return () => {
      window.removeEventListener(HAGEE_BOOKING_UPDATED_EVENT, refresh)
      window.removeEventListener("storage", refresh)
    }
  }, [])

  return (
    <HaguProviderTabShell>
      <div className="space-y-5 pb-4">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.5px] text-hagu-ink">Chat</h1>
          <p className="mt-1 text-sm text-hagu-text-secondary">
            {PROVIDER_UNREAD_TOTAL > 0
              ? `${PROVIDER_UNREAD_TOTAL} unread · message clients before or after bookings`
              : "Message clients before or after bookings"}
          </p>
        </div>

        {previews.length === 0 ? (
          <p className="py-8 text-center text-sm text-hagu-text-secondary">No conversations yet.</p>
        ) : (
          <div className="space-y-3">
            {previews.map((chat) => (
              <MessageRow key={chat.id} chat={chat} />
            ))}
          </div>
        )}
      </div>
    </HaguProviderTabShell>
  )
}
