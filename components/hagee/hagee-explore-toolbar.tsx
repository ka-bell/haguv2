"use client"

import Link from "next/link"
import { Heart, SlidersHorizontal } from "lucide-react"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

type HageeExploreToolbarProps = {
  savedCount: number
  className?: string
}

const iconButtonClassName =
  "pointer-events-auto flex size-9 items-center justify-center rounded-[10px] bg-hagu-surface-muted text-hagu-ink transition"

export function HageeExploreToolbar({ savedCount, className }: HageeExploreToolbarProps) {
  return (
    <div className={cn("flex shrink-0 items-center justify-end gap-2", className)}>
      <Link href={ROUTES.exploreRefine} aria-label="Edit filters" className={iconButtonClassName}>
        <SlidersHorizontal className="size-[17px]" strokeWidth={2} />
      </Link>

      <Link
        href={`${ROUTES.chat}?tab=liked`}
        aria-label={`Saved profiles${savedCount > 0 ? `, ${savedCount}` : ""}`}
        className={cn(iconButtonClassName, "relative")}
      >
        <Heart className="size-[17px]" strokeWidth={2} />
        {savedCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex size-[18px] items-center justify-center rounded-full bg-hagu-accent-strong text-[9px] font-bold text-white">
            {savedCount > 9 ? "9+" : savedCount}
          </span>
        ) : null}
      </Link>
    </div>
  )
}
