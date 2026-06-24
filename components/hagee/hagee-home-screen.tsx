"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Clock, MapPin, MessageCircle, Star, Timer } from "lucide-react"
import {
  HAGEE_ACTIVE_BOOKING,
  HAGEE_DAILY_SPOTLIGHT,
  HAGEE_MOOD_OPTIONS,
  HAGEE_NEW_ARRIVALS,
} from "@/lib/hagee-home"
import { HAGEE_CLIENT_NAME } from "@/lib/hagee-discover"
import { HAGEE_EXPLORE_LOCATION } from "@/lib/hagee-explore"
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
  const spotlight = HAGEE_DAILY_SPOTLIGHT

  return (
    <div className="space-y-8 pb-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] text-hagu-text-secondary">{timeGreeting()}</p>
          <h1 className="text-2xl font-semibold tracking-tight text-hagu-heading">
            {HAGEE_CLIENT_NAME}
          </h1>
        </div>
        <button
          type="button"
          className="flex shrink-0 items-center gap-2 rounded-full border border-hagu-border bg-hagu-white px-3 py-1.5 text-xs font-medium text-hagu-heading shadow-[0px_2px_5px_rgba(0,0,0,0.03)]"
        >
          <MapPin className="size-3.5 text-hagu-accent-strong" />
          {HAGEE_EXPLORE_LOCATION}
        </button>
      </div>

      <section className="relative overflow-hidden rounded-[24px] bg-hagu-heading p-5 shadow-[0px_4px_16px_rgba(26,26,30,0.06)]">
        <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-hagu-accent-strong/10 blur-3xl" />
        <div className="relative space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.55px] text-white/60">
                Active Request
              </p>
              <h2 className="text-lg font-medium text-white">{booking.title}</h2>
            </div>
            <span className="rounded-full border border-hagu-accent-strong/20 bg-hagu-accent-strong/20 px-2.5 py-1 text-[10px] font-bold text-hagu-accent-soft backdrop-blur-sm">
              {booking.status}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-full border-2 border-white/10">
              <Image src={booking.companionPhoto} alt="" fill className="object-cover" sizes="48px" />
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-[13px] text-white/90">
                <Clock className="size-3.5" />
                {booking.time}
              </p>
              <p className="flex items-center gap-2 text-[13px] text-white/60">
                <Timer className="size-3.5" />
                {booking.duration}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              className="flex-1 rounded-[28px] border border-white/10 bg-white/10 py-2.5 text-[13px] font-medium text-white backdrop-blur-sm"
            >
              View Booking
            </button>
            <button
              type="button"
              onClick={() => router.push(ROUTES.chat)}
              className="flex flex-1 items-center justify-center gap-2 rounded-[28px] bg-hagu-white py-2.5 text-[13px] font-bold text-hagu-heading shadow-[0px_4px_6px_rgba(0,0,0,0.1)]"
            >
              <MessageCircle className="size-4" />
              Chat
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-hagu-heading">What&apos;s the mood?</h2>
        <div className="grid grid-cols-2 gap-3">
          {HAGEE_MOOD_OPTIONS.map((mood) => {
            const Icon = mood.icon
            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => router.push(ROUTES.explore)}
                className="relative overflow-hidden rounded-2xl border border-hagu-border bg-hagu-white p-4 text-left shadow-[0px_2px_10px_rgba(0,0,0,0.03)] transition active:opacity-90"
              >
                <div className={`absolute -right-4 -top-4 size-16 rounded-bl-full ${mood.cornerBg}`} />
                <div className={`relative flex size-10 items-center justify-center rounded-full ${mood.iconBg}`}>
                  <Icon className="size-5 text-hagu-heading" strokeWidth={1.75} />
                </div>
                <p className="relative mt-3 text-[15px] font-semibold text-hagu-heading">{mood.title}</p>
                <p className="relative mt-0.5 text-[11px] leading-snug text-hagu-text-secondary">
                  {mood.subtitle}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-hagu-heading">Daily Spotlight</h2>
        <article className="relative overflow-hidden rounded-[24px] border border-hagu-border bg-hagu-white p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
          <div className="pointer-events-none absolute -right-4 -top-4 size-20 rounded-bl-full bg-hagu-accent-strong/10" />
          <div className="relative flex items-center gap-4">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border border-hagu-border shadow-sm">
              <Image src={spotlight.photo} alt={spotlight.name} fill className="object-cover" sizes="80px" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[17px] font-semibold text-hagu-heading">{spotlight.name}</h3>
                <span className="flex items-center gap-1 rounded-md bg-hagu-accent-selected px-1.5 py-0.5 text-[10px] font-bold text-hagu-accent-strong">
                  <Star className="size-2.5 fill-current" />
                  {spotlight.rating.toFixed(1)}
                </span>
              </div>
              <p className="text-[13px] text-hagu-text-secondary">{spotlight.role}</p>
              <div className="mt-2.5 flex gap-2">
                {spotlight.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-hagu-surface-muted px-2 py-1 text-[10px] font-medium text-hagu-label"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-hagu-heading">New in {HAGEE_EXPLORE_LOCATION}</h2>
          <Link href={ROUTES.explore} className="text-xs font-semibold text-hagu-accent-strong">
            View All
          </Link>
        </div>
        <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
          {HAGEE_NEW_ARRIVALS.map((person) => (
            <button
              key={person.id}
              type="button"
              onClick={() => router.push(ROUTES.explore)}
              className="w-36 shrink-0 text-left"
            >
              <div className="relative h-48 overflow-hidden rounded-2xl shadow-[0px_2px_10px_rgba(0,0,0,0.03)]">
                <Image src={person.photo} alt={person.name} fill className="object-cover" sizes="144px" />
                <span className="absolute right-2 top-2 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-hagu-heading">
                  New
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-hagu-heading">{person.name}</p>
              <p className="text-[11px] text-hagu-text-secondary">{person.role}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
