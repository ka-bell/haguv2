"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Eye, XCircle, CheckCircle, AlertCircle, Clock, RefreshCw, Calendar, Loader2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminLayout from "@/components/cms/admin-layout"
import {
  fetchBookingsMock,
  performBookingActionMock,
} from "@/lib/cms/api"
import type { Booking, BookingStatus, BookingType } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

type FilterStatus = "all" | BookingStatus
type FilterType = "all" | BookingType

const statusConfig: Record<BookingStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  in_progress: { label: "In Progress", color: "bg-purple-100 text-purple-800", icon: RefreshCw },
  completed: { label: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-800", icon: XCircle },
  disputed: { label: "Disputed", color: "bg-red-100 text-red-800", icon: AlertCircle },
  refunded: { label: "Refunded", color: "bg-orange-100 text-orange-800", icon: RefreshCw },
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
  const [typeFilter, setTypeFilter] = useState<FilterType>("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")

  const loadBookings = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetchBookingsMock({
        search: search || undefined,
        status: statusFilter,
        type: typeFilter,
        page,
        per_page: 20,
      })
      setBookings(response.data)
      setTotalPages(response.meta.total_pages)
    } catch (error) {
      console.error("Failed to load bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }, [search, statusFilter, typeFilter, page])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  const handleCancel = async () => {
    if (!selectedBooking) return
    setActionLoading(selectedBooking.id)
    try {
      await performBookingActionMock(selectedBooking.id, {
        action: "cancel",
        reason: cancelReason,
      })
      setCancelDialogOpen(false)
      setCancelReason("")
      setSelectedBooking(null)
      await loadBookings()
    } catch (error) {
      console.error("Failed to cancel booking:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleComplete = async (bookingId: number) => {
    setActionLoading(bookingId)
    try {
      await performBookingActionMock(bookingId, { action: "complete" })
      await loadBookings()
    } catch (error) {
      console.error("Failed to complete booking:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const openCancelDialog = (booking: Booking) => {
    setSelectedBooking(booking)
    setCancelDialogOpen(true)
  }

  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: currency,
    }).format(cents / 100)
  }

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: BookingStatus) => {
    const config = statusConfig[status]
    const Icon = config.icon
    return (
      <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", config.color)}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600">Manage all Hagu bookings</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by title, description or location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="disputed">Disputed</option>
                <option value="refunded">Refunded</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as FilterType)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="one_time">One Time</option>
                <option value="recurring">Recurring</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = bookings.filter((b) => b.status === status).length
            const Icon = config.icon
            return (
              <Card key={status} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter(status as FilterStatus)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{config.label}</p>
                      <p className="text-2xl font-bold">{count}</p>
                    </div>
                    <Icon className={cn("w-8 h-8", config.color.split(" ")[1])} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Booking List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No bookings found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Booking</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Parties</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">When</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{booking.title}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">{booking.description}</p>
                            {booking.location && (
                              <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" />
                                {booking.location}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <p><span className="text-gray-500">HAGEE:</span> #{booking.hagee_id}</p>
                            <p><span className="text-gray-500">HAGU:</span> #{booking.hagu_id}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600">
                            <p className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDateTime(booking.start_time)}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              {booking.duration_minutes} min
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <p className="font-medium">{formatPrice(booking.price_cents, booking.currency)}</p>
                            <p className="text-xs text-gray-400">
                              Fee: {formatPrice(booking.platform_fee_cents, booking.currency)}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(booking.status)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/bookings/${booking.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            {booking.status === "confirmed" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleComplete(booking.id)}
                                disabled={actionLoading === booking.id}
                              >
                                {actionLoading === booking.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                              </Button>
                            )}
                            {(booking.status === "pending" || booking.status === "confirmed") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openCancelDialog(booking)}
                                disabled={actionLoading === booking.id}
                              >
                                {actionLoading === booking.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && bookings.length > 0 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

          {selectedBooking && cancelDialogOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-2">Cancel Booking</h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to cancel &quot;{selectedBooking.title}&quot;?
                </p>
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700">Cancellation Reason</label>
                  <textarea
                    placeholder="Enter reason for cancellation..."
                    value={cancelReason}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCancelReason(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setCancelDialogOpen(false); setSelectedBooking(null); }}>
                    Cancel
                  </Button>
                  <Button
                    variant="accent"
                    onClick={handleCancel}
                    disabled={!cancelReason.trim() || actionLoading !== null}
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Confirm Cancellation
                  </Button>
                </div>
              </div>
            </div>
          )}
      </div>
    </AdminLayout>
  )
}
