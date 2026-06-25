"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SegmentedOption {
  value: string
  label: string
}

interface SegmentedPillGroupProps {
  options: SegmentedOption[]
  value: string[]
  onChange?: (value: string[]) => void
  multiSelect?: boolean
  size?: "default" | "sm"
  className?: string
}

export function SegmentedPillGroup({
  options,
  value,
  onChange,
  multiSelect = true,
  size = "default",
  className,
}: SegmentedPillGroupProps) {
  const toggle = (option: string) => {
    if (!onChange) return

    if (multiSelect) {
      onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option])
      return
    }

    onChange([option])
  }

  return (
    <div className={cn("flex flex-wrap gap-2", size === "sm" && "gap-1.5", className)}>
      {options.map((option) => {
        const isActive = value.includes(option.value)
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => toggle(option.value)}
            className={cn(
              "rounded-full font-medium transition",
              size === "sm" ? "h-9 px-3.5 text-[12px]" : "h-11 px-5 text-[13px]",
              isActive ? "bg-[#1A1A1E] text-white" : "border border-black/[0.08] bg-white text-[#4A4A52] hover:bg-black/[0.03]",
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
