"use client"

import type { LucideIcon } from "lucide-react"
import { Check, ChevronRight } from "lucide-react"
import { selectionCardClass, selectionCheckIndicatorClass } from "@/lib/hagu-selection-styles"
import { cn } from "@/lib/utils"

interface HageeActivityCardProps {
  icon: LucideIcon
  label: string
  subtitle: string
  onClick: () => void
  className?: string
  variant?: "selectable" | "nav"
  selected?: boolean
}

export function HageeActivityCard({
  icon: Icon,
  label,
  subtitle,
  onClick,
  className,
  variant = "selectable",
  selected = false,
}: HageeActivityCardProps) {
  const isNav = variant === "nav"

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isNav ? undefined : selected}
      className={cn(
        "flex min-h-[114px] w-full min-w-0 flex-col rounded-[20px] border p-4 text-left transition",
        isNav
          ? "border border-hagu-border bg-hagu-white"
          : selectionCardClass(selected),
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-[10px]",
            isNav || !selected ? "bg-hagu-surface-muted" : "bg-hagu-white/80",
          )}
        >
          <Icon className="size-[18px] text-hagu-label" />
        </div>
        {isNav ? <ChevronRight className="size-4 shrink-0 text-hagu-placeholder" /> : null}
        {!isNav ? (
          <span className={selectionCheckIndicatorClass(selected)}>
            {selected ? <Check className="size-2.5 text-white" strokeWidth={3} /> : null}
          </span>
        ) : null}
      </div>
      <p className="mt-2.5 text-[13px] font-medium text-hagu-ink">{label}</p>
      <p className="mt-0.5 text-[11px] leading-snug text-hagu-text-secondary">{subtitle}</p>
    </button>
  )
}
