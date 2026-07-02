"use client"

import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface HageeFlowHeaderProps {
  onBack?: () => void
  className?: string
}

/** HAGEE onboarding chrome — back pill (progress renders in flow body). */
export function HageeFlowHeader({ onBack, className }: HageeFlowHeaderProps) {
  return (
    <div className={cn(className)}>
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="pointer-events-auto flex size-9 items-center justify-center rounded-[18px] border border-hagu-border bg-hagu-white shadow-[0px_1px_2px_rgba(0,0,0,0.06)]"
        >
          <ChevronLeft className="size-4 text-hagu-heading" />
        </button>
      ) : (
        <div className="size-9" aria-hidden />
      )}
    </div>
  )
}
