"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, MapPin, Calendar, User, DollarSign, AlertCircle, CheckCircle, XCircle, Loader2, FileText, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminLayout from "@/components/cms/admin-layout"
import {
  getBookingMock,
  performBookingActionMock,
  addBookingNoteMock,
  fetchBookingNotesMock,
} from "@/lib/cms/api"
import type { Booking, BookingNote, BookingStatus } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

const statusConfig: Record<BookingStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  in_progress: { label: "In Progress", color: "bg-purple-100 text-purple-800" },
  completed: { label: "Completed", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-800" },
  disputed: { label: "Disputed", color: "bg-red-100 text-red-800" },
  refunded: { label: "Refunded", color: "bg-orange-100 text-orange-800" },
}

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = Number(params.id)
  
  const [booking, setBooking] = useState<Booking | null>(null)
  const [notes, setNotes] = useState<BookingNote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [newNote, setNewNote] = useState("")
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState("")

  useEffect(() => {
    loadBooking()
  }, [bookingId])

  const loadBooking = async () => {
    setIsLoading(true)
    try {
      const [bookingData, notesData] = await Promise.all([
        getBookingMock(bookingId),
        fetchBookingNotesMock(bookingId),
      ])
      setBooking(bookingData)
      setNotes(notesData)
    } catch (error) {
      console.error("Failed to load booking:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = async (action: string, reason?: string) => {
    setActionLoading(action)
    try {
      await performBookingActionMock(bookingId, { action: action as any, reason })
      await loadBooking()
    } catch (error) {
      console.error(`Failed to ${action} booking:`, error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    setActionLoading("note")
    try {
      await addBookingNoteMock(bookingId, newNote, true)
      setNewNote("")
      await loadBooking()
    } catch (error) {
      console.error("Failed to add note:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancel = async () => {
    if (!cancelReason.trim()) return
    await handleAction("cancel", cancelReason)
    setShowCancelModal(false)
    setCancelReason("")
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

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </AdminLayout>
    )
  }

  if (!booking) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Booking not found</h2>
          <p className="text-gray-600 mt-2">The booking you are looking for does not exist.</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/bookings")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookings
          </Button>
        </div>
      </AdminLayout>
    )
  }

  const status = statusConfig[booking.status]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/admin/bookings")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{booking.title}</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", status.color)}>
                  {status.label}
                </span>
                <span className="text-gray-400">|</span>
                <span>UUID: {booking.uuid}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {booking.status === "confirmed" && (
              <Button
                onClick={() => handleAction("complete")}
                disabled={actionLoading === "complete"}
              >
                {actionLoading === "complete" ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Mark Complete
              </Button>
            )}
            {(booking.status === "pending" || booking.status === "confirmed") && (
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(true)}
                disabled={actionLoading === "cancel"}
              >
                {actionLoading === "cancel" ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <XCircle className="w-4 h-4 mr-2" />
                )}
                Cancel Booking
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Date & Time</p>
                      <p className="text-sm text-gray-600">{formatDateTime(booking.start_time)}</p>
                      <p className="text-xs text-gray-400">
                        to {formatDateTime(booking.end_time)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Duration</p>
                      <p className="text-sm text-gray-600">{booking.duration_minutes} minutes</p>
                    </div>
                  </div>
                </div>
                
                {booking.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-600">{booking.location}</p>
                    </div>
                  </div>
                )}

                {booking.description && (
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Description</p>
                      <p className="text-sm text-gray-600">{booking.description}</p>
                    </div>
                  </div>
                )}

                {booking.cancellation_reason && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Cancellation Reason</p>
                      <p className="text-sm text-red-600">{booking.cancellation_reason}</p>
                      {booking.cancelled_by && (
                        <p className="text-xs text-red-400 mt-1">
                          Cancelled by: {booking.cancelled_by}
                          {booking.cancelled_at && ` on ${formatDateTime(booking.cancelled_at)}`}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Admin Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notes.length === 0 ? (
                    <p className="text-gray-500 text-sm">No notes yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {notes.map((note) => (
                        <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{note.note}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            By Admin #{note.admin_id} • {formatDateTime(note.created_at)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <Button
                      onClick={handleAddNote}
                      disabled={!newNote.trim() || actionLoading === "note"}
                    >
                      {actionLoading === "note" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Add"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Parties */}
            <Card>
              <CardHeader>
                <CardTitle>Parties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">HAGEE</p>
                    <p className="text-sm text-gray-500">User #{booking.hagee_id}</p>
                    <Link href={`/admin/users/${booking.hagee_id}`} className="text-xs text-blue-600 hover:underline">
                      View Profile
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">HAGU</p>
                    <p className="text-sm text-gray-500">User #{booking.hagu_id}</p>
                    <Link href={`/admin/users/${booking.hagu_id}`} className="text-xs text-purple-600 hover:underline">
                      View Profile
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Financial
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Price</span>
                  <span className="font-medium">{formatPrice(booking.price_cents, booking.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Platform Fee</span>
                  <span className="text-gray-600">{formatPrice(booking.platform_fee_cents, booking.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">HAGU Payout</span>
                  <span className="text-green-600 font-medium">{formatPrice(booking.hagu_payout_cents, booking.currency)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <Link href={`/admin/payments?booking_id=${booking.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Payment Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span>{formatDateTime(booking.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span>{formatDateTime(booking.updated_at)}</span>
                </div>
                {booking.completed_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed</span>
                    <span className="text-green-600">{formatDateTime(booking.completed_at)}</span>
                  </div>
                )}
                {booking.cancelled_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cancelled</span>
                    <span className="text-red-600">{formatDateTime(booking.cancelled_at)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-2">Cancel Booking</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel this booking? This action cannot be undone.
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
                <Button variant="outline" onClick={() => { setShowCancelModal(false); setCancelReason(""); }}>
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
