"use client"

import { cn } from "@/lib/utils"
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
      <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-6 pt-14">
        {showHeader ? <HaguFlowHeader onBack={onBack} closeHref={closeHref} /> : null}
        {typeof progress === "number" ? (
          <div className="mt-4 h-[3px] w-full rounded-full bg-black/[0.07]">
            <div
              className="h-[3px] rounded-full bg-[#1A1A1E] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : null}
        <div className="mt-5 flex-1">{children}</div>
        {footer}
      </div>
      <HaguFlowCta label={ctaLabel} onClick={onCta} disabled={ctaDisabled} />
    </main>
  )
}
