"use client"

import { useRouter } from "next/navigation"
import { EntryGate } from "@/components/entry-gate"
import {
  ScreenFooter,
  ScreenPrimaryButton,
  ScreenSecondaryButton,
} from "@/components/ui/screen-footer"
import { BrandHeaderSpacer, ScreenLayout } from "@/components/ui/screen-layout"
import { ROUTES } from "@/lib/routes"

function navigateWithTransition(router: ReturnType<typeof useRouter>, href: string) {
  if (typeof document !== "undefined" && "startViewTransition" in document) {
    ;(document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(
      () => router.push(href),
    )
    return
  }
  router.push(href)
}

export function EntryScreen() {
  const router = useRouter()

  return (
    <EntryGate>
      <ScreenLayout
        className="bg-hagu-canvas"
        contentClassName="flex flex-col justify-center pb-6"
        header={<BrandHeaderSpacer />}
        footer={
          <ScreenFooter>
            <ScreenPrimaryButton onClick={() => navigateWithTransition(router, ROUTES.login)}>
              Log in
            </ScreenPrimaryButton>
            <ScreenSecondaryButton
              onClick={() => navigateWithTransition(router, ROUTES.selectRole)}
            >
              Create account
            </ScreenSecondaryButton>
          </ScreenFooter>
        }
      >
        <div className="text-center">
          <h1 className="hagu-brand-transition text-5xl font-black tracking-tight text-hagu-heading">
            HAGU
          </h1>
          <p className="mt-3 text-sm text-hagu-text-secondary">The app for unconventional companionship.</p>
        </div>
      </ScreenLayout>
    </EntryGate>
  )
}
