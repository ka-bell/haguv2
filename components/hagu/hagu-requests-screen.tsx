"use client"

import { HaguRequestCard } from "@/components/hagu/hagu-request-card"
import { PROVIDER_REQUESTS } from "@/lib/hagu-provider-feed"

export function HaguRequestsScreen() {
  return (
    <div className="space-y-5 pb-4">
      <div>
        <h1 className="text-[26px] font-semibold tracking-[-0.5px] text-[#1A1A1E]">Requests</h1>
        <p className="mt-1 text-sm text-[#8A8A96]">3 new · respond within 24h</p>
      </div>

      <div className="space-y-5">
        {PROVIDER_REQUESTS.map((request) => (
          <HaguRequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  )
}
