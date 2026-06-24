"use client"

import { useCallback, useRef, useState } from "react"
import { Heart, RotateCcw, X } from "lucide-react"
import { HageeExploreCard } from "@/components/hagee/hagee-explore-card"
import type { HageeExploreMatch } from "@/lib/hagee-explore"
import { cn } from "@/lib/utils"

const SWIPE_THRESHOLD = 80
const EXIT_MS = 280

type ExitDirection = "left" | "right" | null

interface HageeExploreSwipeStackProps {
  matches: HageeExploreMatch[]
  onPass?: (match: HageeExploreMatch) => void
  onSave?: (match: HageeExploreMatch) => void
  onViewProfile?: (match: HageeExploreMatch) => void
  onDeckEmpty?: () => void
}

export function HageeExploreSwipeStack({
  matches,
  onPass,
  onSave,
  onViewProfile,
  onDeckEmpty,
}: HageeExploreSwipeStackProps) {
  const [deck, setDeck] = useState(matches)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [exitDirection, setExitDirection] = useState<ExitDirection>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const startXRef = useRef(0)
  const draggingRef = useRef(false)
  const dragXRef = useRef(0)

  const current = deck[0]
  const next = deck[1]
  const total = matches.length
  const seen = total - deck.length

  const resetDrag = () => {
    setDragX(0)
    dragXRef.current = 0
  }

  const commitDecision = useCallback(
    (direction: "left" | "right") => {
      if (!current || isAnimating) return

      setIsAnimating(true)
      setExitDirection(direction)
      resetDrag()
      draggingRef.current = false
      setDragging(false)

      if (direction === "left") {
        onPass?.(current)
      } else {
        onSave?.(current)
      }

      window.setTimeout(() => {
        setDeck((prev) => {
          const remaining = prev.slice(1)
          if (remaining.length === 0) {
            onDeckEmpty?.()
          }
          return remaining
        })
        setExitDirection(null)
        setIsAnimating(false)
      }, EXIT_MS)
    },
    [current, isAnimating, onDeckEmpty, onPass, onSave],
  )

  const handlePointerUp = () => {
    if (!draggingRef.current || isAnimating) return
    draggingRef.current = false
    setDragging(false)

    const offset = dragXRef.current

    if (offset < -SWIPE_THRESHOLD) {
      commitDecision("left")
      return
    }
    if (offset > SWIPE_THRESHOLD) {
      commitDecision("right")
      return
    }
    resetDrag()
  }

  const swipeHint =
    exitDirection === "left"
      ? "pass"
      : exitDirection === "right"
        ? "save"
        : dragX < -12
          ? "pass"
          : dragX > 12
            ? "save"
            : null
  const swipeProgress = exitDirection ? 1 : Math.min(Math.abs(dragX) / 100, 1)

  const cardTransform = (() => {
    if (exitDirection === "left") {
      return "translateX(-130%) rotate(-18deg)"
    }
    if (exitDirection === "right") {
      return "translateX(130%) rotate(18deg)"
    }
    return `translateX(${dragX}px) rotate(${dragX * 0.04}deg)`
  })()

  if (!current) {
    return (
      <div className="flex min-h-[min(68vh,560px)] flex-col items-center justify-center gap-4 rounded-[28px] border border-hagu-border bg-hagu-white px-8 py-12 text-center shadow-[0px_4px_16px_rgba(26,26,30,0.06)]">
        <p className="text-lg font-semibold text-hagu-heading">Je hebt iedereen gezien</p>
        <p className="text-sm text-hagu-text-secondary">
          Kom later terug voor nieuwe companions, of pas je voorkeuren aan.
        </p>
        <button
          type="button"
          onClick={() => setDeck(matches)}
          className="mt-2 flex items-center gap-2 rounded-full border border-hagu-border bg-hagu-canvas px-5 py-2.5 text-sm font-medium text-hagu-heading"
        >
          <RotateCcw className="size-4" />
          Opnieuw bekijken
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <p className="text-center text-xs text-hagu-text-secondary">
        {seen + 1} van {total} · swipe links om over te slaan, rechts om te bewaren
      </p>

      <div
        className={cn(
          "relative touch-pan-y select-none",
          isAnimating && "pointer-events-none",
        )}
        onPointerDown={(event) => {
          if (isAnimating) return
          startXRef.current = event.clientX
          draggingRef.current = true
          setDragging(true)
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (!draggingRef.current || isAnimating) return
          const offset = event.clientX - startXRef.current
          dragXRef.current = offset
          setDragX(offset)
        }}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {next ? (
          <div className="absolute inset-y-3 right-0 z-0 w-[92%] translate-x-3 scale-[0.96] opacity-70">
            <HageeExploreCard match={next} className="pointer-events-none h-full" />
          </div>
        ) : null}

        <div
          className={cn(
            "relative z-10",
            dragging || exitDirection ? "transition-none" : "transition-transform duration-300 ease-out",
            exitDirection && "transition-transform duration-[280ms] ease-in",
          )}
          style={{ transform: cardTransform }}
        >
          <HageeExploreCard
            match={current}
            swipeHint={swipeHint}
            swipeProgress={swipeProgress}
            onViewProfile={() => onViewProfile?.(current)}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button
          type="button"
          aria-label="Overslaan"
          disabled={isAnimating}
          onClick={() => commitDecision("left")}
          className="flex size-14 items-center justify-center rounded-full border border-hagu-border bg-hagu-white text-hagu-text-secondary shadow-[0px_4px_16px_rgba(26,26,30,0.08)] transition active:scale-95 disabled:opacity-50"
        >
          <X className="size-6" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          aria-label="Bewaren"
          disabled={isAnimating}
          onClick={() => commitDecision("right")}
          className="flex size-16 items-center justify-center rounded-full border border-[rgba(91,191,181,0.3)] bg-hagu-accent-selected text-hagu-accent-strong shadow-[0px_4px_16px_rgba(91,191,181,0.2)] transition active:scale-95 disabled:opacity-50"
        >
          <Heart className="size-7 fill-current" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
