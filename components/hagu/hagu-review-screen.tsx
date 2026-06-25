"use client"

import { X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { PAGE_HEADER_TOP_PADDING } from "@/components/ui/page-shell"
import { HaguStarRating } from "@/components/hagu/hagu-star-rating"
import { HaguToggle } from "@/components/ui/hagu-toggle"
import { completeReview } from "@/lib/hagu-review-storage"
import { REVIEW_CRITERIA, type PendingReview, type ReviewCriterion } from "@/lib/hagu-reviews"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

type HaguReviewScreenProps = {
  review: PendingReview
}

type CriterionRatings = Record<ReviewCriterion, number>

const DEFAULT_CRITERIA: CriterionRatings = {
  respectful: 5,
  conversation: 4,
  onTime: 5,
}

export function HaguReviewScreen({ review }: HaguReviewScreenProps) {
  const router = useRouter()
  const [overall, setOverall] = useState(5)
  const [criteria, setCriteria] = useState<CriterionRatings>(DEFAULT_CRITERIA)
  const [note, setNote] = useState("")
  const [acceptAgain, setAcceptAgain] = useState(true)

  const firstName = review.name.split(" ")[0]

  const updateCriterion = (id: ReviewCriterion, value: number) => {
    setCriteria((current) => ({ ...current, [id]: value }))
  }

  const handleSubmit = () => {
    completeReview(review.id)
    router.push(ROUTES.discover)
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-[#F7F6F3]">
      <div className={cn("sticky top-0 z-20 flex justify-end bg-[#F7F6F3] px-6 pb-2", PAGE_HEADER_TOP_PADDING)}>
        <button
          type="button"
          onClick={() => router.push(ROUTES.discover)}
          className="flex size-9 items-center justify-center rounded-[18px] border border-black/[0.08] bg-white text-[#1A1A1E] transition active:opacity-80"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 pb-36 pt-2">
        <div className="flex items-center gap-3.5 rounded-[20px] bg-[#EAF7F5] p-5">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-[28px] border-2 border-white">
            <Image src={review.avatar} alt={review.name} fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#5BBFB5]">Session completed</p>
            <p className="text-base font-semibold text-[#1A1A1E]">{review.title}</p>
            <p className="text-[13px] text-[#8A8A96]">{review.date}</p>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.5px] text-[#1A1A1E]">How was it?</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#8A8A96]">
            Your review helps the community. {firstName} will also review you.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-[13px] font-semibold text-[#1A1A1E]">Overall experience</p>
          <HaguStarRating value={overall} onChange={setOverall} className="justify-center" />
        </div>

        <div className="space-y-4 rounded-[20px] border border-black/[0.06] bg-white p-5 shadow-[0px_2px_8px_rgba(26,26,30,0.04)]">
          {REVIEW_CRITERIA.map((criterion) => (
            <div key={criterion.id} className="flex items-center justify-between gap-3">
              <p className="text-sm text-[#1A1A1E]">{criterion.label}</p>
              <HaguStarRating
                value={criteria[criterion.id]}
                onChange={(value) => updateCriterion(criterion.id, value)}
                size="sm"
              />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-[13px] font-semibold text-[#1A1A1E]">Write a note (optional)</p>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={`${firstName} was warm and easy to talk to. Great evening!`}
            rows={4}
            className="w-full resize-none rounded-[14px] border border-black/10 bg-white px-4 py-3.5 text-sm leading-relaxed text-[#4A4A52] outline-none placeholder:text-[#B8B8C2] focus:border-[#D0F1F0] focus:ring-2 focus:ring-[#D0F1F0]/50"
          />
        </div>

        <div className="flex items-center justify-between rounded-[14px] bg-[#F7F6F3] px-4 py-4">
          <p className="text-sm font-medium text-[#1A1A1E]">Would accept again</p>
          <HaguToggle checked={acceptAgain} onChange={setAcceptAgain} label="Would accept again" />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-md bg-gradient-to-t from-[#F7F6F3] via-[#F7F6F3] to-transparent px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex h-[52px] w-full items-center justify-center rounded-full bg-[#1A1A1E] text-[15px] font-medium text-white transition active:opacity-90"
        >
          Submit Review
        </button>
      </div>
    </div>
  )
}
