"use client"

import { useRouter } from "next/navigation"
import { HaguReviewsListScreen } from "@/components/hagu/hagu-reviews-list-screen"
import { HaguFlowPageShell } from "@/components/hagu/hagu-provider-tab-shell"
import { ROUTES } from "@/lib/routes"

export default function ReviewsPage() {
  const router = useRouter()

  return (
    <HaguFlowPageShell onBack={() => router.push(ROUTES.discover)} closeHref={ROUTES.discover}>
      <HaguReviewsListScreen />
    </HaguFlowPageShell>
  )
}
