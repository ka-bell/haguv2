"use client"

import { useParams, useRouter } from "next/navigation"
import { HageeBookingFlow } from "@/components/hagee/hagee-booking-flow"
import { HaguFlowHeader } from "@/components/hagu/hagu-flow-header"
import { ScreenLayout } from "@/components/ui/screen-layout"
import { getCompanionProfile } from "@/lib/hagee-companion-profiles"
import { ROUTES } from "@/lib/routes"

export function ExploreCompanionBookPageClient() {
  const router = useRouter()
  const params = useParams()
  const id = typeof params.id === "string" ? params.id : ""
  const profile = getCompanionProfile(id)

  if (!profile) {
    return (
      <ScreenLayout
        className="bg-hagu-canvas"
        reserveHeader
        headerVariant="brand"
        header={<HaguFlowHeader onBack={() => router.push(ROUTES.explore)} closeHref={ROUTES.explore} />}
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-center">
          <p className="text-[15px] font-medium text-hagu-ink">Profile not found</p>
          <button
            type="button"
            onClick={() => router.push(ROUTES.explore)}
            className="hagu-action-btn-muted px-6"
          >
            Back to Explore
          </button>
        </div>
      </ScreenLayout>
    )
  }

  return <HageeBookingFlow profile={profile} />
}
