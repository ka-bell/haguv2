"use client"

import { useEffect, useState } from "react"

/** Avoid reading browser-only APIs during SSR / first paint. */
export function useClientReady() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  return ready
}
