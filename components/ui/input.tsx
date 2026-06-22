"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type = "text", label, ...props }, ref) => {
  const field = (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-[50px] w-full rounded-[20px] border border-black/[0.06] bg-white px-[17px] text-[15px] text-[#1A1A1E] outline-none transition",
        "placeholder:text-[#8A8A96] focus:border-[#D0F1F0] focus:ring-2 focus:ring-[#D0F1F0]/50",
        className,
      )}
      {...props}
    />
  )

  if (!label) return field

  return (
    <label className="flex w-full flex-col gap-1.5">
      <span className="text-xs text-[#4A4A52]">{label}</span>
      {field}
    </label>
  )
})

Input.displayName = "Input"

export { Input }
