"use client"

import { useCallback, useEffect, useState } from "react"
import { getPendingReviews } from "@/lib/hagu-review-storage"
import { REVIEWS_CHANGED_EVENT } from "@/lib/hagu-review-storage"
import type { PendingReview } from "@/lib/hagu-reviews"

export function usePendingReviews() {
  const [reviews, setReviews] = useState<PendingReview[]>([])
  const [ready, setReady] = useState(false)

  const refresh = useCallback(() => {
    setReviews(getPendingReviews())
    setReady(true)
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener(REVIEWS_CHANGED_EVENT, refresh)
    return () => window.removeEventListener(REVIEWS_CHANGED_EVENT, refresh)
  }, [refresh])

  return {
    reviews,
    count: reviews.length,
    firstReview: reviews[0] ?? null,
    ready,
  }
}
