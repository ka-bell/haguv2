"use client"

import { useState, useEffect } from "react"
import { Activity, UserCheck, UserX, UserCog, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AuditLogEntry } from "@/lib/cms/types"

const MOCK_RECENT_ACTIVITY: AuditLogEntry[] = [
  {
    id: 1,
    action: "ADMIN_LOGIN",
    actor_id: 1,
    actor_email: "admin@hagu.app",
    actor_role: "SUPER_ADMIN",
    target_type: "admin",
    target_id: 1,
    target_email: "admin@hagu.app",
    details: { ip: "192.168.1.1" },
    ip_address: "192.168.1.1",
    user_agent: "Mozilla/5.0",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    action: "USER_SUSPENDED",
    actor_id: 1,
    actor_email: "admin@hagu.app",
    actor_role: "SUPER_ADMIN",
    target_type: "user",
    target_id: 3,
    target_email: "charlie@example.com",
    details: { reason: "Violation of terms of service" },
    ip_address: "192.168.1.1",
    user_agent: "Mozilla/5.0",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 3,
    action: "USER_IMPERSONATED",
    actor_id: 1,
    actor_email: "admin@hagu.app",
    actor_role: "SUPER_ADMIN",
    target_type: "user",
    target_id: 2,
    target_email: "bob@example.com",
    details: {},
    ip_address: "192.168.1.1",
    user_agent: "Mozilla/5.0",
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
]

const actionIcons: Record<string, React.ReactNode> = {
  USER_CREATED: <UserCheck className="w-4 h-4 text-green-500" />,
  USER_UPDATED: <UserCog className="w-4 h-4 text-blue-500" />,
  USER_SUSPENDED: <UserX className="w-4 h-4 text-red-500" />,
  USER_ACTIVATED: <UserCheck className="w-4 h-4 text-green-500" />,
  USER_DELETED: <UserX className="w-4 h-4 text-gray-500" />,
  USER_IMPERSONATED: <UserCog className="w-4 h-4 text-purple-500" />,
  PASSWORD_RESET_SENT: <Activity className="w-4 h-4 text-yellow-500" />,
  ADMIN_LOGIN: <Activity className="w-4 h-4 text-blue-500" />,
  ADMIN_LOGOUT: <Activity className="w-4 h-4 text-gray-500" />,
  SETTINGS_UPDATED: <Activity className="w-4 h-4 text-orange-500" />,
}

const actionDescriptions: Record<string, (log: AuditLogEntry) => string> = {
  USER_CREATED: (log) => `Created user ${log.target_email}`,
  USER_UPDATED: (log) => `Updated user ${log.target_email}`,
  USER_SUSPENDED: (log) => `Suspended user ${log.target_email}`,
  USER_ACTIVATED: (log) => `Activated user ${log.target_email}`,
  USER_DELETED: (log) => `Deleted user ${log.target_email}`,
  USER_IMPERSONATED: (log) => `Impersonated user ${log.target_email}`,
  PASSWORD_RESET_SENT: (log) => `Sent password reset to ${log.target_email}`,
  ADMIN_LOGIN: () => "Logged in",
  ADMIN_LOGOUT: () => "Logged out",
  SETTINGS_UPDATED: () => "Updated settings",
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default function RecentActivity() {
  const [activities] = useState<AuditLogEntry[]>(MOCK_RECENT_ACTIVITY)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  {actionIcons[activity.action] || (
                    <Activity className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.actor_email}</span>{" "}
                    {actionDescriptions[activity.action]?.(activity) || activity.action}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTimeAgo(activity.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
