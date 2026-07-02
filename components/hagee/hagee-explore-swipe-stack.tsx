"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Heart, RotateCcw, X } from "lucide-react"
import { HageeExploreCard } from "@/components/hagee/hagee-explore-card"
import type { HageeExploreMatch } from "@/lib/hagee-explore"
import { cn } from "@/lib/utils"

const SWIPE_THRESHOLD = 80
const EXIT_MS = 280

type ExitDirection = "left" | "right" | null

interface HageeExploreSwipeStackProps {
  matches: HageeExploreMatch[]
  className?: string
  getSharedInterests?: (match: HageeExploreMatch) => string[]
  onPass?: (match: HageeExploreMatch) => void
  onSave?: (match: HageeExploreMatch) => void
  onViewProfile?: (match: HageeExploreMatch) => void
  onDeckEmpty?: () => void
}

export function HageeExploreSwipeStack({
  matches,
  className,
  getSharedInterests,
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

  useEffect(() => {
    setDeck(matches)
    setDragX(0)
    dragXRef.current = 0
    setDragging(false)
    draggingRef.current = false
    setExitDirection(null)
    setIsAnimating(false)
  }, [matches])

  const current = deck[0]
  const next = deck[1]

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
  const peekProgress = exitDirection ? 1 : Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1)

  const cardTransform = (() => {
    if (exitDirection === "left") {
      return "translateX(-130%) rotate(-12deg)"
    }
    if (exitDirection === "right") {
      return "translateX(130%) rotate(12deg)"
    }
    return `translateX(${dragX}px)`
  })()

  if (!current) {
    return (
      <div className="flex min-h-[min(68vh,560px)] flex-col items-center justify-center gap-4 hagu-surface-card px-8 py-12 text-center">
        <p className="text-[15px] font-medium text-hagu-ink">Je hebt iedereen gezien</p>
        <p className="text-sm text-hagu-text-secondary">
          Kom later terug voor nieuwe companions, of pas je voorkeuren aan.
        </p>
        <button
          type="button"
          onClick={() => setDeck(matches)}
          className="mt-2 flex h-9 items-center gap-2 rounded-[10px] bg-hagu-surface-muted px-4 text-xs font-medium text-hagu-ink"
        >
          <RotateCcw className="size-4" />
          Opnieuw bekijken
        </button>
      </div>
    )
  }

  return (
    <div className={cn("min-h-0 flex-1", className)}>
      <div
        className={cn(
          "relative h-full touch-none overflow-hidden overscroll-contain select-none rounded-[20px]",
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
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              transform: `scale(${0.96 + peekProgress * 0.04})`,
              opacity: 0.72 + peekProgress * 0.28,
              transformOrigin: "bottom center",
              transition: dragging ? "none" : "transform 280ms ease-out, opacity 280ms ease-out",
            }}
          >
            <HageeExploreCard match={next} className="h-full" />
          </div>
        ) : null}

        <div
          className={cn(
            "relative z-10 h-full will-change-transform",
            dragging ? "transition-none" : exitDirection ? "transition-transform duration-[280ms] ease-in" : "",
          )}
          style={{ transform: cardTransform, transformOrigin: "bottom center" }}
        >
          <HageeExploreCard
            match={current}
            sharedInterests={getSharedInterests?.(current) ?? []}
            swipeHint={swipeHint}
            swipeProgress={swipeProgress}
            showActions
            actionsDisabled={isAnimating}
            onSkip={() => commitDecision("left")}
            onSave={() => commitDecision("right")}
            onViewProfile={() => onViewProfile?.(current)}
          />
        </div>
      </div>
    </div>
  )
}
