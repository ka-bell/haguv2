import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type ScreenFooterProps = {
  children: ReactNode
  className?: string
  innerClassName?: string
  /** Pin to viewport bottom (flow screens). Set false inside bottom sheets. */
  pinned?: boolean
}

/** Pinned bottom action zone — fixed so safe-area changes don't shift the CTA. */
export function ScreenFooter({ children, className, innerClassName, pinned = true }: ScreenFooterProps) {
  return (
    <div
      className={cn(
        pinned
          ? "hagu-screen-footer fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md shrink-0 border-t border-black/[0.06] bg-[#FCFFFF] px-4"
          : "shrink-0 border-t border-black/[0.06] bg-[#FCFFFF] px-4 pt-4",
        !pinned && "pb-[var(--hagu-inset-bottom)]",
        className,
      )}
    >
      <div className={cn("mx-auto flex w-full max-w-[340px] flex-col gap-3", innerClassName)}>
        {children}
      </div>
    </div>
  )
}

/** Primary flow CTA button — always h-16 to match across screens. */
export function ScreenPrimaryButton({
  children,
  onClick,
  disabled,
  className,
  type = "button",
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: "button" | "submit"
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-16 w-full items-center justify-center rounded-[32px] bg-[#2D1012] text-base font-semibold tracking-tight text-white shadow-[0px_20px_40px_-10px_rgba(45,16,18,0.1)] transition enabled:hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
    >
      {children}
    </button>
  )
}

/** Secondary outline button for auth footers. */
export function ScreenSecondaryButton({
  children,
  onClick,
  disabled,
  className,
  type = "button",
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: "button" | "submit"
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-16 w-full items-center justify-center rounded-[32px] border border-black/10 bg-[#FCFFFF] text-base font-medium text-[#2D1012] transition enabled:hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
    >
      {children}
    </button>
  )
}

/** Reserve scroll space when a fixed ScreenFooter is shown. */
export const SCREEN_FOOTER_SCROLL_PAD = "pb-[var(--hagu-cta-footer-height)]" as const
