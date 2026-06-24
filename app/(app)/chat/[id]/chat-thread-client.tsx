"use client"

import { HaguChatThread } from "@/components/hagu/hagu-chat-thread"
import { HageeChatThread } from "@/components/hagee/hagee-chat-thread"
import { getSession } from "@/lib/session"

export function ChatThreadPageClient({ threadId }: { threadId: string }) {
  const session = getSession()
  const isHaguProvider = session.role === "HAGU"

  if (isHaguProvider) {
    return <HaguChatThread threadId={threadId} />
  }

  return <HageeChatThread threadId={threadId} />
}
