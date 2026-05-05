import * as React from "react"
import { cn } from "@/lib/utils"

type TagVariant = "default" | "accent" | "outlined"

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant
}

const variantClass: Record<TagVariant, string> = {
  default: "bg-black/[0.04] text-[#2D1012]",
  accent: "bg-[#D0F1F0] text-[#2D1012]",
  outlined: "border border-black/10 bg-[#FEFFFF] text-[#4a4a52]",
}

export function Tag({ className, variant = "default", ...props }: TagProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-[0.01em]", variantClass[variant], className)}
      {...props}
    />
  )
}
