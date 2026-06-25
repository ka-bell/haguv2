"use client"

import { useState } from "react"
import { MoreVertical } from "lucide-react"
import { ChatReportSheet } from "@/components/chat/chat-report-sheet"
import { cn } from "@/lib/utils"

type ChatThreadHeaderActionsProps = {
  threadId: string
  personName: string
  variant?: "hagee" | "hagu"
}

export function ChatThreadHeaderActions({
  threadId,
  personName,
  variant = "hagee",
}: ChatThreadHeaderActionsProps) {
  const [reportOpen, setReportOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setReportOpen(true)}
        aria-label={`Options for chat with ${personName}`}
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-2xl",
          variant === "hagu"
            ? "bg-[#F7F6F3] text-[#1A1A1E]"
            : "bg-hagu-surface-muted text-hagu-heading",
        )}
      >
        <MoreVertical className="size-4" />
      </button>

      <ChatReportSheet
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        threadId={threadId}
        personName={personName}
      />
    </>
  )
}
