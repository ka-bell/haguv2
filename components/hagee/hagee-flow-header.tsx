"use client"

import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface HageeFlowHeaderProps {
  onBack: () => void
  progress?: number
  className?: string
}

/** HAGEE onboarding chrome — back pill + teal progress (Figma 2467:15352). */
export function HageeFlowHeader({ onBack, progress, className }: HageeFlowHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="flex size-9 items-center justify-center rounded-[18px] border border-hagu-border bg-hagu-white shadow-[0px_1px_2px_rgba(0,0,0,0.06)]"
      >
        <ChevronLeft className="size-4 text-hagu-heading" />
      </button>

      {typeof progress === "number" ? (
        <div className="h-[3px] w-full rounded-full bg-hagu-border">
          <div
            className="h-[3px] rounded-full bg-hagu-accent-strong transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}
    </div>
  )
}
