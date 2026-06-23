"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type HaguPrototypeSheetProps = {
  open: boolean
  onClose: () => void
  title: string
  figmaLabel: string
  children: React.ReactNode
  className?: string
}

const DISMISS_DRAG = 72
const SHEET_EASE = "cubic-bezier(0.32, 0.72, 0, 1)"

export function HaguPrototypeSheet({
  open,
  onClose,
  title,
  figmaLabel,
  children,
  className,
}: HaguPrototypeSheetProps) {
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const dragStartY = useRef(0)
  const dragYRef = useRef(0)

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

  const startDrag = useCallback((clientY: number) => {
    dragStartY.current = clientY
    setDragging(true)
  }, [])

  const moveDrag = useCallback(
    (clientY: number) => {
      if (!dragging) return
      const next = Math.max(0, clientY - dragStartY.current)
      dragYRef.current = next
      setDragY(next)
    },
    [dragging],
  )

  const endDrag = useCallback(() => {
    if (!dragging) return
    setDragging(false)
    if (dragYRef.current >= DISMISS_DRAG) {
      dismiss()
      return
    }
    dragYRef.current = 0
    setDragY(0)
  }, [dragging, dismiss])

  useEffect(() => {
    if (!dragging) return
    const onMouseMove = (e: MouseEvent) => moveDrag(e.clientY)
    const onMouseUp = () => endDrag()
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [dragging, moveDrag, endDrag])

  if (!mounted) return null

  const sheetTransform = visible ? `translateY(${dragY}px)` : "translateY(100%)"

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center" role="presentation">
      <button
        type="button"
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundColor: `rgba(26, 26, 30, ${visible ? Math.max(0.12, 0.4 - dragY / 500) : 0})`,
          opacity: visible ? 1 : 0,
        }}
        onClick={dismiss}
        aria-label="Close sheet"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hagu-sheet-title"
        className={cn(
          "relative z-10 flex max-h-[min(88dvh,720px)] w-full max-w-md flex-col rounded-t-[28px] border border-black/[0.06] bg-[#FCFFFF] shadow-[0px_-12px_48px_rgba(26,26,30,0.16)]",
          className,
        )}
        style={{
          transform: sheetTransform,
          transition: dragging ? "none" : `transform 300ms ${SHEET_EASE}`,
        }}
      >
        <div
          className="shrink-0 touch-none px-6 pb-2 pt-3"
          onMouseDown={(e) => startDrag(e.clientY)}
          onTouchStart={(e) => startDrag(e.touches[0].clientY)}
          onTouchMove={(e) => moveDrag(e.touches[0].clientY)}
          onTouchEnd={endDrag}
        >
          <div className="mx-auto h-1 w-10 rounded-full bg-black/15" aria-hidden="true" />
        </div>

        <div className="flex shrink-0 items-start justify-between gap-3 px-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#5BBFB5]">{figmaLabel}</p>
            <h2 id="hagu-sheet-title" className="mt-1 text-lg font-semibold text-[#1A1A1E]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F7F6F3] text-[#1A1A1E]"
            aria-label="Close sheet"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
          {children}
        </div>
      </div>
    </div>
  )
}
