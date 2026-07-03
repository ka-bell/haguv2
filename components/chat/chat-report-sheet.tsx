"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { HaguPrototypeSheet } from "@/components/hagu/hagu-prototype-sheet"
import { HaguFlowCta } from "@/components/hagu/hagu-flow-cta"
import {
  CHAT_REPORT_REASONS,
  submitChatReport,
  type ChatReportReasonId,
} from "@/lib/chat-report"
import { selectionRowClass } from "@/lib/hagu-selection-styles"
import { cn } from "@/lib/utils"

type ChatReportSheetProps = {
  open: boolean
  onClose: () => void
  threadId: string
  personName: string
}

export function ChatReportSheet({ open, onClose, threadId, personName }: ChatReportSheetProps) {
  const [reason, setReason] = useState<ChatReportReasonId | null>(null)
  const [details, setDetails] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!open) return
    setReason(null)
    setDetails("")
    setSubmitted(false)
  }, [open])

  const handleSubmit = () => {
    if (!reason) return

    submitChatReport({
      threadId,
      personName,
      reason,
      details: details.trim() || undefined,
    })
    setSubmitted(true)
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <HaguPrototypeSheet
      open={open}
      onClose={handleClose}
      title={submitted ? "Report received" : `Report ${personName}`}
      figmaLabel="Chat · Report"
    >
      {submitted ? (
        <div className="space-y-4 pb-4 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-hagu-border bg-hagu-canvas text-hagu-ink">
            <Check className="size-7" strokeWidth={2.5} />
          </div>
          <p className="text-sm leading-relaxed text-[#8A8A96]">
            Thanks for letting us know. Our safety team will review this conversation. You can keep
            using HAGU as usual — we&apos;ll only reach out if we need more information.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-[32px] bg-[#2D1012] py-4 text-base font-semibold text-white"
          >
            Done
          </button>
        </div>
      ) : (
        <div className="space-y-5 pb-2">
          <p className="text-sm text-[#8A8A96]">
            Reports are confidential. Tell us what happened so we can review this conversation.
          </p>

          <div className="space-y-2">
            {CHAT_REPORT_REASONS.map((option) => {
              const selected = reason === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setReason(option.id)}
                  className={cn(
                    "flex w-full flex-col rounded-[16px] px-4 py-3.5 text-left transition",
                    selectionRowClass(selected),
                  )}
                >
                  <span className="text-sm font-medium text-[#1A1A1E]">{option.label}</span>
                  <span className="mt-0.5 text-xs text-[#8A8A96]">{option.description}</span>
                </button>
              )
            })}
          </div>

          {reason === "other" || reason === "safety" ? (
            <label className="block space-y-2">
              <span className="text-xs font-medium text-[#8A8A96]">Additional details (optional)</span>
              <textarea
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                rows={3}
                placeholder="Share anything that helps us understand the situation."
                className="w-full resize-none rounded-[16px] border border-black/[0.06] bg-white px-4 py-3 text-sm text-[#1A1A1E] outline-none placeholder:text-[#B8B8C2] focus:border-hagu-accent focus:ring-2 focus:ring-hagu-accent/50"
              />
            </label>
          ) : null}

          <HaguFlowCta
            pinned={false}
            label="Submit report"
            onClick={handleSubmit}
            disabled={!reason}
            className="-mx-6 border-none px-0"
          />
        </div>
      )}
    </HaguPrototypeSheet>
  )
}
