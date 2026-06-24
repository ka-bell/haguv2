"use client"

import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface HageeRefineHeaderProps {
  step: number
  totalSteps?: number
  onBack: () => void
  onSkip?: () => void
  showBack?: boolean
  showSkip?: boolean
  className?: string
}

export function HageeRefineHeader({
  step,
  totalSteps = 3,
  onBack,
  onSkip,
  showBack = true,
  showSkip = true,
  className,
}: HageeRefineHeaderProps) {
  const progress = (step / totalSteps) * 100

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="flex size-9 items-center justify-center rounded-[18px] border border-hagu-border bg-hagu-white shadow-[0px_1px_2px_rgba(0,0,0,0.06)]"
          >
            <ChevronLeft className="size-4 text-hagu-heading" />
          </button>
        ) : (
          <span className="size-9" />
        )}
        <span className="text-xs font-medium text-hagu-text-secondary">
          {step} of {totalSteps}
        </span>
        {showSkip && onSkip ? (
          <button type="button" onClick={onSkip} className="px-1 text-[13px] text-hagu-text-secondary">
            Skip
          </button>
        ) : (
          <span className="w-9" />
        )}
      </div>
      <div className="h-[3px] w-full rounded-full bg-hagu-border">
        <div
          className="h-[3px] rounded-full bg-hagu-accent-strong transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
