"use client"

import { cn } from "@/lib/utils"
import { PAGE_FIXED_HEADER_OFFSET, PageFixedHeader } from "@/components/ui/page-shell"
import { HaguFlowCta } from "./hagu-flow-cta"
import { HaguFlowHeader } from "./hagu-flow-header"

interface HaguFlowScreenProps {
  children: React.ReactNode
  onBack?: () => void
  closeHref?: string | null
  showHeader?: boolean
  progress?: number
  ctaLabel: string
  onCta: () => void
  ctaDisabled?: boolean
  footer?: React.ReactNode
  className?: string
}

export function HaguFlowScreen({
  children,
  onBack,
  closeHref,
  showHeader = true,
  progress,
  ctaLabel,
  onCta,
  ctaDisabled,
  footer,
  className,
}: HaguFlowScreenProps) {
  return (
    <main
      className={cn(
        "mx-auto flex min-h-dvh w-full max-w-md flex-col bg-[#FCFFFF] text-[#2D1012]",
        className,
      )}
    >
      {showHeader ? (
        <PageFixedHeader>
          <HaguFlowHeader onBack={onBack} closeHref={closeHref} />
        </PageFixedHeader>
      ) : null}

      <div
        className={cn(
          "flex flex-1 flex-col overflow-y-auto px-6 pb-6",
          showHeader && PAGE_FIXED_HEADER_OFFSET,
        )}
      >
        {typeof progress === "number" ? (
          <div className="h-[3px] w-full rounded-full bg-black/[0.07]">
            <div
              className="h-[3px] rounded-full bg-[#1A1A1E] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : null}
        <div className={cn("flex-1", typeof progress === "number" ? "mt-5" : null)}>{children}</div>
        {footer}
      </div>
      <HaguFlowCta label={ctaLabel} onClick={onCta} disabled={ctaDisabled} />
    </main>
  )
}
