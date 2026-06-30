import Link from "next/link"
import { ChevronRight, Search } from "lucide-react"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

type HageeRefineBannerProps = {
  className?: string
}

export function HageeRefineBanner({ className }: HageeRefineBannerProps) {
  return (
    <Link
      href={ROUTES.exploreRefine}
      className={cn(
        "flex items-center gap-3.5 rounded-[20px] border border-hagu-glass-border bg-hagu-accent-selected px-5 py-4 transition",
        className,
      )}
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-hagu-accent-soft">
        <Search className="size-5 text-hagu-accent-strong" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-hagu-ink">Refine your matches</p>
        <p className="text-xs leading-relaxed text-hagu-text-secondary">
          Answer a few quick questions to improve suggestions.
        </p>
      </div>
      <ChevronRight className="size-4 shrink-0 text-hagu-text-secondary" />
    </Link>
  )
}
