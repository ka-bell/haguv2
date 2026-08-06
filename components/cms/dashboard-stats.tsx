"use client"

import { useEffect, useState } from "react"
import { Users, UserCheck, UserX, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardStatsMock, type DashboardStats } from "@/lib/cms/api"

const statCards = [
  {
    title: "Total Users",
    icon: Users,
    key: "total_users" as keyof DashboardStats,
    color: "bg-blue-500",
  },
  {
    title: "HAGEE Users",
    icon: UserCheck,
    key: "total_hagee" as keyof DashboardStats,
    color: "bg-green-500",
  },
  {
    title: "HAGU Providers",
    icon: UserCheck,
    key: "total_hagu" as keyof DashboardStats,
    color: "bg-purple-500",
  },
  {
    title: "Active Today",
    icon: Clock,
    key: "active_users_today" as keyof DashboardStats,
    color: "bg-orange-500",
  },
]

export default function DashboardStatsComponent() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStatsMock()
        setStats(data)
      } catch (error) {
        console.error("Failed to load stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return <div className="text-gray-500">Failed to load statistics</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card) => (
        <Card key={card.key}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <div className={`${card.color} p-2 rounded-lg`}>
              <card.icon className="w-4 h-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats[card.key]}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
