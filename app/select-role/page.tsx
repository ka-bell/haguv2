"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { HaguFlowScreen } from "@/components/hagu/hagu-flow-screen"
import { ROUTES } from "@/lib/routes"
import { isPrototypeMode } from "@/lib/prototype"
import { setPendingRole } from "@/lib/session"
import { cn } from "@/lib/utils"

type Role = "HAGEE" | "HAGU"

const ROLES: { id: Role; title: string; description: string }[] = [
  {
    id: "HAGEE",
    title: "I am a HAGEE",
    description: "Book a HAGU for social activities and companionship.",
  },
  {
    id: "HAGU",
    title: "I am a HAGU",
    description: "Offer my time and receive bookings.",
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
      <div className="space-y-6">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">Pick one</h1>
          <p className="mt-1 text-sm font-light text-[#8A8A96]">How do you want to use HAGU?</p>
        </div>

        <div className="space-y-3">
          {ROLES.map((item) => {
            const selected = role === item.id
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setRole(item.id)}
                className={cn(
                  "relative w-full rounded-[20px] border p-5 text-left shadow-[0px_2px_8px_rgba(26,26,30,0.04)] transition",
                  selected
                    ? "border-2 border-[#5BBFB5] bg-[rgba(208,241,240,0.4)]"
                    : "border border-black/[0.06] bg-white active:bg-[#F7F6F3]",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-[#1A1A1E]">{item.title}</p>
                    <p className="mt-1 text-sm text-[#8A8A96]">{item.description}</p>
                  </div>
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border transition",
                      selected ? "border-[#1A1A1E] bg-[#1A1A1E] text-white" : "border-black/15 bg-white",
                    )}
                  >
                    {selected ? <Check className="size-3.5" strokeWidth={3} /> : null}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </HaguFlowScreen>
  )
}
