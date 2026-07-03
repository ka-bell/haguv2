"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Clock, MessageCircle, Timer } from "lucide-react"
import { HaguWordmark } from "@/components/hagu/hagu-wordmark"
import { HageeActivityCard } from "@/components/hagee/hagee-activity-card"
import {
  HAGEE_ACTIVE_BOOKING,
  HAGEE_MOOD_OPTIONS,
  HAGEE_NEW_ARRIVALS,
} from "@/lib/hagee-home"
import { HAGEE_BOOKING_COMPANION_ID } from "@/lib/hagee-companion-profiles"
import { HAGEE_CLIENT_NAME } from "@/lib/hagee-discover"
import { applyHomeMoodFilter } from "@/lib/hagee-discover-preferences"
import { ROUTES } from "@/lib/routes"

function timeGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning,"
  if (hour < 18) return "Good afternoon,"
  return "Good evening,"
}

export function HageeHomeScreen() {
  const router = useRouter()
  const booking = HAGEE_ACTIVE_BOOKING

  return (
    <div className="space-y-5 pb-4">
      <div>
        <p className="hagu-page-greeting">{timeGreeting()}</p>
        <h1 className="hagu-page-title">{HAGEE_CLIENT_NAME}</h1>
      </div>

      <section className="relative overflow-hidden rounded-[24px] bg-[#2D1012] p-5">
        <div className="relative z-10 flex items-center justify-between gap-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-white/50">Active request</p>
          <span className="rounded-full bg-[#1E3D32] px-2.5 py-1 text-[10px] font-semibold uppercase text-[#8FD4B4]">
            {booking.status}
          </span>
        </div>

        <button
          type="button"
          onClick={() => router.push(ROUTES.exploreProfile(HAGEE_BOOKING_COMPANION_ID))}
          className="relative z-10 mt-4 flex w-full items-center gap-3.5 text-left"
        >
          <div className="relative size-[52px] shrink-0 overflow-hidden rounded-[20px]">
            <Image src={booking.companionPhoto} alt="" fill className="object-cover" sizes="52px" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-medium text-white">{booking.title}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-white/60">
              <Clock className="size-3.5 shrink-0" />
              {booking.time}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-white/60">
              <Timer className="size-3.5 shrink-0" />
              {booking.duration}
            </p>
          </div>
        </button>

        <div className="relative z-10 mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => router.push(ROUTES.booking(booking.id))}
            className="flex h-12 flex-1 items-center justify-center rounded-[20px] bg-white/10 text-sm font-medium text-white transition active:opacity-95"
          >
            View booking
          </button>
          <button
            type="button"
            onClick={() => router.push(ROUTES.chatThread(booking.chatId))}
            className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-[20px] bg-white text-sm font-medium text-hagu-ink transition active:opacity-95"
          >
            <MessageCircle className="size-3.5" />
            Chat
          </button>
        </div>

        <HaguWordmark className="pointer-events-none absolute -right-3 -top-3 z-0 h-[118px] w-[114px] -rotate-[28deg]" />
        <HaguWordmark className="pointer-events-none absolute bottom-1 right-3 z-0 h-11 w-11 rotate-[14deg]" />
      </section>

      <section className="space-y-3">
        <p className="hagu-section-label">What&apos;s the mood?</p>
        <div className="grid grid-cols-2 gap-3">
          {HAGEE_MOOD_OPTIONS.map((mood) => (
            <HageeActivityCard
              key={mood.id}
              variant="nav"
              icon={mood.icon}
              label={mood.title}
              subtitle={mood.subtitle}
              onClick={() => {
                applyHomeMoodFilter(mood.id)
                router.push(ROUTES.explore)
              }}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="hagu-section-label">New arrivals</p>
          <Link href={ROUTES.explore} className="text-[13px] font-medium text-hagu-label">
            View all
          </Link>
        </div>
        <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-1">
          {HAGEE_NEW_ARRIVALS.map((person) => (
            <button
              key={person.id}
              type="button"
              onClick={() => router.push(ROUTES.exploreProfile(person.id))}
              className="w-36 shrink-0 text-left"
            >
              <div className="relative h-48 overflow-hidden rounded-[20px] border border-hagu-border">
                <Image src={person.photo} alt={person.name} fill className="object-cover" sizes="144px" />
                <span className="absolute right-2 top-2 rounded-full bg-hagu-white px-2 py-0.5 text-[10px] font-semibold text-hagu-ink">
                  New
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-hagu-ink">{person.name}</p>
              <p className="text-[11px] text-hagu-text-secondary">{person.role}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
