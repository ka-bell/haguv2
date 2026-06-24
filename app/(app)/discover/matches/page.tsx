"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { roleGuardRedirect } from "@/lib/app-navigation"
import { getSession } from "@/lib/session"

/** Legacy URL — redirects to /explore or /discover based on role. */
export default function LegacyDiscoverMatchesPage() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const target = roleGuardRedirect(pathname, getSession().role)
    if (target) router.replace(target)
  }, [pathname, router])

  return null
}
