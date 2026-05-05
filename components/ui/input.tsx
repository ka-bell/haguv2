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
        "flex h-12 w-full rounded-[20px] border border-black/10 bg-[#FEFFFF] px-4 text-[15px] text-[#2D1012] outline-none transition",
        "placeholder:text-[#8a8a96] focus:border-[#D0F1F0] focus:ring-2 focus:ring-[#D0F1F0]/50",
        className,
      )}
      {...props}
    />
  )

  if (!label) return field

  return (
    <label className="flex w-full flex-col gap-1.5">
      <span className="text-xs text-[#4a4a52]">{label}</span>
      {field}
    </label>
  )
})

Input.displayName = "Input"

export { Input }
