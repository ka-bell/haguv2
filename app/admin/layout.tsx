"use client"

import { Suspense } from "react"
import { AlertCircle } from "lucide-react"
import { AdminAuthProvider } from "@/lib/cms/auth-context"

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthProvider>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        }
      >
        {children}
      </Suspense>
    </AdminAuthProvider>
  )
}
