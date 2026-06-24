"use client"

import { cn } from "@/lib/utils"
import { PageFixedHeader } from "@/components/ui/page-shell"
import { HaguFlowCta } from "@/components/hagu/hagu-flow-cta"
import { HageeFlowHeader } from "./hagee-flow-header"

/** Back pill + progress bar under safe area. */
export const HAGEE_FLOW_HEADER_OFFSET = "pt-[calc(3.5rem+4.75rem)]" as const

interface HageeFlowScreenProps {
  children: React.ReactNode
  onBack?: () => void
  progress?: number
  ctaLabel: string
  onCta: () => void
  ctaDisabled?: boolean
  footer?: React.ReactNode
  className?: string
}

export function HageeFlowScreen({
  children,
  onBack,
  progress,
  ctaLabel,
  onCta,
  ctaDisabled,
  footer,
  className,
}: HageeFlowScreenProps) {
  const hasHeader = Boolean(onBack)

  return (
    <main
      className={cn(
        "mx-auto flex min-h-dvh w-full max-w-md flex-col bg-hagu-canvas text-hagu-ink",
        className,
      )}
    >
      {hasHeader ? (
        <PageFixedHeader className="px-7">
          <HageeFlowHeader onBack={onBack!} progress={progress} />
        </PageFixedHeader>
      ) : null}

      <div
        className={cn(
          "flex flex-1 flex-col overflow-y-auto px-7 pb-6",
          hasHeader && HAGEE_FLOW_HEADER_OFFSET,
        )}
      >
        <div className="flex-1">{children}</div>
        {footer}
      </div>

      <HaguFlowCta label={ctaLabel} onClick={onCta} disabled={ctaDisabled} />
    </main>
  )
}
