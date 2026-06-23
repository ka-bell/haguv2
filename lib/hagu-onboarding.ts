import { ROUTES } from "@/lib/routes"
import type { HaguStep } from "@/app/onboarding/hagu/data"

/** Deep-link into a single HAGU onboarding step from Settings (edit mode). */
export function haguOnboardingEditUrl(step: HaguStep) {
  return `${ROUTES.onboardingHagu}?step=${step}&edit=1`
}

export const SETTINGS_ONBOARDING_STEP = {
  "edit-profile": 2,
  about: 2,
  "service-menu": 5,
  character: 3,
  rates: 4,
  stripe: 9,
  identity: 7,
} as const satisfies Record<string, HaguStep>
