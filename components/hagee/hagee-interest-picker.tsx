"use client"

import { cn } from "@/lib/utils"

const selectedClass = "border-hagu-accent-strong bg-hagu-accent-selected text-hagu-accent-strong"
const unselectedClass = "border-hagu-border bg-hagu-white text-hagu-label"

interface HageeInterestPickerProps {
  categories: { id: string; label: string; options: string[] }[]
  selected: string[]
  onToggle: (value: string) => void
  minCount?: number
}

export function HageeInterestPicker({
  categories,
  selected,
  onToggle,
  minCount = 3,
}: HageeInterestPickerProps) {
  const hasEnough = selected.length >= minCount

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.id}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.4px] text-hagu-placeholder">
            {category.label}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {category.options.map((option) => {
              const isSelected = selected.includes(option)
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onToggle(option)}
                  className={cn(
                    "rounded-full border px-[17px] py-2.5 text-[13px] transition",
                    isSelected ? selectedClass : unselectedClass,
                  )}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between text-[13px]">
        <span className="text-hagu-text-secondary">{selected.length} selected</span>
        {hasEnough ? (
          <span className="font-medium text-hagu-accent-strong">Good mix ✓</span>
        ) : (
          <span className="text-hagu-placeholder">Pick at least {minCount}</span>
        )}
      </div>
    </div>
  )
}
