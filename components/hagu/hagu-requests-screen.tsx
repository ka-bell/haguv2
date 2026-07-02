"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { HaguRequestCard } from "@/components/hagu/hagu-request-card"
import { PROVIDER_REQUESTS } from "@/lib/hagu-provider-feed"
import {
  bookingRequestToProviderRequest,
  confirmBookingRequest,
  getBookingRequests,
  HAGEE_BOOKING_UPDATED_EVENT,
} from "@/lib/hagee-booking-storage"
import { ROUTES } from "@/lib/routes"

export function HaguRequestsScreen() {
  const router = useRouter()
  const [storedRequests, setStoredRequests] = useState<ReturnType<typeof getBookingRequests>>([])

  useEffect(() => {
    const refresh = () => {
      setStoredRequests(getBookingRequests().filter((request) => request.status === "pending"))
    }
    refresh()
    window.addEventListener(HAGEE_BOOKING_UPDATED_EVENT, refresh)
    window.addEventListener("storage", refresh)
    return () => {
      window.removeEventListener(HAGEE_BOOKING_UPDATED_EVENT, refresh)
      window.removeEventListener("storage", refresh)
    }
  }, [])

  const requests = useMemo(
    () => [
      ...storedRequests.map(bookingRequestToProviderRequest),
      ...PROVIDER_REQUESTS,
    ],
    [storedRequests],
  )

  return (
    <div className="space-y-5 pb-4">
      <div>
        <h1 className="text-[26px] font-semibold tracking-[-0.5px] text-[#1A1A1E]">Requests</h1>
        <p className="mt-1 text-sm text-[#8A8A96]">
          {requests.length} new · respond within 24h
        </p>
      </div>

      <div className="space-y-5">
        {requests.map((request) => (
          <HaguRequestCard
            key={request.id}
            request={request}
            onOpen={() => router.push(ROUTES.booking(request.id))}
            onAccept={() => {
              if ("fromStorage" in request) {
                confirmBookingRequest(request.id)
              }
              router.push(ROUTES.chatThread(request.chatId))
            }}
          />
        ))}
      </div>
    </div>
  )
}
