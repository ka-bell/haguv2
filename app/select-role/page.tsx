"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { HaguFlowScreen } from "@/components/hagu/hagu-flow-screen"
import { selectionCheckIndicatorClass, selectionRowClass } from "@/lib/hagu-selection-styles"
import { ROUTES } from "@/lib/routes"
import { isPrototypeMode } from "@/lib/prototype"
import { setPendingRole } from "@/lib/session"
import { cn } from "@/lib/utils"

type Role = "HAGEE" | "HAGU"

const ROLES: { id: Role; title: string; description: string }[] = [
  {
    id: "HAGEE",
    title: "HAGEE",
    description: "I buy companionship — book a HAGU for shared time.",
  },
  {
    id: "HAGU",
    title: "HAGU",
    description: "I sell my time — offer services and receive bookings.",
  },
]

export default function SelectRolePage() {
  const [role, setRole] = useState<Role | null>(null)
  const router = useRouter()

  const continueFlow = () => {
    const nextRole = role ?? (isPrototypeMode() ? "HAGU" : null)
    if (!nextRole) return
    setPendingRole(nextRole)

    if (nextRole === "HAGU") {
      router.push(ROUTES.onboardingHagu)
      return
    }
    router.push(ROUTES.onboardingHagee)
  }

  return (
    <HaguFlowScreen
      onBack={() => router.push(ROUTES.entry)}
      closeHref={ROUTES.entry}
      ctaLabel="Start onboarding"
      onCta={continueFlow}
      ctaDisabled={!isPrototypeMode() && !role}
    >
      <div className="space-y-5">
        <div>
          <h1 className="hagu-page-title">Pick one</h1>
          <p className="mt-1 text-sm font-light text-hagu-text-secondary">
            HAGEE buys companionship. HAGU sells time.
          </p>
        </div>

        <div className="space-y-2.5">
          {ROLES.map((item) => {
            const selected = role === item.id
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setRole(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-[20px] px-4 py-3.5 text-left transition",
                  selectionRowClass(selected),
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-hagu-ink">{item.title}</p>
                  <p className="mt-0.5 text-xs leading-snug text-hagu-text-secondary">{item.description}</p>
                </div>
                <div className={selectionCheckIndicatorClass(selected)}>
                  {selected ? <Check className="size-2.5 text-white" strokeWidth={3} /> : null}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </HaguFlowScreen>
  )
}
