"use client"

import { useState, useEffect } from "react"
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  UserCheck,
  MessageSquare,
  User,
  Calendar,
} from "lucide-react"
import AdminLayout from "@/components/cms/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  type SelectOption,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { fetchReportsMock, updateReportMock } from "@/lib/cms/api"
import type { Report, ReportStatus, ReportReason } from "@/lib/cms/types"

const statusOptions: SelectOption[] = [
  { value: "all", label: "All Status" },
  { value: "open", label: "Open" },
  { value: "under_review", label: "Under Review" },
  { value: "resolved", label: "Resolved" },
  { value: "dismissed", label: "Dismissed" },
]

const reasonOptions: SelectOption[] = [
  { value: "all", label: "All Reasons" },
  { value: "inappropriate_content", label: "Inappropriate Content" },
  { value: "harassment", label: "Harassment" },
  { value: "spam", label: "Spam" },
  { value: "fake_review", label: "Fake Review" },
  { value: "fraud", label: "Fraud" },
  { value: "other", label: "Other" },
]

const targetTypeIcons: Record<string, React.ReactNode> = {
  review: <MessageSquare className="w-4 h-4" />,
  profile: <User className="w-4 h-4" />,
  message: <MessageSquare className="w-4 h-4" />,
  booking: <Calendar className="w-4 h-4" />,
}

export default function ReportsPage() {
  const { toast } = useToast()
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [reasonFilter, setReasonFilter] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false)
  const [resolutionNotes, setResolutionNotes] = useState("")
  const [resolutionAction, setResolutionAction] = useState<"resolve" | "dismiss">("resolve")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load reports
  const loadReports = async () => {
    setIsLoading(true)
    try {
      const filters: { search?: string; status?: ReportStatus; reason?: ReportReason } = {}
      if (search) filters.search = search
      if (statusFilter !== "all") filters.status = statusFilter as ReportStatus
      if (reasonFilter !== "all") filters.reason = reasonFilter as ReportReason

      const response = await fetchReportsMock(filters)
      setReports(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reports",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    loadReports()
  }, [])

  // Handle resolve/dismiss
  const openResolveDialog = (report: Report, action: "resolve" | "dismiss") => {
    setSelectedReport(report)
    setResolutionAction(action)
    setResolutionNotes("")
    setIsResolveDialogOpen(true)
  }

  const handleResolve = async () => {
    if (!selectedReport) return

    setIsSubmitting(true)
    try {
      const newStatus: ReportStatus = resolutionAction === "resolve" ? "resolved" : "dismissed"
      await updateReportMock(selectedReport.id, {
        status: newStatus,
        resolution_notes: resolutionNotes,
      })
      toast({
        title: "Success",
        description: `Report ${resolutionAction}d successfully`,
      })
      setIsResolveDialogOpen(false)
      loadReports()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update report",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Status badge color
  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "under_review":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "dismissed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600">Manage user reports and content flags</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {reports.filter(r => r.status === "open" || r.status === "under_review").length} pending
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-[300px]">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadReports()}
              className="flex-1"
            />
          </div>
          <div className="w-[180px]">
            <Select
              placeholder="Filter by status"
              options={statusOptions}
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value)
                setTimeout(loadReports, 0)
              }}
            />
          </div>
          <div className="w-[180px]">
            <Select
              placeholder="Filter by reason"
              options={reasonOptions}
              value={reasonFilter}
              onChange={(value) => {
                setReasonFilter(value)
                setTimeout(loadReports, 0)
              }}
            />
          </div>
          <Button variant="outline" onClick={loadReports}>
            Search
          </Button>
        </div>

        {/* Reports Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : reports.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No reports found</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status.replace("_", " ")}
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {targetTypeIcons[report.target_type]}
                        {report.target_type}
                      </span>
                      <span className="text-xs text-gray-500">
                        Reason: {report.reason.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{report.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Reporter: User #{report.reporter_id}</span>
                      <span>Target ID: #{report.target_id}</span>
                      <span>{new Date(report.created_at).toLocaleDateString()}</span>
                    </div>
                    {report.assigned_to && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                        <UserCheck className="w-4 h-4" />
                        Assigned to Admin #{report.assigned_to}
                      </div>
                    )}
                  </div>
                </div>
                
                {(report.status === "open" || report.status === "under_review") && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReport(report)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => openResolveDialog(report, "resolve")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Resolve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600 border-gray-200 hover:bg-gray-50"
                      onClick={() => openResolveDialog(report, "dismiss")}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Dismiss
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Resolve Dialog */}
        <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {resolutionAction === "resolve" ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Resolve Report
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-gray-600" />
                    Dismiss Report
                  </>
                )}
              </DialogTitle>
              <DialogDescription>
                {resolutionAction === "resolve"
                  ? "Mark this report as resolved and take appropriate action."
                  : "Dismiss this report if no action is needed."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {selectedReport && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium">{selectedReport.reason.replace("_", " ")}</span>
                  </div>
                  <p className="text-sm text-gray-600">{selectedReport.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>Type: {selectedReport.target_type}</span>
                    <span>Target: #{selectedReport.target_id}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Resolution Notes</label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Add notes about your decision..."
                  className="mt-1 w-full min-h-[80px] px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2D1012]/20"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsResolveDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleResolve}
                disabled={isSubmitting}
                className={
                  resolutionAction === "resolve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-600 hover:bg-gray-700"
                }
              >
                {isSubmitting ? "Processing..." : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Details Dialog */}
        <Dialog open={!!selectedReport && !isResolveDialogOpen} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Report Details</DialogTitle>
            </DialogHeader>
            {selectedReport && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                    {selectedReport.status.replace("_", " ")}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {targetTypeIcons[selectedReport.target_type]}
                    {selectedReport.target_type}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-lg">{selectedReport.reason.replace("_", " ")}</h3>
                  <p className="text-gray-700 mt-2">{selectedReport.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Reporter:</span>
                    <p className="font-medium">User #{selectedReport.reporter_id}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Target Type:</span>
                    <p className="font-medium capitalize">{selectedReport.target_type}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Target ID:</span>
                    <p className="font-medium">#{selectedReport.target_id}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <p className="font-medium">
                      {new Date(selectedReport.created_at).toLocaleString()}
                    </p>
                  </div>
                  {selectedReport.assigned_to && (
                    <div>
                      <span className="text-gray-500">Assigned To:</span>
                      <p className="font-medium">Admin #{selectedReport.assigned_to}</p>
                    </div>
                  )}
                </div>

                {selectedReport.resolution_notes && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Resolution Notes</p>
                    <p className="text-sm text-green-700">
                      {selectedReport.resolution_notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
