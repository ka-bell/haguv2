"use client"

import { useState, useEffect } from "react"
import {
  Star,
  Flag,
  CheckCircle,
  XCircle,
  Search,
  Eye,
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
import { fetchReviewsMock, moderateReviewMock } from "@/lib/cms/api"
import type { Review, ReviewStatus, ModerationActionRequest } from "@/lib/cms/types"

const statusOptions: SelectOption[] = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
]

const flaggedOptions: SelectOption[] = [
  { value: "all", label: "All Reviews" },
  { value: "flagged", label: "Flagged" },
  { value: "unflagged", label: "Not Flagged" },
]

export default function ReviewsPage() {
  const { toast } = useToast()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [flaggedFilter, setFlaggedFilter] = useState<string>("all")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isModerateDialogOpen, setIsModerateDialogOpen] = useState(false)
  const [moderationNotes, setModerationNotes] = useState("")
  const [moderationAction, setModerationAction] = useState<"approve" | "reject" | "flag">("approve")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load reviews
  const loadReviews = async () => {
    setIsLoading(true)
    try {
      const filters: { search?: string; status?: ReviewStatus; is_flagged?: boolean } = {}
      if (search) filters.search = search
      if (statusFilter !== "all") filters.status = statusFilter as ReviewStatus
      if (flaggedFilter === "flagged") filters.is_flagged = true
      if (flaggedFilter === "unflagged") filters.is_flagged = false

      const response = await fetchReviewsMock(filters)
      setReviews(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    loadReviews()
  }, [])

  // Handle search
  const handleSearch = () => {
    loadReviews()
  }

  // Open moderate dialog
  const openModerateDialog = (review: Review, action: "approve" | "reject" | "flag") => {
    setSelectedReview(review)
    setModerationAction(action)
    setModerationNotes("")
    setIsModerateDialogOpen(true)
  }

  // Handle moderate
  const handleModerate = async () => {
    if (!selectedReview) return

    setIsSubmitting(true)
    try {
      const action: ModerationActionRequest = {
        action: moderationAction,
        notes: moderationNotes,
      }
      await moderateReviewMock(selectedReview.id, action)
      toast({
        title: "Success",
        description: `Review ${moderationAction}d successfully`,
      })
      setIsModerateDialogOpen(false)
      loadReviews()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to moderate review",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  // Status badge color
  const getStatusColor = (status: ReviewStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
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
            <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
            <p className="text-gray-600">Moderate and manage user reviews</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-[300px]">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
                setTimeout(loadReviews, 0)
              }}
            />
          </div>
          <div className="w-[180px]">
            <Select
              placeholder="Filter by flag"
              options={flaggedOptions}
              value={flaggedFilter}
              onChange={(value) => {
                setFlaggedFilter(value)
                setTimeout(loadReviews, 0)
              }}
            />
          </div>
          <Button variant="outline" onClick={handleSearch}>
            Search
          </Button>
        </div>

        {/* Reviews Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : reviews.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No reviews found</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {reviews.map((review) => (
              <Card key={review.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {renderStars(review.rating)}
                      {review.title && (
                        <span className="font-semibold text-gray-900 truncate">
                          {review.title}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm mb-3">{review.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Hagee: User #{review.hagee_id}</span>
                      <span>Hagu: User #{review.hagu_id}</span>
                      <span>{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                    {review.is_flagged && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <Flag className="w-3 h-3" />
                        Flagged
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedReview(review)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  {review.status !== "approved" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => openModerateDialog(review, "approve")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  )}
                  {review.status !== "rejected" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => openModerateDialog(review, "reject")}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  )}
                  {!review.is_flagged ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                      onClick={() => openModerateDialog(review, "flag")}
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Flag
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModerateDialog(review, "approve")}
                    >
                      <Flag className="w-4 h-4 mr-2 text-green-600" />
                      Unflag
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Moderate Dialog */}
        <Dialog open={isModerateDialogOpen} onOpenChange={setIsModerateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {moderationAction === "approve" && (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    {selectedReview?.is_flagged ? "Unflag Review" : "Approve Review"}
                  </>
                )}
                {moderationAction === "reject" && (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    Reject Review
                  </>
                )}
                {moderationAction === "flag" && (
                  <>
                    <Flag className="w-5 h-5 text-yellow-600" />
                    Flag Review
                  </>
                )}
              </DialogTitle>
              <DialogDescription>
                {moderationAction === "approve" &&
                  "This review will be visible to all users."}
                {moderationAction === "reject" &&
                  "This review will be hidden from users."}
                {moderationAction === "flag" &&
                  "This review will be flagged for further investigation."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {selectedReview && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{selectedReview.title || "Untitled"}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedReview.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {renderStars(selectedReview.rating)}
                    <span className="text-sm text-gray-500">
                      by User #{selectedReview.hagee_id}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Moderation Notes</label>
                <textarea
                  value={moderationNotes}
                  onChange={(e) => setModerationNotes(e.target.value)}
                  placeholder="Add notes about this moderation action..."
                  className="mt-1 w-full min-h-[80px] px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2D1012]/20"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsModerateDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleModerate}
                disabled={isSubmitting}
                className={
                  moderationAction === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : moderationAction === "reject"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-yellow-600 hover:bg-yellow-700"
                }
              >
                {isSubmitting ? "Processing..." : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Details Dialog */}
        <Dialog open={!!selectedReview && !isModerateDialogOpen} onOpenChange={() => setSelectedReview(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Review Details</DialogTitle>
            </DialogHeader>
            {selectedReview && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {renderStars(selectedReview.rating)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReview.status)}`}>
                    {selectedReview.status}
                  </span>
                  {selectedReview.is_flagged && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Flagged
                    </span>
                  )}
                </div>

                {selectedReview.title && (
                  <h3 className="font-semibold text-lg">{selectedReview.title}</h3>
                )}
                <p className="text-gray-700">{selectedReview.content}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Hagee:</span>
                    <p className="font-medium">User #{selectedReview.hagee_id}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Hagu:</span>
                    <p className="font-medium">User #{selectedReview.hagu_id}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <p className="font-medium">
                      {new Date(selectedReview.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Booking:</span>
                    <p className="font-medium">#{selectedReview.booking_id}</p>
                  </div>
                </div>

                {selectedReview.moderation_notes && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">Moderation Notes</p>
                    <p className="text-sm text-yellow-700">
                      {selectedReview.moderation_notes}
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
