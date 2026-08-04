"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Eye, RefreshCw, CreditCard, Wallet, ArrowDownLeft, ArrowUpRight, AlertCircle, CheckCircle, Clock, Loader2, DollarSign, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminLayout from "@/components/cms/admin-layout"
import {
  fetchPaymentsMock,
  fetchRefundsMock,
  fetchPayoutsMock,
} from "@/lib/cms/api"
import type { Payment, Refund, Payout, PaymentStatus, PaymentMethod, TransactionType } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

type FilterStatus = "all" | PaymentStatus
type FilterType = "all" | TransactionType
type FilterMethod = "all" | PaymentMethod
type TabType = "payments" | "refunds" | "payouts"

const statusConfig: Record<PaymentStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-800", icon: RefreshCw },
  completed: { label: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle },
  failed: { label: "Failed", color: "bg-red-100 text-red-800", icon: AlertCircle },
  refunded: { label: "Refunded", color: "bg-purple-100 text-purple-800", icon: RefreshCw },
  partially_refunded: { label: "Partial Refund", color: "bg-orange-100 text-orange-800", icon: RefreshCw },
  disputed: { label: "Disputed", color: "bg-red-100 text-red-800", icon: AlertCircle },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-800", icon: AlertCircle },
}

const typeConfig: Record<TransactionType, { label: string; icon: React.ElementType }> = {
  payment: { label: "Payment", icon: CreditCard },
  refund: { label: "Refund", icon: ArrowDownLeft },
  payout: { label: "Payout", icon: Wallet },
  platform_fee: { label: "Platform Fee", icon: DollarSign },
  dispute_fee: { label: "Dispute Fee", icon: AlertCircle },
}

const methodLabels: Record<PaymentMethod, string> = {
  ideal: "iDEAL",
  card: "Credit Card",
  sepa_direct_debit: "SEPA Direct Debit",
  bancontact: "Bancontact",
  paypal: "PayPal",
}

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("payments")
  const [payments, setPayments] = useState<Payment[]>([])
  const [refunds, setRefunds] = useState<Refund[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
  const [typeFilter, setTypeFilter] = useState<FilterType>("all")
  const [methodFilter, setMethodFilter] = useState<FilterMethod>("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      if (activeTab === "payments") {
        const response = await fetchPaymentsMock({
          search: search || undefined,
          status: statusFilter,
          type: typeFilter,
          method: methodFilter,
          page,
          per_page: 20,
        })
        setPayments(response.data)
        setTotalPages(response.meta.total_pages)
      } else if (activeTab === "refunds") {
        const response = await fetchRefundsMock({
          status: statusFilter,
          page,
          per_page: 20,
        })
        setRefunds(response.data)
        setTotalPages(response.meta.total_pages)
      } else if (activeTab === "payouts") {
        const response = await fetchPayoutsMock({
          status: statusFilter,
          page,
          per_page: 20,
        })
        setPayouts(response.data)
        setTotalPages(response.meta.total_pages)
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [activeTab, search, statusFilter, typeFilter, methodFilter, page])

  useEffect(() => {
    setPage(1)
  }, [activeTab, search, statusFilter, typeFilter, methodFilter])

  useEffect(() => {
    loadData()
  }, [loadData])

  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: currency,
    }).format(cents / 100)
  }

  const formatDateTime = (isoString: string | null) => {
    if (!isoString) return "N/A"
    const date = new Date(isoString)
    return date.toLocaleString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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

  const getStatusBadge = (status: PaymentStatus) => {
    const config = statusConfig[status]
    const Icon = config.icon
    return (
      <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", config.color)}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    )
  }

  const totalPayments = payments.filter((p) => p.type === "payment" && p.status === "completed")
    .reduce((sum, p) => sum + p.amount_cents, 0)
  const totalRefunds = refunds.filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + r.amount_cents, 0)
  const totalPayouts = payouts.filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount_cents, 0)

  const renderPaymentsTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Transaction</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Method</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => {
            const typeInfo = typeConfig[payment.type]
            const TypeIcon = typeInfo.icon
            return (
              <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900">{payment.description || typeInfo.label}</p>
                    <p className="text-xs text-gray-500">{payment.uuid}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-sm">
                    <TypeIcon className="w-4 h-4 text-gray-400" />
                    {typeInfo.label}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {payment.method ? methodLabels[payment.method] : "N/A"}
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    <p className={cn(
                      "font-medium",
                      payment.type === "payment" ? "text-gray-900" : 
                      payment.type === "refund" || payment.type === "payout" ? "text-red-600" : "text-gray-600"
                    )}>
                      {payment.type === "payment" ? "+" : "-"}
                      {formatPrice(payment.amount_cents, payment.currency)}
                    </p>
                    {payment.platform_fee_cents > 0 && (
                      <p className="text-xs text-gray-400">
                        Fee: {formatPrice(payment.platform_fee_cents, payment.currency)}
                      </p>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  {getStatusBadge(payment.status)}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {formatDateTime(payment.created_at)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/payments/${payment.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  const renderRefundsTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Refund ID</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Reason</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Created</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Processed</th>
          </tr>
        </thead>
        <tbody>
          {refunds.map((refund) => (
            <tr key={refund.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <p className="font-medium text-gray-900">{refund.uuid}</p>
                <p className="text-xs text-gray-500">Payment: #{refund.payment_id}</p>
              </td>
              <td className="py-3 px-4">
                <span className="font-medium text-red-600">
                  -{formatPrice(refund.amount_cents, refund.currency)}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {refund.reason}
              </td>
              <td className="py-3 px-4">
                <span className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                  refund.status === "completed" ? "bg-green-100 text-green-800" :
                  refund.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                  refund.status === "processing" ? "bg-blue-100 text-blue-800" :
                  "bg-red-100 text-red-800"
                )}>
                  {refund.status}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {formatDate(refund.created_at)}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {refund.processed_at ? formatDate(refund.processed_at) : "Pending"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderPayoutsTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Payout ID</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Bank Account</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Processed</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map((payout) => (
            <tr key={payout.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <p className="font-medium text-gray-900">{payout.uuid}</p>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                User #{payout.user_id}
              </td>
              <td className="py-3 px-4">
                <span className="font-medium text-red-600">
                  -{formatPrice(payout.amount_cents, payout.currency)}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                  payout.status === "completed" ? "bg-green-100 text-green-800" :
                  payout.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                  payout.status === "processing" ? "bg-blue-100 text-blue-800" :
                  "bg-red-100 text-red-800"
                )}>
                  {payout.status}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {payout.bank_account_last4 ? `****${payout.bank_account_last4}` : "N/A"}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {payout.processed_at ? formatDate(payout.processed_at) : "Pending"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments & Transactions</h1>
          <p className="text-gray-600">Manage payments, refunds, and payouts</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-900">{formatPrice(totalPayments, "EUR")}</p>
                </div>
                <ArrowUpRight className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700">Total Refunds</p>
                  <p className="text-2xl font-bold text-red-900">{formatPrice(totalRefunds, "EUR")}</p>
                </div>
                <ArrowDownLeft className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Total Payouts</p>
                  <p className="text-2xl font-bold text-blue-900">{formatPrice(totalPayouts, "EUR")}</p>
                </div>
                <Wallet className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Net Revenue</p>
                  <p className="text-2xl font-bold">{formatPrice(totalPayments - totalRefunds - totalPayouts, "EUR")}</p>
                </div>
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-4">
            {[
              { id: "payments", label: "Payments", count: payments.length },
              { id: "refunds", label: "Refunds", count: refunds.length },
              { id: "payouts", label: "Payouts", count: payouts.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-[#2D1012] text-[#2D1012]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                {tab.label}
                <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              {activeTab === "payments" && (
                <>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                    <option value="disputed">Disputed</option>
                  </select>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as FilterType)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="payment">Payment</option>
                    <option value="refund">Refund</option>
                    <option value="payout">Payout</option>
                    <option value="platform_fee">Platform Fee</option>
                  </select>
                  <select
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value as FilterMethod)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Methods</option>
                    <option value="ideal">iDEAL</option>
                    <option value="card">Credit Card</option>
                    <option value="sepa_direct_debit">SEPA</option>
                    <option value="bancontact">Bancontact</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </>
              )}
              {(activeTab === "refunds" || activeTab === "payouts") && (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === "payments" && "Payment Transactions"}
              {activeTab === "refunds" && "Refund Records"}
              {activeTab === "payouts" && "Payout Records"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                {activeTab === "payments" && (payments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">No payments found</div>
                ) : renderPaymentsTable())}
                {activeTab === "refunds" && (refunds.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">No refunds found</div>
                ) : renderRefundsTable())}
                {activeTab === "payouts" && (payouts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">No payouts found</div>
                ) : renderPayoutsTable())}
              </>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
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
      </div>
    </AdminLayout>
  )
}
