"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

type HaguStarRatingProps = {
  value: number
  onChange: (value: number) => void
  size?: "sm" | "lg"
  className?: string
}

export function HaguStarRating({ value, onChange, size = "lg", className }: HaguStarRatingProps) {
  const starClass = size === "lg" ? "size-6" : "size-3.5"

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition active:scale-95"
            aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
          >
            <Star
              className={cn(
                starClass,
                filled ? "fill-[#F5A623] text-[#F5A623]" : "fill-transparent text-[#D8D8DE]",
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
