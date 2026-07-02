"use client"

import Image from "next/image"
import { Clock, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { PAGE_HEADER_TOP_PADDING } from "@/components/ui/page-shell"
import type { HageeBookingRequest } from "@/lib/hagee-booking-storage"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

type HageeChatLockedScreenProps = {
  request: HageeBookingRequest
}

export function HageeChatLockedScreen({ request }: HageeChatLockedScreenProps) {
  const router = useRouter()

  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-hagu-canvas">
      <header className={cn("shrink-0 border-b border-hagu-border bg-hagu-white px-5 pb-3", PAGE_HEADER_TOP_PADDING)}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(ROUTES.chat)}
            className="text-sm font-medium text-hagu-accent-strong"
          >
            Back
          </button>
          <div className="relative shrink-0">
            <div className="size-10 overflow-hidden rounded-full">
              <Image src={request.profilePhoto} alt="" width={40} height={40} className="size-full object-cover" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-hagu-heading">{request.profileName}</p>
            <p className="text-[11px] text-amber-600">Awaiting confirmation</p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-hagu-accent-soft">
          <Lock className="size-7 text-hagu-accent-strong" />
        </div>
        <h1 className="mt-5 hagu-page-title text-hagu-heading">Chat not open yet</h1>
        <p className="mt-2 max-w-[280px] text-sm font-light leading-relaxed text-hagu-text-secondary">
          Your request is with {request.profileName}. They may reach out before confirming — you can reply once they
          accept your booking.
        </p>

        <article className="mt-6 w-full hagu-surface-card p-4 text-left">
          <div className="flex items-center gap-2 text-xs text-hagu-text-secondary">
            <Clock className="size-3.5" />
            Usually responds within 24 hours
          </div>
          <div className="mt-3 space-y-1.5 text-sm text-hagu-label">
            <p>· {request.serviceLabel}</p>
            {request.dateLabel ? (
              <p>
                · {request.dateLabel}
                {request.timeLabel ? ` · ${request.timeLabel}` : ""}
              </p>
            ) : null}
          </div>
          <span className="mt-3 inline-flex rounded-full bg-hagu-surface-muted px-2.5 py-1 text-[10px] font-semibold text-hagu-ink">
            Pending
          </span>
        </article>

        <button
          type="button"
          onClick={() => router.push(`${ROUTES.chat}?tab=bookings`)}
          className="mt-6 text-sm font-medium text-hagu-accent-strong"
        >
          View booking status
        </button>
      </div>
    </div>
  )
}
