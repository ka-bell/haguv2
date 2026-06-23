export type ReviewCriterion = "respectful" | "conversation" | "onTime"

export type PendingReview = {
  id: string
  name: string
  title: string
  date: string
  avatar: string
}

export const REVIEW_CRITERIA: { id: ReviewCriterion; label: string }[] = [
  { id: "respectful", label: "Respectful" },
  { id: "conversation", label: "Good conversation" },
  { id: "onTime", label: "On time" },
]

export const PENDING_REVIEWS: PendingReview[] = [
  {
    id: "luca-dinner",
    name: "Luca M.",
    title: "Dinner with Luca M.",
    date: "Fri 6 Jun · 2 hours · €95",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
  },
  {
    id: "julia-walk",
    name: "Julia P.",
    title: "City walk with Julia P.",
    date: "Sat 31 May · 1 hour · €55",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=96&h=96&fit=crop&crop=face",
  },
]

export function getPendingReview(id: string): PendingReview | undefined {
  return PENDING_REVIEWS.find((review) => review.id === id)
}
