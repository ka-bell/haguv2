"use client"

import type { ReactNode } from "react"
import { ScreenFooter } from "@/components/ui/screen-footer"
import { cn } from "@/lib/utils"

export type FlowProgressSegments = {
  active: number
  total: number
}

type HageeFlowProgressFooterProps = {
  label: ReactNode
  onClick?: () => void
  disabled?: boolean
  segments: FlowProgressSegments
  secondaryAction?: { label: string; onClick: () => void }
  className?: string
}

/** Combined progress dashes + CTA in one light pinned footer. */
export function HageeFlowProgressFooter({
  label,
  onClick,
  disabled,
  segments,
  secondaryAction,
  className,
}: HageeFlowProgressFooterProps) {
  const active = Math.min(Math.max(segments.active, 0), segments.total)

  return (
    <ScreenFooter className={cn(
      "hagu-screen-footer-progress border-black/[0.05] bg-hagu-canvas/95 backdrop-blur-sm",
      secondaryAction && "hagu-screen-footer-progress-tall",
      className,
    )}>
      <div className="flex gap-1.5" aria-hidden>
        {Array.from({ length: segments.total }, (_, index) => (
          <span
            key={index}
            className={cn(
              "h-[3px] flex-1 rounded-full transition-colors duration-300",
              index < active ? "bg-hagu-heading" : "bg-hagu-border",
            )}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="mt-3 hagu-btn-primary"
      >
        {label}
      </button>

      {secondaryAction ? (
        <button
          type="button"
          onClick={secondaryAction.onClick}
          className="mt-2.5 w-full py-1 text-center text-[13px] font-medium text-hagu-text-secondary transition enabled:active:opacity-70"
        >
          {secondaryAction.label}
        </button>
      ) : null}
    </ScreenFooter>
  )
}
