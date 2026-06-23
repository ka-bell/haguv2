"use client"

import { MessageCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type { ProviderRequest } from "@/lib/hagu-provider-feed"
import { ROUTES } from "@/lib/routes"

type HaguRequestCardProps = {
  request: ProviderRequest
  onAccept?: () => void
  onMessage?: () => void
}

export function HaguRequestCard({ request, onAccept, onMessage }: HaguRequestCardProps) {
  const router = useRouter()

  const openChat = () => {
    if (onMessage) {
      onMessage()
      return
    }
    router.push(ROUTES.chatThread(request.chatId))
  }

  return (
    <article className="rounded-[20px] border border-black/[0.06] bg-white px-5 pb-5 pt-5 shadow-[0px_2px_8px_rgba(26,26,30,0.04)]">
      <div className="flex gap-3">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-[24px]">
          <Image src={request.avatar} alt={request.name} fill className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[15px] font-semibold text-[#1A1A1E]">{request.name}</p>
              <p className="text-xs text-[#8A8A96]">{request.subtitle}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={openChat}
                className="flex size-9 items-center justify-center rounded-full bg-[#F7F6F3] text-[#1A1A1E] transition active:opacity-80"
                aria-label={`Message ${request.name}`}
              >
                <MessageCircle className="size-4" />
              </button>
              <span className="rounded-full bg-[#FFF8E7] px-3 py-1 text-[11px] font-semibold text-[#D4900A]">
                New
              </span>
            </div>
          </div>
        </div>
      </div>

      {request.details ? (
        <div className="mt-4 space-y-2 rounded-[14px] bg-[#F7F6F3] p-3.5">
          {request.details.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3 text-xs">
              <span className="text-[#8A8A96]">{row.label}</span>
              <span
                className={
                  row.bold ? "text-sm font-bold text-[#1A1A1E]" : "text-[13px] font-medium text-[#1A1A1E]"
                }
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {request.message ? (
        <p className="mt-4 text-[13px] leading-[1.5] text-[#4A4A52]">{request.message}</p>
      ) : null}

      {request.summary ? (
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[13px] font-medium text-[#1A1A1E]">{request.summary}</p>
            {request.meta ? <p className="text-xs text-[#8A8A96]">{request.meta}</p> : null}
          </div>
          <p className="text-base font-bold text-[#1A1A1E]">{request.price}</p>
        </div>
      ) : null}

      <div className="mt-4 flex gap-2.5">
        <button
          type="button"
          className="flex h-10 w-[98px] shrink-0 items-center justify-center rounded-full border border-[#5BBFB5] text-[13px] font-medium text-[#3DA89E] transition active:opacity-80"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={onAccept}
          className="flex h-10 flex-1 items-center justify-center rounded-full bg-[#1A1A1E] text-[13px] font-medium text-white transition active:opacity-80"
        >
          Accept · {request.price}
        </button>
      </div>
    </article>
  )
}
