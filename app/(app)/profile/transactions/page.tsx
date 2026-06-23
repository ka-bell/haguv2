"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/routes"

export default function ProfileTransactionsRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace(ROUTES.settingsTransactions)
  }, [router])

  return null
}
