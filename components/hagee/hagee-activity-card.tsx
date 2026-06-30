"use client"

import type { LucideIcon } from "lucide-react"
import { Check, ChevronRight } from "lucide-react"
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
        "flex min-h-[114px] flex-col rounded-[20px] border p-4 text-left transition",
        isNav
          ? "border-hagu-border bg-hagu-white"
          : selected
            ? "border-2 border-hagu-accent-strong bg-hagu-accent-soft"
            : "border border-hagu-border bg-hagu-white",
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
          <span
            className={cn(
              "flex size-[22px] shrink-0 items-center justify-center rounded-full border",
              selected
                ? "border-hagu-accent-strong bg-hagu-accent-strong"
                : "border-hagu-border bg-transparent",
            )}
          >
            {selected ? <Check className="size-2.5 text-white" strokeWidth={3} /> : null}
          </span>
        ) : null}
      </div>
      <p className="mt-2.5 text-[13px] font-medium text-hagu-ink">{label}</p>
      <p className="mt-0.5 text-[11px] text-hagu-text-secondary">{subtitle}</p>
    </button>
  )
}
