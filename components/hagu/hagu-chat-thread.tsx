"use client"

import { ArrowLeft, Calendar, Send } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getChatThread } from "@/lib/hagu-chat-threads"
import { ROUTES } from "@/lib/routes"

type HaguChatThreadProps = {
  threadId: string
}

export function HaguChatThread({ threadId }: HaguChatThreadProps) {
  const router = useRouter()
  const thread = getChatThread(threadId)

  if (!thread) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-[#FCFFFF] px-5">
        <p className="text-sm text-[#8A8A96]">Chat not found.</p>
        <button
          type="button"
          onClick={() => router.push(ROUTES.bookings)}
          className="mt-4 text-sm font-medium text-[#3DA89E]"
        >
          Back to bookings
        </button>
      </div>
    )
  }

  const firstName = thread.name.split(" ")[0]

  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-[#FCFFFF]">
      <header className="shrink-0 border-b border-black/[0.06] bg-white px-5 pb-3 pt-14">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(ROUTES.bookings)}
            className="flex size-8 shrink-0 items-center justify-center rounded-2xl bg-[#F7F6F3] text-[#1A1A1E]"
            aria-label="Back"
          >
            <ArrowLeft className="size-3.5" />
          </button>

          <div className="relative shrink-0">
            <div className="size-10 overflow-hidden rounded-[20px]">
              <Image
                src={thread.avatar}
                alt={thread.name}
                width={40}
                height={40}
                className="size-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 size-2.5 rounded-[5px] border-2 border-white bg-[#5BBFB5]" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-[#1A1A1E]">{thread.name}</p>
            <p className="text-[11px] text-[#5BBFB5]">{thread.status}</p>
          </div>
        </div>
      </header>

      {thread.bookingBar ? (
        <div className="flex shrink-0 items-center justify-between border-b border-black/[0.04] bg-[#EAF7F5] px-5 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <Calendar className="size-3.5 shrink-0 text-[#3DA89E]" />
            <p className="truncate text-xs font-medium text-[#3DA89E]">
              {thread.bookingBar.activity} · {thread.bookingBar.date} · {thread.bookingBar.price}
            </p>
          </div>
          <button type="button" className="shrink-0 text-[11px] font-semibold text-[#5BBFB5]">
            View
          </button>
        </div>
      ) : null}

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        <div className="flex justify-center pb-1 pt-1">
          <span className="rounded-full bg-[#F7F6F3] px-3 py-0.5 text-[11px] text-[#B8B8C2]">Today</span>
        </div>

        {thread.messages.map((message, index) =>
          message.type === "incoming" ? (
            <div key={index} className="flex items-end gap-2">
              <div className="relative size-7 shrink-0 overflow-hidden rounded-[14px]">
                <Image src={thread.avatar} alt="" fill className="object-cover" />
              </div>
              <div className="max-w-[78%]">
                <div className="rounded-bl-[4px] rounded-br-[18px] rounded-tl-[18px] rounded-tr-[18px] border border-black/[0.06] bg-white px-4 py-3 text-sm leading-[1.5] text-[#1A1A1E]">
                  {message.text}
                </div>
                <p className="mt-1 text-[10px] text-[#B8B8C2]">{message.time}</p>
              </div>
            </div>
          ) : (
            <div key={index} className="flex flex-col items-end">
              <div className="max-w-[78%] rounded-bl-[18px] rounded-br-[4px] rounded-tl-[18px] rounded-tr-[18px] bg-[#1A1A1E] px-4 py-3 text-sm leading-[1.5] text-white">
                {message.text}
              </div>
              <p className="mt-1 text-[10px] text-[#B8B8C2]">{message.time}</p>
            </div>
          ),
        )}
      </div>

      <footer className="shrink-0 border-t border-black/[0.06] bg-white px-4 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-11 flex-1 items-center rounded-[22px] bg-[#F7F6F3] px-4">
            <span className="text-sm text-[#B8B8C2]">Message {firstName}...</span>
          </div>
          <button
            type="button"
            className="flex size-11 shrink-0 items-center justify-center rounded-[22px] bg-[#1A1A1E] text-white"
            aria-label="Send message"
          >
            <Send className="size-[18px]" />
          </button>
        </div>
      </footer>
    </div>
  )
}
