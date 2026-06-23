import { notFound } from "next/navigation"
import { HaguReviewPageClient } from "@/components/hagu/hagu-review-page-client"
import { getPendingReview } from "@/lib/hagu-reviews"

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const review = getPendingReview(id)

  if (!review) {
    notFound()
  }

  return <HaguReviewPageClient review={review} />
}
