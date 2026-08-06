"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Eye, CheckCircle, XCircle, RefreshCw, Clock, AlertCircle, User, FileText, Loader2, Shield, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminLayout from "@/components/cms/admin-layout"
import {
  fetchKycVerificationsMock,
  performKycActionMock,
} from "@/lib/cms/api"
import type { KycVerification, KycStatus, KycDocumentType } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

type FilterStatus = "all" | KycStatus
type FilterDocumentType = "all" | KycDocumentType

const statusConfig: Record<KycStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  in_review: { label: "In Review", color: "bg-blue-100 text-blue-800", icon: FileText },
  approved: { label: "Approved", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
  expired: { label: "Expired", color: "bg-gray-100 text-gray-800", icon: AlertCircle },
}

const documentTypeLabels: Record<KycDocumentType, string> = {
  id_card: "ID Card",
  passport: "Passport",
  drivers_license: "Driver's License",
  residence_permit: "Residence Permit",
  utility_bill: "Utility Bill",
  bank_statement: "Bank Statement",
}

export default function KycPage() {
  const [verifications, setVerifications] = useState<KycVerification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
  const [documentTypeFilter, setDocumentTypeFilter] = useState<FilterDocumentType>("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [selectedKyc, setSelectedKyc] = useState<KycVerification | null>(null)
  const [showActionModal, setShowActionModal] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | "restart" | null>(null)
  const [actionReason, setActionReason] = useState("")

  const loadVerifications = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetchKycVerificationsMock({
        search: search || undefined,
        status: statusFilter,
        document_type: documentTypeFilter,
        page,
        per_page: 20,
      })
      setVerifications(response.data)
      setTotalPages(response.meta.total_pages)
    } catch (error) {
      console.error("Failed to load KYC verifications:", error)
    } finally {
      setIsLoading(false)
    }
  }, [search, statusFilter, documentTypeFilter, page])

  useEffect(() => {
    loadVerifications()
  }, [loadVerifications])

  const handleAction = async () => {
    if (!selectedKyc || !actionType) return
    setActionLoading(selectedKyc.id)
    try {
      await performKycActionMock(selectedKyc.id, {
        action: actionType,
        reason: actionReason,
      })
      setShowActionModal(false)
      setActionReason("")
      setSelectedKyc(null)
      setActionType(null)
      await loadVerifications()
    } catch (error) {
      console.error("Failed to perform KYC action:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const openActionModal = (kyc: KycVerification, action: "approve" | "reject" | "restart") => {
    setSelectedKyc(kyc)
    setActionType(action)
    setShowActionModal(true)
  }

  const formatDate = (isoString: string | null) => {
    if (!isoString) return "N/A"
    const date = new Date(isoString)
    return date.toLocaleDateString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: KycStatus) => {
    const config = statusConfig[status]
    const Icon = config.icon
    return (
      <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", config.color)}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    )
  }

  const pendingCount = verifications.filter((v) => v.status === "pending" || v.status === "in_review").length
  const approvedCount = verifications.filter((v) => v.status === "approved").length
  const rejectedCount = verifications.filter((v) => v.status === "rejected").length

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KYC Verifications</h1>
          <p className="text-gray-600">Manage HAGU identity verifications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-700">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-900">{pendingCount}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Approved</p>
                  <p className="text-2xl font-bold text-green-900">{approvedCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700">Rejected</p>
                  <p className="text-2xl font-bold text-red-900">{rejectedCount}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{verifications.length}</p>
                </div>
                <Shield className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by user ID or name..."
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
                <option value="in_review">In Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
              <select
                value={documentTypeFilter}
                onChange={(e) => setDocumentTypeFilter(e.target.value as FilterDocumentType)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Document Types</option>
                <option value="id_card">ID Card</option>
                <option value="passport">Passport</option>
                <option value="drivers_license">Driver's License</option>
                <option value="residence_permit">Residence Permit</option>
                <option value="utility_bill">Utility Bill</option>
                <option value="bank_statement">Bank Statement</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Verifications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Verification List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : verifications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No KYC verifications found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Document</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Submitted</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Reviewed</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifications.map((kyc) => (
                      <tr key={kyc.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{kyc.full_name || `User #${kyc.user_id}`}</p>
                              <p className="text-xs text-gray-500">ID: {kyc.user_id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <p className="font-medium">{documentTypeLabels[kyc.document_type]}</p>
                            {kyc.document_number && (
                              <p className="text-xs text-gray-500">{kyc.document_number}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(kyc.status)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(kyc.submitted_at)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {kyc.reviewed_at ? (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(kyc.reviewed_at)}
                            </span>
                          ) : (
                            <span className="text-gray-400">Pending</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            {kyc.document_front_url && (
                              <a href={kyc.document_front_url} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="sm" title="View Document">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </a>
                            )}
                            {(kyc.status === "pending" || kyc.status === "in_review") && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openActionModal(kyc, "approve")}
                                  disabled={actionLoading === kyc.id}
                                >
                                  {actionLoading === kyc.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openActionModal(kyc, "reject")}
                                  disabled={actionLoading === kyc.id}
                                >
                                  {actionLoading === kyc.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  )}
                                </Button>
                              </>
                            )}
                            {kyc.status === "rejected" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openActionModal(kyc, "restart")}
                                disabled={actionLoading === kyc.id}
                              >
                                {actionLoading === kyc.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <RefreshCw className="w-4 h-4 text-blue-500" />
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
            {!isLoading && verifications.length > 0 && (
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

        {/* Action Modal */}
        {selectedKyc && showActionModal && actionType && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-2">
                {actionType === "approve" && "Approve Verification"}
                {actionType === "reject" && "Reject Verification"}
                {actionType === "restart" && "Restart Verification"}
              </h3>
              <p className="text-gray-600 mb-4">
                {actionType === "approve" && `Approve KYC verification for ${selectedKyc.full_name || `User #${selectedKyc.user_id}`}?`}
                {actionType === "reject" && `Reject KYC verification for ${selectedKyc.full_name || `User #${selectedKyc.user_id}`}?`}
                {actionType === "restart" && `Restart KYC verification process for ${selectedKyc.full_name || `User #${selectedKyc.user_id}`}?`}
              </p>
              {(actionType === "reject" || actionType === "restart") && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700">
                    {actionType === "reject" ? "Rejection Reason" : "Reason"}
                  </label>
                  <textarea
                    placeholder={actionType === "reject" ? "Enter reason for rejection..." : "Enter reason for restart..."}
                    value={actionReason}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setActionReason(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                    rows={3}
                  />
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => { setShowActionModal(false); setSelectedKyc(null); setActionType(null); setActionReason(""); }}
                >
                  Cancel
                </Button>
                <Button
                  variant="accent"
                  onClick={handleAction}
                  disabled={(actionType === "reject" && !actionReason.trim()) || actionLoading !== null}
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
