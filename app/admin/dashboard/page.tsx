"use client"

import { Suspense } from "react"
import AdminLayout from "@/components/cms/admin-layout"
import DashboardStats from "@/components/cms/dashboard-stats"
import RecentActivity from "@/components/cms/recent-activity"

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your Hagu platform</p>
        </div>

        <Suspense fallback={<div className="text-gray-500">Loading stats...</div>}>
          <DashboardStats />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<div className="text-gray-500">Loading activity...</div>}>
            <RecentActivity />
          </Suspense>
        </div>
      </div>
    </AdminLayout>
  )
}
