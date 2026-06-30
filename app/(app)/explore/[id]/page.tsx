"use client"

import { useParams, useRouter } from "next/navigation"
import { HageeCompanionProfileScreen } from "@/components/hagee/hagee-companion-profile-screen"
import { HaguFlowHeader } from "@/components/hagu/hagu-flow-header"
import { HaguFlowCta } from "@/components/hagu/hagu-flow-cta"
import { ScreenLayout } from "@/components/ui/screen-layout"
import { getCompanionProfile } from "@/lib/hagee-companion-profiles"
import { ROUTES } from "@/lib/routes"

export default function ExploreCompanionProfilePage() {
  const router = useRouter()
  const params = useParams()
  const id = typeof params.id === "string" ? params.id : ""
  const profile = getCompanionProfile(id)

  const handleRequest = () => {
    router.push(ROUTES.chatThread(profile?.id === "luca" ? "luca" : "sarah"))
  }

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

  return (
    <ScreenLayout
      className="bg-hagu-canvas"
      reserveHeader
      headerVariant="brand"
      header={<HaguFlowHeader onBack={() => router.back()} closeHref={ROUTES.explore} />}
      footer={<HaguFlowCta label={`Request time with ${profile.name}`} onClick={handleRequest} />}
    >
      <HageeCompanionProfileScreen profile={profile} />
    </ScreenLayout>
  )
}
