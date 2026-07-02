"use client"

import { Check, FileText, MessageCircle, Users } from "lucide-react"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { WHATS_NEXT_ITEMS } from "@/app/onboarding/hagee/data"

const ICONS = {
  browse: Users,
  request: FileText,
  chat: MessageCircle,
} as const

interface HageeOnboardingSuccessProps {
  displayName: string
  title?: string
  subtitle?: string
  hideWhatsNext?: boolean
}

export function HageeOnboardingSuccess({
  displayName,
  title,
  subtitle,
  hideWhatsNext = false,
}: HageeOnboardingSuccessProps) {
  return (
    <div className="flex flex-col items-center pt-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-hagu-accent-soft">
        <Check className="size-9 text-hagu-accent-strong" strokeWidth={2.5} />
      </div>

      <h1 className="mt-6 hagu-page-title text-hagu-heading">
        {title ?? `You're all set, ${displayName}.`}
      </h1>
      <p className="mt-2 max-w-[300px] text-sm leading-relaxed text-hagu-text-secondary">
        {subtitle ?? "Your profile is ready. Start exploring people available near you this week."}
      </p>

      {hideWhatsNext ? null : (
        <div className="mt-8 w-full space-y-3 text-left">
          {WHATS_NEXT_ITEMS.map((item) => {
            const Icon = ICONS[item.id]
            return (
              <Card key={item.id} className="hagu-surface-card flex flex-row items-center gap-3 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-hagu-accent-soft">
                  <Icon className="size-[18px] text-hagu-accent-strong" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-[15px]">{item.title}</CardTitle>
                  <CardDescription className="mt-0.5 text-xs">{item.subtitle}</CardDescription>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
