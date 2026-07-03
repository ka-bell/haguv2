"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type SelectOption = {
  value: string
  label: string
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string
  placeholder?: string
  options: readonly SelectOption[]
  onChange?: (value: string) => void
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, placeholder = "Select", options, value, onChange, ...props }, ref) => {
    const field = (
      <div className="relative">
        <select
          ref={ref}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            "flex h-[50px] w-full appearance-none rounded-[20px] border border-black/[0.06] bg-white px-[17px] pr-11 text-[15px] text-[#1A1A1E] outline-none transition",
            "focus:border-hagu-accent focus:ring-2 focus:ring-hagu-accent/50",
            !value && "text-[#8A8A96]",
            className,
          )}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#8A8A96]"
          aria-hidden
        />
      </div>
    )

    if (!label) return field

    return (
      <label className="flex w-full flex-col gap-1.5">
        <span className="text-xs text-[#4A4A52]">{label}</span>
        {field}
      </label>
    )
  },
)

Select.displayName = "Select"

export { Select }
