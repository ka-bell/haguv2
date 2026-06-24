"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { roleGuardRedirect } from "@/lib/app-navigation"
import { getSession } from "@/lib/session"

/** Legacy URL — layout and this page redirect to the role-appropriate refine flow. */
export default function LegacyDiscoverRefinePage() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const target = roleGuardRedirect(pathname, getSession().role)
    if (target) router.replace(target)
  }, [pathname, router])

  return null
}
