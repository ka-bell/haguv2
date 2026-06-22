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
}

export function SegmentedPillGroup({ options, value, onChange, multiSelect = true }: SegmentedPillGroupProps) {
  const toggle = (option: string) => {
    if (!onChange) return

    if (multiSelect) {
      onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option])
      return
    }

    onChange([option])
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = value.includes(option.value)
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => toggle(option.value)}
            className={cn(
              "h-11 rounded-full px-5 text-[13px] font-medium transition",
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
