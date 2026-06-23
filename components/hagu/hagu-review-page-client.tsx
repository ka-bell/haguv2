"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { HaguReviewScreen } from "@/components/hagu/hagu-review-screen"
import { usePendingReviews } from "@/hooks/use-pending-reviews"
import type { PendingReview } from "@/lib/hagu-reviews"
import { ROUTES } from "@/lib/routes"

type HaguReviewPageClientProps = {
  review: PendingReview
}

export function HaguReviewPageClient({ review }: HaguReviewPageClientProps) {
  const router = useRouter()
  const { reviews, ready } = usePendingReviews()
  const isPending = reviews.some((item) => item.id === review.id)

  useEffect(() => {
    if (!ready) return
    if (!isPending) {
      router.replace(ROUTES.discover)
    }
  }, [ready, isPending, router])

  if (!ready || !isPending) {
    return null
  }

  return <HaguReviewScreen review={review} />
}
