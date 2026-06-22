"use client"

import { cn } from "@/lib/utils"

type HaguToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export function HaguToggle({ checked, onChange, label }: HaguToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        checked ? "bg-[#5BBFB5]" : "bg-black/10",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-5 rounded-[10px] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1)] transition-transform",
          checked ? "right-0.5" : "left-0.5",
        )}
      />
    </button>
  )
}
