import { PENDING_REVIEWS, type PendingReview } from "@/lib/hagu-reviews"

const COMPLETED_KEY = "hagu-completed-reviews"
export const REVIEWS_CHANGED_EVENT = "hagu-reviews-changed"

function readCompletedIds(): string[] {
  if (typeof window === "undefined") return []
  const raw = window.localStorage.getItem(COMPLETED_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : []
  } catch {
    return []
  }
}

function writeCompletedIds(ids: string[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(COMPLETED_KEY, JSON.stringify(ids))
  window.dispatchEvent(new Event(REVIEWS_CHANGED_EVENT))
}

export function getPendingReviews(): PendingReview[] {
  const completed = new Set(readCompletedIds())
  return PENDING_REVIEWS.filter((review) => !completed.has(review.id))
}

export function completeReview(reviewId: string) {
  const completed = readCompletedIds()
  if (completed.includes(reviewId)) return
  writeCompletedIds([...completed, reviewId])
}

export function clearCompletedReviews() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(COMPLETED_KEY)
  window.dispatchEvent(new Event(REVIEWS_CHANGED_EVENT))
}
