"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Filter, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminLayout from "@/components/cms/admin-layout"
import type { AuditLogEntry, AuditAction } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

// Mock audit log data
const MOCK_AUDIT_LOG: AuditLogEntry[] = [
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
    created_at: "2024-01-20T09:00:00Z",
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
    created_at: "2024-01-18T12:00:00Z",
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
    created_at: "2024-01-19T14:30:00Z",
  },
  {
    id: 4,
    action: "USER_CREATED",
    actor_id: 1,
    actor_email: "admin@hagu.app",
    actor_role: "ADMIN",
    target_type: "user",
    target_id: 5,
    target_email: "eve@example.com",
    details: { role: "HAGEE" },
    ip_address: "192.168.1.1",
    user_agent: "Mozilla/5.0",
    created_at: "2024-01-17T10:00:00Z",
  },
  {
    id: 5,
    action: "USER_ACTIVATED",
    actor_id: 1,
    actor_email: "admin@hagu.app",
    actor_role: "ADMIN",
    target_type: "user",
    target_id: 3,
    target_email: "charlie@example.com",
    details: {},
    ip_address: "192.168.1.1",
    user_agent: "Mozilla/5.0",
    created_at: "2024-01-16T15:00:00Z",
  },
  {
    id: 6,
    action: "PASSWORD_RESET_SENT",
    actor_id: 1,
    actor_email: "admin@hagu.app",
    actor_role: "SUPPORT",
    target_type: "user",
    target_id: 4,
    target_email: "diana@example.com",
    details: {},
    ip_address: "192.168.1.1",
    user_agent: "Mozilla/5.0",
    created_at: "2024-01-15T11:30:00Z",
  },
]

const actionLabels: Record<AuditAction, string> = {
  USER_CREATED: "User Created",
  USER_UPDATED: "User Updated",
  USER_SUSPENDED: "User Suspended",
  USER_ACTIVATED: "User Activated",
  USER_DELETED: "User Deleted",
  USER_IMPERSONATED: "User Impersonated",
  PASSWORD_RESET_SENT: "Password Reset Sent",
  ADMIN_LOGIN: "Admin Login",
  ADMIN_LOGOUT: "Admin Logout",
  SETTINGS_UPDATED: "Settings Updated",
}

const actionColors: Record<AuditAction, string> = {
  USER_CREATED: "bg-green-100 text-green-800",
  USER_UPDATED: "bg-blue-100 text-blue-800",
  USER_SUSPENDED: "bg-red-100 text-red-800",
  USER_ACTIVATED: "bg-green-100 text-green-800",
  USER_DELETED: "bg-gray-100 text-gray-800",
  USER_IMPERSONATED: "bg-purple-100 text-purple-800",
  PASSWORD_RESET_SENT: "bg-yellow-100 text-yellow-800",
  ADMIN_LOGIN: "bg-blue-100 text-blue-800",
  ADMIN_LOGOUT: "bg-gray-100 text-gray-800",
  SETTINGS_UPDATED: "bg-orange-100 text-orange-800",
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOG)
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState<AuditAction | "all">("all")

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      search === "" ||
      log.actor_email.toLowerCase().includes(search.toLowerCase()) ||
      log.target_email?.toLowerCase().includes(search.toLowerCase())
    const matchesAction = actionFilter === "all" || log.action === actionFilter
    return matchesSearch && matchesAction
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
          <p className="text-gray-600">Track all admin actions and system events</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value as AuditAction | "all")}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Actions</option>
                {Object.entries(actionLabels).map(([action, label]) => (
                  <option key={action} value={action}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Table */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No audit log entries found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Action</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actor</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Target</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Details</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              actionColors[log.action]
                            )}
                          >
                            {actionLabels[log.action]}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{log.actor_email}</p>
                            <p className="text-xs text-gray-500">{log.actor_role}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {log.target_email ? (
                            <div>
                              <p className="text-sm text-gray-900">{log.target_email}</p>
                              <p className="text-xs text-gray-500">{log.target_type}</p>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
