"use client"

import { Calendar, ChevronRight, Inbox, MapPin, MessageCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { HaguProfileStatusBadge } from "@/components/hagu/hagu-profile-status-badge"
import { HaguPendingReviewsBanner } from "@/components/hagu/hagu-reviews-list-screen"
import { HaguWordmark } from "@/components/hagu/hagu-wordmark"
import {
  PROVIDER_BOOKINGS,
  PROVIDER_FEED_TAB_COUNTS,
  PROVIDER_PROFILE,
  PROVIDER_TODAY_AGENDA,
  PROVIDER_TODAY_LABEL,
  PROVIDER_UNREAD_CHATS,
  PROVIDER_UNREAD_TOTAL,
  type ProviderAgendaItem,
} from "@/lib/hagu-provider-feed"
import { ROUTES } from "@/lib/routes"
import { useProviderProfileStatus } from "@/hooks/use-provider-profile-status"
import { cn } from "@/lib/utils"

const NEXT_BOOKING = PROVIDER_BOOKINGS.find(
  (booking) => booking.category === "upcoming" && booking.status === "confirmed",
)

function timeGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export function HaguProviderHome() {
  const router = useRouter()
  const nextBooking = NEXT_BOOKING
  const { isActive } = useProviderProfileStatus()

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] text-[#8A8A96]">{timeGreeting()},</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-2">
            <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">
              {PROVIDER_PROFILE.firstName}
            </h1>
            <HaguProfileStatusBadge active={isActive} />
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push(ROUTES.settings)}
          className="relative shrink-0"
          aria-label="Open profile settings"
        >
          <div className="size-12 overflow-hidden rounded-3xl border-2 border-white">
            <Image
              src={PROVIDER_PROFILE.photo}
              alt={PROVIDER_PROFILE.firstName}
              width={48}
              height={48}
              className="size-full object-cover"
            />
          </div>
          <span
            className={cn(
              "absolute bottom-0 right-0 size-3.5 rounded-[7px] border-2 border-white",
              isActive ? "bg-[#5BBFB5]" : "bg-[#B8B8C2]",
            )}
          />
        </button>
      </div>

      <button
        type="button"
        onClick={() => router.push(ROUTES.settingsTransactions)}
        className="relative w-full overflow-hidden rounded-[24px] bg-[#2D1012] p-6 text-left transition active:opacity-95"
      >
        <div className="relative overflow-hidden rounded-[24px] bg-[#2D1012]/10 px-3.5 py-6 backdrop-blur-[20px]">
          <p className="text-xs font-medium uppercase tracking-wide text-white/50">This month</p>
          <p className="mt-1 text-[36px] font-bold tracking-tight text-white">€ 1.240</p>
          <div className="mt-3 flex gap-5 border-t border-white/10 pt-3">
            <Stat label="Sessions" value="14" />
            <Divider />
            <Stat label="Avg. rating" value="4.9 ⭐" />
            <Divider />
            <Stat label="Pending" value="€ 95" valueClassName="text-[#D0F1F0]" />
          </div>
          <HaguWordmark className="pointer-events-none absolute -right-3 -top-3 h-[118px] w-[114px] -rotate-[28deg]" />
          <HaguWordmark className="pointer-events-none absolute bottom-1 right-3 h-11 w-11 rotate-[14deg]" />
        </div>
      </button>

      <RequestsBanner onNavigate={() => router.push(ROUTES.requests)} />

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#1A1A1E]">Today</p>
            <p className="text-[13px] text-[#8A8A96]">{PROVIDER_TODAY_LABEL}</p>
          </div>
          <button
            type="button"
            onClick={() => router.push(ROUTES.calendar)}
            className="inline-flex items-center gap-1 text-[13px] font-medium text-[#3DA89E]"
          >
            Calendar
            <ChevronRight className="size-3.5" />
          </button>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-black/[0.06] bg-white shadow-[0px_2px_8px_rgba(26,26,30,0.04)]">
          {PROVIDER_TODAY_AGENDA.map((item, index) => (
            <AgendaRow
              key={item.id}
              item={item}
              showBorder={index < PROVIDER_TODAY_AGENDA.length - 1}
              onOpen={() => {
                if (item.type === "booking" && item.chatId) {
                  router.push(ROUTES.chatThread(item.chatId))
                  return
                }
                router.push(ROUTES.calendar)
              }}
            />
          ))}
        </div>
      </section>

      <p className="text-xs font-medium uppercase tracking-wide text-[#1A1A1E]">Next Booking</p>

      {nextBooking ? (
        <div className="rounded-[20px] border border-black/[0.06] bg-white px-5 pb-5 pt-3 shadow-[0px_2px_8px_rgba(26,26,30,0.04)]">
          <button
            type="button"
            onClick={() => router.push(ROUTES.bookings)}
            className="flex w-full items-center gap-3.5 text-left"
          >
            <div className="relative size-[52px] shrink-0 overflow-hidden rounded-[26px]">
              <Image src={nextBooking.avatar} alt={nextBooking.name} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium text-[#1A1A1E]">{nextBooking.activity}</p>
              <p className="text-[13px] text-[#8A8A96]">
                {nextBooking.name} · {nextBooking.date}
              </p>
            </div>
            <div className="text-right">
              <p className="text-base font-bold text-[#1A1A1E]">{nextBooking.price}</p>
              <p className="text-[11px] text-[#2D1012]">2 hrs</p>
            </div>
          </button>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-[#F7F6F3] text-xs font-medium text-[#2D1012]"
            >
              <MapPin className="size-3.5" />
              De Pijp
            </button>
            <button
              type="button"
              onClick={() => router.push(ROUTES.chatThread(nextBooking.chatId))}
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-[#2D1012] text-xs font-medium text-white transition active:opacity-90"
            >
              <MessageCircle className="size-3.5" />
              Message
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => router.push(ROUTES.bookings)}
          className="w-full rounded-[20px] border border-dashed border-black/[0.1] bg-white px-5 py-8 text-center text-sm text-[#8A8A96]"
        >
          No upcoming bookings — view calendar
        </button>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[#1A1A1E]">Messages</p>
          <p className="text-[13px] font-medium text-[#3DA89E]">
            {PROVIDER_UNREAD_TOTAL} unread
          </p>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-black/[0.06] bg-white shadow-[0px_2px_8px_rgba(26,26,30,0.04)]">
          {PROVIDER_UNREAD_CHATS.map((chat, index) => (
            <button
              key={chat.chatId}
              type="button"
              onClick={() => router.push(ROUTES.chatThread(chat.chatId))}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3.5 text-left transition active:bg-black/[0.02]",
                index < PROVIDER_UNREAD_CHATS.length - 1 && "border-b border-black/[0.05]",
              )}
            >
              <div className="relative size-10 shrink-0 overflow-hidden rounded-[20px]">
                <Image src={chat.avatar} alt={chat.name} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[14px] font-medium text-[#1A1A1E]">{chat.name}</p>
                  <span className="shrink-0 rounded-full bg-[#1A1A1E] px-2 py-0.5 text-[10px] font-semibold text-white">
                    {chat.count}
                  </span>
                </div>
                <p className="truncate text-xs text-[#8A8A96]">{chat.preview}</p>
              </div>
              <ChevronRight className="size-4 shrink-0 text-[#B8B8C2]" />
            </button>
          ))}
        </div>
      </section>

      <HaguPendingReviewsBanner />
    </div>
  )
}

function RequestsBanner({ onNavigate }: { onNavigate: () => void }) {
  return (
    <button
      type="button"
      onClick={onNavigate}
      className="flex w-full items-center justify-between rounded-2xl bg-[rgba(208,241,240,0.4)] px-5 py-4 text-left transition active:opacity-90"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-[10px] bg-[#D0F1F0] text-[#2D1012]">
          <Inbox className="size-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#1A1A1E]">
            {PROVIDER_FEED_TAB_COUNTS.requests} new requests
          </p>
          <p className="text-xs text-[#8A8A96]">Waiting for your reply</p>
        </div>
      </div>
      <ChevronRight className="size-4 text-[#8A8A96]" />
    </button>
  )
}

function AgendaRow({
  item,
  showBorder,
  onOpen,
}: {
  item: ProviderAgendaItem
  showBorder: boolean
  onOpen: () => void
}) {
  const isBooking = item.type === "booking"

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3.5 text-left transition active:bg-black/[0.02]",
        showBorder && "border-b border-black/[0.05]",
      )}
    >
      <div className="flex w-11 shrink-0 flex-col items-center">
        <span className="text-[11px] font-medium text-[#8A8A96]">{item.time}</span>
        <span
          className={cn(
            "mt-1 size-2 rounded-full",
            isBooking ? "bg-[#5BBFB5]" : item.type === "open" ? "bg-[#D0F1F0]" : "bg-[#B8B8C2]",
          )}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium text-[#1A1A1E]">{item.title}</p>
        {item.subtitle ? <p className="text-xs text-[#8A8A96]">{item.subtitle}</p> : null}
      </div>
      {isBooking ? (
        <Calendar className="size-4 shrink-0 text-[#3DA89E]" />
      ) : (
        <ChevronRight className="size-4 shrink-0 text-[#B8B8C2]" />
      )}
    </button>
  )
}

function Stat({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div>
      <p className="text-[11px] text-white/40">{label}</p>
      <p className={valueClassName ?? "text-base text-white"}>{value}</p>
    </div>
  )
}

function Divider() {
  return <div className="w-px self-stretch bg-white/10" />
}
