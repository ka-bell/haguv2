"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Clock, Star, Timer, Users } from "lucide-react"
import { HageeActivityCard } from "@/components/hagee/hagee-activity-card"
import {
  HAGEE_ACTIVE_BOOKING,
  HAGEE_DAILY_SPOTLIGHT,
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
  const spotlight = HAGEE_DAILY_SPOTLIGHT

  return (
    <div className="space-y-5 pb-4">
      <div>
        <p className="hagu-page-greeting">{timeGreeting()}</p>
        <h1 className="hagu-page-title">{HAGEE_CLIENT_NAME}</h1>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="hagu-section-label">Upcoming meetup</p>
          <span className="rounded-full bg-hagu-surface-muted px-2.5 py-1 text-[10px] font-medium text-hagu-label">
            {booking.status}
          </span>
        </div>

        <div className="hagu-surface-card px-5 pb-5 pt-4">
          <button
            type="button"
            onClick={() => router.push(ROUTES.exploreProfile(HAGEE_BOOKING_COMPANION_ID))}
            className="flex w-full items-center gap-3.5 text-left"
          >
            <div className="relative size-[52px] shrink-0 overflow-hidden rounded-[20px]">
              <Image src={booking.companionPhoto} alt="" fill className="object-cover" sizes="52px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium text-hagu-ink">{booking.title}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-hagu-text-secondary">
                <Clock className="size-3.5 shrink-0" />
                {booking.time}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-hagu-text-secondary">
                <Timer className="size-3.5 shrink-0" />
                {booking.duration}
              </p>
            </div>
          </button>

          <div className="mt-4 flex gap-2">
            <button type="button" className="hagu-action-btn-muted">
              View booking
            </button>
            <button
              type="button"
              onClick={() => router.push(ROUTES.chat)}
              className="hagu-action-btn-dark"
            >
              <Users className="size-3.5" />
              Connections
            </button>
          </div>
        </div>
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
        <p className="hagu-section-label">Daily spotlight</p>
        <button
          type="button"
          onClick={() => router.push(ROUTES.exploreProfile("sophie"))}
          className="hagu-surface-card w-full p-4 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-[20px]">
              <Image src={spotlight.photo} alt={spotlight.name} fill className="object-cover" sizes="80px" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[15px] font-medium text-hagu-ink">{spotlight.name}</h3>
                <span className="flex items-center gap-1 rounded-full bg-hagu-accent-selected px-2 py-0.5 text-[10px] font-semibold text-hagu-accent-strong">
                  <Star className="size-2.5 fill-current" />
                  {spotlight.rating.toFixed(1)}
                </span>
              </div>
              <p className="mt-0.5 text-[13px] text-hagu-text-secondary">{spotlight.role}</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {spotlight.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[10px] bg-hagu-surface-muted px-2 py-1 text-[10px] font-medium text-hagu-label"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </button>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="hagu-section-label">New arrivals</p>
          <Link href={ROUTES.explore} className="text-[13px] font-medium text-hagu-accent-strong">
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
