"use client"

import { useCallback, useEffect, useState } from "react"
import {
  getProviderProfileStatus,
  PROVIDER_STATUS_EVENT,
  setProviderProfileStatus,
  type ProviderProfileStatus,
} from "@/lib/hagu-provider-status"

export function useProviderProfileStatus() {
  const [status, setStatus] = useState<ProviderProfileStatus>("active")

  useEffect(() => {
    setStatus(getProviderProfileStatus())

    const sync = () => setStatus(getProviderProfileStatus())
    window.addEventListener(PROVIDER_STATUS_EVENT, sync)
    return () => window.removeEventListener(PROVIDER_STATUS_EVENT, sync)
  }, [])

  const updateStatus = useCallback((next: ProviderProfileStatus) => {
    setProviderProfileStatus(next)
    setStatus(next)
  }, [])

  return {
    status,
    isActive: status === "active",
    setProfileStatus: updateStatus,
  }
}
