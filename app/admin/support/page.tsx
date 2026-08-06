"use client"

import { useState, useEffect } from "react"
import {
  Ticket,
  Clock,
  AlertCircle,
  CheckCircle,
  Search,
  MessageSquare,
  UserCheck,
  Filter,
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
import { fetchSupportTicketsMock, updateSupportTicketMock } from "@/lib/cms/api"
import type { SupportTicket, SupportTicketStatus, SupportTicketPriority } from "@/lib/cms/types"

const statusOptions: SelectOption[] = [
  { value: "all", label: "All Status" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "waiting", label: "Waiting" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
]

const priorityOptions: SelectOption[] = [
  { value: "all", label: "All Priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
]

const categoryOptions: SelectOption[] = [
  { value: "", label: "All Categories" },
  { value: "technical", label: "Technical" },
  { value: "payment", label: "Payment" },
  { value: "account", label: "Account" },
  { value: "booking", label: "Booking" },
  { value: "other", label: "Other" },
]

export default function SupportPage() {
  const { toast } = useToast()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<SupportTicketStatus>("open")
  const [replyMessage, setReplyMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load tickets
  const loadTickets = async () => {
    setIsLoading(true)
    try {
      const filters: { search?: string; status?: SupportTicketStatus; priority?: SupportTicketPriority; category?: string } = {}
      if (search) filters.search = search
      if (statusFilter !== "all") filters.status = statusFilter as SupportTicketStatus
      if (priorityFilter !== "all") filters.priority = priorityFilter as SupportTicketPriority
      if (categoryFilter) filters.category = categoryFilter

      const response = await fetchSupportTicketsMock(filters)
      setTickets(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tickets",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    loadTickets()
  }, [])

  // Handle status update
  const openUpdateDialog = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    setNewStatus(ticket.status)
    setReplyMessage("")
    setIsUpdateDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!selectedTicket) return

    setIsSubmitting(true)
    try {
      await updateSupportTicketMock(selectedTicket.id, { status: newStatus })
      toast({
        title: "Success",
        description: "Ticket updated successfully",
      })
      setIsUpdateDialogOpen(false)
      loadTickets()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Status badge color
  const getStatusColor = (status: SupportTicketStatus) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "waiting":
        return "bg-purple-100 text-purple-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Priority badge color
  const getPriorityColor = (priority: SupportTicketPriority) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-700"
      case "medium":
        return "bg-blue-100 text-blue-700"
      case "high":
        return "bg-orange-100 text-orange-700"
      case "urgent":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
            <p className="text-gray-600">Manage customer support requests</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {tickets.filter(t => t.status === "open" || t.status === "in_progress").length} active
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Ticket className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Open</p>
                <p className="text-2xl font-bold">{tickets.filter(t => t.status === "open").length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold">{tickets.filter(t => t.status === "in_progress").length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Urgent</p>
                <p className="text-2xl font-bold">{tickets.filter(t => t.priority === "urgent" && t.status !== "closed" && t.status !== "resolved").length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Resolved</p>
                <p className="text-2xl font-bold">{tickets.filter(t => t.status === "resolved" || t.status === "closed").length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-[300px]">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadTickets()}
              className="flex-1"
            />
          </div>
          <div className="w-[150px]">
            <Select
              placeholder="Status"
              options={statusOptions}
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value)
                setTimeout(loadTickets, 0)
              }}
            />
          </div>
          <div className="w-[150px]">
            <Select
              placeholder="Priority"
              options={priorityOptions}
              value={priorityFilter}
              onChange={(value) => {
                setPriorityFilter(value)
                setTimeout(loadTickets, 0)
              }}
            />
          </div>
          <div className="w-[150px]">
            <Select
              placeholder="Category"
              options={categoryOptions}
              value={categoryFilter}
              onChange={(value) => {
                setCategoryFilter(value)
                setTimeout(loadTickets, 0)
              }}
            />
          </div>
          <Button variant="outline" onClick={loadTickets}>
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Tickets Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : tickets.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No tickets found</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace("_", " ")}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                        {ticket.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{ticket.subject}</h3>
                    <p className="text-gray-700 text-sm mb-3">{ticket.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>User #{ticket.user_id}</span>
                      <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                    {ticket.assigned_to && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                        <UserCheck className="w-4 h-4" />
                        Assigned to Admin #{ticket.assigned_to}
                      </div>
                    )}
                  </div>
                </div>
                
                {ticket.status !== "closed" && ticket.status !== "resolved" && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openUpdateDialog(ticket)}
                    >
                      Update Status
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => openUpdateDialog(ticket)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Resolve
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Update Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Ticket Status</DialogTitle>
              <DialogDescription>
                Change the status of this support ticket.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {selectedTicket && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">{selectedTicket.subject}</h4>
                  <p className="text-sm text-gray-600 mt-1">{selectedTicket.description}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">New Status</label>
                <div className="w-full mt-1">
                  <Select
                    placeholder="Select status"
                    options={statusOptions.filter(o => o.value !== "all")}
                    value={newStatus}
                    onChange={(value) => setNewStatus(value as SupportTicketStatus)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Reply Message (Optional)</label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Add a message to the user..."
                  className="mt-1 w-full min-h-[80px] px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2D1012]/20"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUpdateDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Details Dialog */}
        <Dialog open={!!selectedTicket && !isUpdateDialogOpen} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Ticket Details</DialogTitle>
            </DialogHeader>
            {selectedTicket && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status.replace("_", " ")}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                    {selectedTicket.category}
                  </span>
                </div>

                <h3 className="font-semibold text-lg">{selectedTicket.subject}</h3>
                <p className="text-gray-700">{selectedTicket.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">User:</span>
                    <p className="font-medium">User #{selectedTicket.user_id}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <p className="font-medium capitalize">{selectedTicket.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <p className="font-medium">
                      {new Date(selectedTicket.created_at).toLocaleString()}
                    </p>
                  </div>
                  {selectedTicket.assigned_to && (
                    <div>
                      <span className="text-gray-500">Assigned To:</span>
                      <p className="font-medium">Admin #{selectedTicket.assigned_to}</p>
                    </div>
                  )}
                </div>

                {selectedTicket.resolution_notes && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Resolution Notes</p>
                    <p className="text-sm text-green-700">
                      {selectedTicket.resolution_notes}
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
