"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HageeRefineBanner } from "@/components/hagee/hagee-refine-banner"
import { ROUTES } from "@/lib/routes"
import { HAGEE_CLIENT_NAME, HAGEE_DISCOVER_STATS } from "@/lib/hagee-discover"
import { cn } from "@/lib/utils"

function timeGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export function HageeDiscoverHome() {
  const router = useRouter()

  return (
    <div className="flex min-h-[70vh] flex-col">
      <div className="space-y-1.5">
        <p className="text-sm text-hagu-text-secondary">{timeGreeting()}</p>
        <h1 className="text-[32px] font-semibold leading-tight tracking-tight text-hagu-heading">
          Welcome back,
          <br />
          {HAGEE_CLIENT_NAME}.
        </h1>
        <p className="max-w-[280px] pt-2 text-[15px] leading-relaxed text-hagu-label">
          Let&apos;s find someone worth spending time with this week.
        </p>
      </div>

      <div className="mt-9 grid grid-cols-3 gap-2.5">
        {HAGEE_DISCOVER_STATS.map((stat) => (
          <Card
            key={stat.label}
            className={cn(
              "rounded-[16px] border-hagu-border p-3.5 shadow-[0px_1px_4px_rgba(0,0,0,0.05)]",
            )}
          >
            <p
              className={cn(
                "text-[22px] font-semibold tracking-tight",
                stat.highlight ? "text-hagu-accent-strong" : "text-hagu-ink",
              )}
            >
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs text-hagu-text-secondary">{stat.label}</p>
          </Card>
        ))}
      </div>

      <HageeRefineBanner className="mt-5" />

      <div className="mt-auto space-y-3 pt-10">
        <Button
          size="lg"
          className="h-14 w-full rounded-[32px] text-base"
          onClick={() => router.push(ROUTES.exploreRefine)}
        >
          Find someone now
        </Button>
        <button
          type="button"
          onClick={() => router.push(ROUTES.explore)}
          className="w-full py-2 text-sm text-hagu-text-secondary"
        >
          Browse companions
        </button>
      </div>
    </div>
  )
}
