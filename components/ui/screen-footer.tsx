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
          ? "hagu-screen-footer fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 shrink-0 border-t border-black/[0.06] bg-[#FCFFFF] px-4"
          : "shrink-0 border-t border-black/[0.06] bg-[#FCFFFF] px-4 pt-4",
        !pinned && "pb-[var(--hagu-inset-bottom)]",
        className,
      )}
    >
      <div className={cn("mx-auto flex w-full max-w-[340px] flex-col gap-2.5", innerClassName)}>
        {children}
      </div>
    </div>
  )
}

type ScreenButtonProps = {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: "button" | "submit"
}

/** Primary CTA — black, rounded-[20px], h-12. */
export function ScreenPrimaryButton({ children, onClick, disabled, className, type = "button" }: ScreenButtonProps) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cn("hagu-btn-primary", className)}>
      {children}
    </button>
  )
}

/** Secondary outline CTA. */
export function ScreenSecondaryButton({ children, onClick, disabled, className, type = "button" }: ScreenButtonProps) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cn("hagu-btn-secondary", className)}>
      {children}
    </button>
  )
}

/** Destructive outline CTA (cancel, delete). */
export function ScreenDestructiveButton({ children, onClick, disabled, className, type = "button" }: ScreenButtonProps) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cn("hagu-btn-destructive", className)}>
      {children}
    </button>
  )
}

/** Reserve scroll space when a fixed ScreenFooter is shown. */
export const SCREEN_FOOTER_SCROLL_PAD = "pb-[var(--hagu-cta-footer-height)]" as const

/** Smaller pad for compact flow CTAs (hagu-action-btn style). */
export const SCREEN_FOOTER_SCROLL_PAD_COMPACT =
  "pb-[calc(3.25rem+var(--hagu-inset-bottom))]" as const

/** Pad for combined progress + CTA footer (HAGEE onboarding). */
export const SCREEN_FOOTER_SCROLL_PAD_PROGRESS =
  "pb-[calc(4.5rem+var(--hagu-inset-bottom))]" as const

/** Progress footer with secondary action (e.g. Skip). */
export const SCREEN_FOOTER_SCROLL_PAD_PROGRESS_TALL =
  "pb-[calc(5.75rem+var(--hagu-inset-bottom))]" as const

/** Stacked footer with up to 3 actions (booking detail). */
export const SCREEN_FOOTER_SCROLL_PAD_TALL =
  "pb-[calc(10.5rem+var(--hagu-inset-bottom))]" as const
