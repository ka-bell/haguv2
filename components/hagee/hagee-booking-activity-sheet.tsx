"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { Check, ChevronRight, X } from "lucide-react"
import { bookingCardClass } from "@/components/hagee/hagee-booking-chrome"
import { HaguFlowCta } from "@/components/hagu/hagu-flow-cta"
import { BOOKING_ACTIVITIES } from "@/lib/hagee-booking"
import type { HageeCompanionProfile } from "@/lib/hagee-companion-profiles"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

type HageeBookingActivitySheetProps = {
  open: boolean
  onClose: () => void
  profile: HageeCompanionProfile
}

const DISMISS_DRAG = 72
const SHEET_EASE = "cubic-bezier(0.32, 0.72, 0, 1)"

export function HageeBookingActivitySheet({ open, onClose, profile }: HageeBookingActivitySheetProps) {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const dragStartY = useRef(0)
  const dragYRef = useRef(0)

  const selected = BOOKING_ACTIVITIES.find((item) => item.id === selectedId) ?? null

  const dismiss = useCallback(() => {
    setVisible(false)
    setDragY(0)
    setDragging(false)
    window.setTimeout(() => {
      onClose()
      setMounted(false)
    }, 300)
  }, [onClose])

  useEffect(() => {
    if (open) {
      setMounted(true)
      setDragY(0)
      document.body.style.overflow = "hidden"
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
      return () => cancelAnimationFrame(frame)
    }

    if (mounted) {
      setVisible(false)
      const timer = window.setTimeout(() => {
        setMounted(false)
        setDragY(0)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [open, mounted])

  useEffect(() => {
    if (!mounted) document.body.style.overflow = ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mounted])

  const handleContinue = () => {
    if (!selected) return
    dismiss()
    router.push(ROUTES.exploreBook(profile.id, selected.serviceId))
  }

  if (!mounted) return null

  const sheetTransform = visible ? `translateY(${dragY}px)` : "translateY(100%)"

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center" role="presentation">
      <button
        type="button"
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundColor: `rgba(26, 26, 30, ${visible ? Math.max(0.2, 0.55 - dragY / 500) : 0})`,
          opacity: visible ? 1 : 0,
        }}
        onClick={dismiss}
        aria-label="Close sheet"
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 flex max-h-[min(72dvh,640px)] w-full max-w-md flex-col rounded-t-[28px] border border-hagu-border bg-hagu-canvas shadow-[0px_-12px_48px_rgba(26,26,30,0.16)]"
        style={{
          transform: sheetTransform,
          transition: dragging ? "none" : `transform 300ms ${SHEET_EASE}`,
        }}
      >
        <div className="shrink-0 px-6 pb-2 pt-3">
          <div className="mx-auto h-1 w-10 rounded-full bg-black/15" aria-hidden="true" />
        </div>

        <div className="flex shrink-0 items-start justify-between gap-3 px-6">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-hagu-accent-strong">01 — What kind of time?</p>
            <h2 className="mt-1 hagu-page-title">Request time with {profile.name}</h2>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-hagu-glass-border bg-white/80 text-hagu-ink backdrop-blur-[20px]"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="relative size-11 shrink-0 overflow-hidden rounded-[20px] border-2 border-white">
              <Image src={profile.photo} alt="" fill className="object-cover" sizes="44px" />
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-medium text-hagu-ink">{profile.name}</p>
              <p className="flex items-center gap-1.5 text-[13px] text-hagu-text-secondary">
                <span className="size-1.5 rounded-full bg-hagu-accent-strong" />
                {profile.availabilityLabel}
              </p>
            </div>
          </div>

          <p className="hagu-section-label mb-3">What kind of time are you looking for?</p>

          <div className="space-y-2.5">
            {BOOKING_ACTIVITIES.map((activity) => {
              const isSelected = selectedId === activity.id
              return (
                <button
                  key={activity.id}
                  type="button"
                  onClick={() => setSelectedId(activity.id)}
                  className={cn(bookingCardClass(isSelected), "flex w-full items-center gap-3 px-4 py-3.5")}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-hagu-surface-muted text-lg">
                    {activity.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium text-hagu-ink">{activity.label}</span>
                    <span className="block text-[13px] text-hagu-text-secondary">{activity.subtitle}</span>
                  </span>
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border",
                      isSelected ? "border-hagu-accent-strong bg-hagu-accent-strong" : "border-hagu-border",
                    )}
                  >
                    {isSelected ? <Check className="size-2.5 text-white" strokeWidth={3} /> : null}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <HaguFlowCta
          pinned={false}
          className="shrink-0 border-t border-hagu-border bg-hagu-canvas px-2"
          label={
            <span className="inline-flex items-center gap-2">
              Continue
              <ChevronRight className="size-4" />
            </span>
          }
          onClick={handleContinue}
          disabled={!selected}
        />
      </div>
    </div>
  )
}
