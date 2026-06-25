"use client"

import Image from "next/image"
import { ArrowLeft, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { ChatThreadHeaderActions } from "@/components/chat/chat-thread-header-actions"
import { PAGE_HEADER_TOP_PADDING } from "@/components/ui/page-shell"
import { getHageeChatThread } from "@/lib/hagee-chat"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

type HageeChatThreadProps = {
  threadId: string
}

export function HageeChatThread({ threadId }: HageeChatThreadProps) {
  const router = useRouter()
  const thread = getHageeChatThread(threadId)

  if (!thread) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-hagu-canvas px-5">
        <p className="text-sm text-hagu-text-secondary">Chat not found.</p>
        <button
          type="button"
          onClick={() => router.push(ROUTES.chat)}
          className="mt-4 text-sm font-medium text-hagu-accent-strong"
        >
          Back to Connections
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-hagu-canvas">
      <header className={cn("shrink-0 border-b border-hagu-border bg-hagu-white px-5 pb-3", PAGE_HEADER_TOP_PADDING)}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(ROUTES.chat)}
            className="flex size-8 shrink-0 items-center justify-center rounded-2xl bg-hagu-surface-muted text-hagu-heading"
            aria-label="Back"
          >
            <ArrowLeft className="size-3.5" />
          </button>

          <div className="relative shrink-0">
            <div className="size-10 overflow-hidden rounded-full">
              <Image
                src={thread.avatar}
                alt={thread.name}
                width={40}
                height={40}
                className="size-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-hagu-accent-strong" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-hagu-heading">{thread.name}</p>
            <p className="text-[11px] text-hagu-accent-strong">{thread.status}</p>
          </div>

          <ChatThreadHeaderActions threadId={threadId} personName={thread.name} variant="hagee" />
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {thread.messages.map((message, index) => (
          <div
            key={`${message.time}-${index}`}
            className={message.type === "outgoing" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={
                message.type === "outgoing"
                  ? "max-w-[80%] rounded-[20px] rounded-br-md bg-hagu-heading px-4 py-2.5 text-[13px] text-white"
                  : "max-w-[80%] rounded-[20px] rounded-bl-md bg-hagu-white px-4 py-2.5 text-[13px] text-hagu-ink shadow-[0px_1px_4px_rgba(0,0,0,0.05)]"
              }
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="shrink-0 border-t border-hagu-border bg-hagu-white px-5 py-3 pb-8">
        <div className="flex items-center gap-2 rounded-full border border-hagu-border bg-hagu-canvas px-4 py-2">
          <input
            type="text"
            placeholder="Message…"
            className="min-w-0 flex-1 bg-transparent text-sm text-hagu-heading outline-none placeholder:text-hagu-placeholder"
          />
          <button type="button" aria-label="Send" className="text-hagu-accent-strong">
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
