"use client"

import { ChevronRight, Star } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { usePendingReviews } from "@/hooks/use-pending-reviews"
import { ROUTES } from "@/lib/routes"

export function HaguReviewsListScreen() {
  const router = useRouter()
  const { reviews } = usePendingReviews()

  if (reviews.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-base font-medium text-[#1A1A1E]">All caught up</p>
        <p className="mt-1 text-sm text-[#8A8A96]">No reviews waiting right now.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-4">
      <div>
        <h1 className="text-[26px] font-semibold tracking-[-0.5px] text-[#1A1A1E]">Reviews</h1>
        <p className="mt-1 text-sm text-[#8A8A96]">
          {reviews.length} session{reviews.length === 1 ? "" : "s"} waiting for your feedback
        </p>
      </div>

      <div className="space-y-3">
        {reviews.map((review) => (
          <button
            key={review.id}
            type="button"
            onClick={() => router.push(ROUTES.review(review.id))}
            className="flex w-full items-center gap-3 rounded-[20px] border border-black/[0.06] bg-white px-4 py-4 text-left shadow-[0px_2px_8px_rgba(26,26,30,0.04)] transition active:opacity-90"
          >
            <div className="relative size-12 shrink-0 overflow-hidden rounded-[24px]">
              <Image src={review.avatar} alt={review.name} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium text-[#1A1A1E]">{review.title}</p>
              <p className="text-xs text-[#8A8A96]">{review.date}</p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-[#B8B8C2]" />
          </button>
        ))}
      </div>
    </div>
  )
}

export function HaguPendingReviewsBanner() {
  const router = useRouter()
  const { reviews, count, firstReview } = usePendingReviews()

  if (count === 0 || !firstReview) return null

  const target =
    count === 1 ? ROUTES.review(firstReview.id) : ROUTES.reviews

  return (
    <button
      type="button"
      onClick={() => router.push(target)}
      className="flex w-full items-center justify-between rounded-2xl border border-[#F5A623]/20 bg-[#FFF8E7] px-5 py-4 text-left transition active:opacity-90"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-[10px] bg-[#F5A623]/15 text-[#D4900A]">
          <Star className="size-4 fill-[#F5A623] text-[#F5A623]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#1A1A1E]">
            {count} review{count === 1 ? "" : "s"} to complete
          </p>
          <p className="text-xs text-[#8A8A96]">
            {count === 1
              ? `Rate your session with ${firstReview.name}`
              : `${reviews.map((review) => review.name).join(", ")}`}
          </p>
        </div>
      </div>
      <ChevronRight className="size-4 text-[#8A8A96]" />
    </button>
  )
}
