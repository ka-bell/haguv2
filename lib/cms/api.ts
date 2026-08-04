/**
 * Hagu CMS - API Client
 * 
 * Centralized API client for the CMS admin endpoints.
 * Communicates with the Hagu API backend.
 */

import {
  type AdminUser,
  type AdminSession,
  type User,
  type UserFilters,
  type AuditLogEntry,
  type AuditLogFilters,
  type PaginatedResponse,
  type LoginCredentials,
  type PasswordResetRequest,
  type PasswordResetConfirm,
  type ImpersonateResponse,
  type DashboardStats,
  type ApiError,
  type Booking,
  type BookingFilters,
  type BookingAction,
  type BookingNote,
  type KycVerification,
  type KycFilters,
  type KycAction,
  type Payment,
  type PaymentFilters,
  type Refund,
  type RefundRequest,
  type Payout,
  type PayoutRequest,
  type Dispute,
  type DisputeFilters,
  type DisputeResolution,
} from "./types"

// API base URL - configure via env
const API_BASE_URL = process.env.NEXT_PUBLIC_CMS_API_URL || "http://localhost:8000/api/v1"

// Storage keys
const AUTH_TOKEN_KEY = "hagu_cms_token"
const ADMIN_SESSION_KEY = "hagu_cms_session"

// ============================================================================
// Storage utilities
// ============================================================================

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function removeAuthToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(ADMIN_SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setAdminSession(session: AdminSession): void {
  if (typeof window === "undefined") return
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session))
}

export function removeAdminSession(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(ADMIN_SESSION_KEY)
}

export function clearAuth(): void {
  removeAuthToken()
  removeAdminSession()
}

// ============================================================================
// Request utilities
// ============================================================================

function buildHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
  
  const token = getAuthToken()
  if (token) {
    headers["Authorization"] = "Bearer " + token
  }
  
  return headers
}

async function parseError(response: Response): Promise<ApiError> {
  try {
    const data = await response.json()
    return {
      message: data.message || "HTTP " + response.status + ": " + response.statusText,
      errors: data.errors,
      code: data.code,
    }
  } catch {
    return {
      message: "HTTP " + response.status + ": " + response.statusText,
    }
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = API_BASE_URL + endpoint
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...buildHeaders(),
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    const error = await parseError(response)
    throw new Error(error.message)
  }
  
  if (response.status === 204) {
    return {} as T
  }
  
  return response.json()
}

// ============================================================================
// Auth API
// ============================================================================

export async function loginAdmin(credentials: LoginCredentials): Promise<{
  token: string
  user: AdminUser
}> {
  const response = await apiRequest<{
    data: { token: string; user: AdminUser }
  }>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
  
  return {
    token: response.data.token,
    user: response.data.user,
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await apiRequest("/admin/auth/logout", { method: "POST" })
  } finally {
    clearAuth()
  }
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  try {
    const response = await apiRequest<{ data: AdminUser }>("/admin/auth/me")
    return response.data
  } catch {
    return null
  }
}

export async function requestPasswordReset(
  data: PasswordResetRequest
): Promise<void> {
  await apiRequest("/admin/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function resetPassword(data: PasswordResetConfirm): Promise<void> {
  await apiRequest("/admin/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// ============================================================================
// Users API
// ============================================================================

export async function fetchUsers(
  filters: UserFilters = {}
): Promise<PaginatedResponse<User>> {
  const params = new URLSearchParams()
  
  if (filters.search) params.set("search", filters.search)
  if (filters.role && filters.role !== "all") params.set("role", filters.role)
  if (filters.status && filters.status !== "all") params.set("status", filters.status)
  if (filters.date_from) params.set("date_from", filters.date_from)
  if (filters.date_to) params.set("date_to", filters.date_to)
  params.set("page", String(filters.page ?? 1))
  params.set("per_page", String(filters.per_page ?? 20))
  
  const response = await apiRequest<{ data: PaginatedResponse<User> }>(
    "/admin/users?" + params.toString()
  )
  
  return response.data
}

export async function getUser(userId: number): Promise<User> {
  const response = await apiRequest<{ data: User }>("/admin/users/" + userId)
  return response.data
}

export async function suspendUser(userId: number, reason?: string): Promise<void> {
  await apiRequest("/admin/users/" + userId + "/suspend", {
    method: "POST",
    body: JSON.stringify({ reason }),
  })
}

export async function activateUser(userId: number): Promise<void> {
  await apiRequest("/admin/users/" + userId + "/activate", {
    method: "POST",
  })
}

export async function sendUserPasswordReset(userId: number): Promise<void> {
  await apiRequest("/admin/users/" + userId + "/reset-password", {
    method: "POST",
  })
}

export async function impersonateUser(userId: number): Promise<ImpersonateResponse> {
  const response = await apiRequest<{ data: ImpersonateResponse }>(
    "/admin/users/" + userId + "/impersonate",
    { method: "POST" }
  )
  return response.data
}

export async function stopImpersonation(originalToken: string): Promise<void> {
  setAuthToken(originalToken)
}

// ============================================================================
// Audit Log API
// ============================================================================

export async function fetchAuditLog(
  filters: AuditLogFilters = {}
): Promise<PaginatedResponse<AuditLogEntry>> {
  const params = new URLSearchParams()
  
  if (filters.action && filters.action !== "all") {
    params.set("action", filters.action)
  }
  if (filters.actor_email) params.set("actor_email", filters.actor_email)
  if (filters.date_from) params.set("date_from", filters.date_from)
  if (filters.date_to) params.set("date_to", filters.date_to)
  params.set("page", String(filters.page ?? 1))
  params.set("per_page", String(filters.per_page ?? 50))
  
  const response = await apiRequest<{ data: PaginatedResponse<AuditLogEntry> }>(
    "/admin/audit-log?" + params.toString()
  )
  
  return response.data
}

// ============================================================================
// Dashboard API
// ============================================================================

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await apiRequest<{ data: DashboardStats }>("/admin/dashboard/stats")
  return response.data
}

// ============================================================================
// Bookings API
// ============================================================================

export async function fetchBookings(
  filters: BookingFilters = {}
): Promise<PaginatedResponse<Booking>> {
  const params = new URLSearchParams()
  
  if (filters.search) params.set("search", filters.search)
  if (filters.status && filters.status !== "all") params.set("status", filters.status)
  if (filters.type && filters.type !== "all") params.set("type", filters.type)
  if (filters.hagee_id) params.set("hagee_id", String(filters.hagee_id))
  if (filters.hagu_id) params.set("hagu_id", String(filters.hagu_id))
  if (filters.date_from) params.set("date_from", filters.date_from)
  if (filters.date_to) params.set("date_to", filters.date_to)
  params.set("page", String(filters.page ?? 1))
  params.set("per_page", String(filters.per_page ?? 20))
  
  const response = await apiRequest<{ data: PaginatedResponse<Booking> }>(
    "/admin/bookings?" + params.toString()
  )
  
  return response.data
}

export async function getBooking(bookingId: number): Promise<Booking> {
  const response = await apiRequest<{ data: Booking }>("/admin/bookings/" + bookingId)
  return response.data
}

export async function performBookingAction(
  bookingId: number,
  action: BookingAction
): Promise<Booking> {
  const response = await apiRequest<{ data: Booking }>(
    "/admin/bookings/" + bookingId + "/actions",
    {
      method: "POST",
      body: JSON.stringify(action),
    }
  )
  return response.data
}

export async function fetchBookingNotes(bookingId: number): Promise<BookingNote[]> {
  const response = await apiRequest<{ data: BookingNote[] }>(
    "/admin/bookings/" + bookingId + "/notes"
  )
  return response.data
}

export async function addBookingNote(
  bookingId: number,
  note: string,
  isInternal = true
): Promise<BookingNote> {
  const response = await apiRequest<{ data: BookingNote }>(
    "/admin/bookings/" + bookingId + "/notes",
    {
      method: "POST",
      body: JSON.stringify({ note, is_internal: isInternal }),
    }
  )
  return response.data
}

// ============================================================================
// KYC API
// ============================================================================

export async function fetchKycVerifications(
  filters: KycFilters = {}
): Promise<PaginatedResponse<KycVerification>> {
  const params = new URLSearchParams()
  
  if (filters.search) params.set("search", filters.search)
  if (filters.status && filters.status !== "all") params.set("status", filters.status)
  if (filters.document_type && filters.document_type !== "all") params.set("document_type", filters.document_type)
  params.set("page", String(filters.page ?? 1))
  params.set("per_page", String(filters.per_page ?? 20))
  
  const response = await apiRequest<{ data: PaginatedResponse<KycVerification> }>(
    "/admin/kyc?" + params.toString()
  )
  
  return response.data
}

export async function getKycVerification(kycId: number): Promise<KycVerification> {
  const response = await apiRequest<{ data: KycVerification }>("/admin/kyc/" + kycId)
  return response.data
}

export async function performKycAction(
  kycId: number,
  action: KycAction
): Promise<KycVerification> {
  const response = await apiRequest<{ data: KycVerification }>(
    "/admin/kyc/" + kycId + "/actions",
    {
      method: "POST",
      body: JSON.stringify(action),
    }
  )
  return response.data
}

// ============================================================================
// Payments API
// ============================================================================

export async function fetchPayments(
  filters: PaymentFilters = {}
): Promise<PaginatedResponse<Payment>> {
  const params = new URLSearchParams()
  
  if (filters.search) params.set("search", filters.search)
  if (filters.status && filters.status !== "all") params.set("status", filters.status)
  if (filters.type && filters.type !== "all") params.set("type", filters.type)
  if (filters.method && filters.method !== "all") params.set("method", filters.method)
  if (filters.user_id) params.set("user_id", String(filters.user_id))
  if (filters.booking_id) params.set("booking_id", String(filters.booking_id))
  if (filters.date_from) params.set("date_from", filters.date_from)
  if (filters.date_to) params.set("date_to", filters.date_to)
  params.set("page", String(filters.page ?? 1))
  params.set("per_page", String(filters.per_page ?? 20))
  
  const response = await apiRequest<{ data: PaginatedResponse<Payment> }>(
    "/admin/payments?" + params.toString()
  )
  
  return response.data
}

export async function getPayment(paymentId: number): Promise<Payment> {
  const response = await apiRequest<{ data: Payment }>("/admin/payments/" + paymentId)
  return response.data
}

export async function createRefund(data: RefundRequest): Promise<Refund> {
  const response = await apiRequest<{ data: Refund }>("/admin/payments/refunds", {
    method: "POST",
    body: JSON.stringify(data),
  })
  return response.data
}

export async function fetchRefunds(
  filters: { status?: string; page?: number; per_page?: number } = {}
): Promise<PaginatedResponse<Refund>> {
  const params = new URLSearchParams()
  if (filters.status && filters.status !== "all") params.set("status", filters.status)
  params.set("page", String(filters.page ?? 1))
  params.set("per_page", String(filters.per_page ?? 20))
  
  const response = await apiRequest<{ data: PaginatedResponse<Refund> }>(
    "/admin/payments/refunds?" + params.toString()
  )
  return response.data
}

export async function fetchPayouts(
  filters: { status?: string; user_id?: number; page?: number; per_page?: number } = {}
): Promise<PaginatedResponse<Payout>> {
  const params = new URLSearchParams()
  if (filters.status && filters.status !== "all") params.set("status", filters.status)
  if (filters.user_id) params.set("user_id", String(filters.user_id))
  params.set("page", String(filters.page ?? 1))
  params.set("per_page", String(filters.per_page ?? 20))
  
  const response = await apiRequest<{ data: PaginatedResponse<Payout> }>(
    "/admin/payments/payouts?" + params.toString()
  )
  return response.data
}

export async function createPayout(data: PayoutRequest): Promise<Payout> {
  const response = await apiRequest<{ data: Payout }>("/admin/payments/payouts", {
    method: "POST",
    body: JSON.stringify(data),
  })
  return response.data
}

// ============================================================================
// Disputes API
// ============================================================================

export async function fetchDisputes(
  filters: DisputeFilters = {}
): Promise<PaginatedResponse<Dispute>> {
  const params = new URLSearchParams()
  
  if (filters.search) params.set("search", filters.search)
  if (filters.status && filters.status !== "all") params.set("status", filters.status)
  if (filters.reason && filters.reason !== "all") params.set("reason", filters.reason)
  params.set("page", String(filters.page ?? 1))
  params.set("per_page", String(filters.per_page ?? 20))
  
  const response = await apiRequest<{ data: PaginatedResponse<Dispute> }>(
    "/admin/disputes?" + params.toString()
  )
  
  return response.data
}

export async function getDispute(disputeId: number): Promise<Dispute> {
  const response = await apiRequest<{ data: Dispute }>("/admin/disputes/" + disputeId)
  return response.data
}

export async function resolveDispute(
  disputeId: number,
  resolution: DisputeResolution
): Promise<Dispute> {
  const response = await apiRequest<{ data: Dispute }>(
    "/admin/disputes/" + disputeId + "/resolve",
    {
      method: "POST",
      body: JSON.stringify(resolution),
    }
  )
  return response.data
}

// ============================================================================
// Mock API implementations (for development before backend is ready)
// ============================================================================

async function mockDelay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const MOCK_ADMIN: AdminUser = {
  id: 1,
  email: "admin@hagu.app",
  first_name: "Super",
  last_name: "Admin",
  role: "SUPER_ADMIN",
  permissions: [],
  is_super_admin: true,
  last_login_at: new Date().toISOString(),
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
}

const MOCK_USERS: User[] = [
  {
    id: 1,
    uuid: "usr-001",
    email: "alice@example.com",
    first_name: "Alice",
    last_name: "Johnson",
    role: "HAGEE",
    status: "active",
    email_verified_at: "2024-01-15T10:00:00Z",
    profile: {
      id: 1,
      user_id: 1,
      type: "hagee",
      photo_url: null,
      bio: "Looking for companionship",
      tagline: "Friendly and outgoing",
      date_of_birth: "1990-05-15",
      phone: null,
      is_verified: true,
      kyc_status: "verified",
      response_time_label: "Usually responds in 1 hour",
    },
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    last_login_at: "2024-01-20T08:30:00Z",
  },
  {
    id: 2,
    uuid: "usr-002",
    email: "bob@example.com",
    first_name: "Bob",
    last_name: "Smith",
    role: "HAGU",
    status: "active",
    email_verified_at: "2024-01-10T14:00:00Z",
    profile: {
      id: 2,
      user_id: 2,
      type: "hagu",
      photo_url: null,
      bio: "Professional companion",
      tagline: "Here to make your day better",
      date_of_birth: "1988-03-20",
      phone: null,
      is_verified: true,
      kyc_status: "verified",
      response_time_label: "Usually responds in 30 minutes",
    },
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-10T14:00:00Z",
    last_login_at: "2024-01-19T16:45:00Z",
  },
  {
    id: 3,
    uuid: "usr-003",
    email: "charlie@example.com",
    first_name: "Charlie",
    last_name: "Brown",
    role: "HAGEE",
    status: "suspended",
    email_verified_at: "2024-01-05T09:00:00Z",
    profile: null,
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-18T12:00:00Z",
    last_login_at: "2024-01-17T20:15:00Z",
  },
  {
    id: 4,
    uuid: "usr-004",
    email: "diana@example.com",
    first_name: "Diana",
    last_name: "Prince",
    role: "HAGU",
    status: "pending_verification",
    email_verified_at: null,
    profile: null,
    created_at: "2024-01-04T00:00:00Z",
    updated_at: "2024-01-04T00:00:00Z",
    last_login_at: null,
  },
]

export async function loginAdminMock(
  credentials: LoginCredentials
): Promise<{ token: string; user: AdminUser }> {
  await mockDelay()
  
  if (credentials.email !== "admin@hagu.app" || credentials.password !== "admin") {
    throw new Error("Invalid credentials")
  }
  
  const token = "mock-jwt-token-" + Date.now()
  setAuthToken(token)
  setAdminSession({
    isLoggedIn: true,
    token,
    user: MOCK_ADMIN,
  })
  
  return { token, user: MOCK_ADMIN }
}

export async function fetchUsersMock(
  filters: UserFilters = {}
): Promise<PaginatedResponse<User>> {
  await mockDelay()
  
  let filtered = [...MOCK_USERS]
  
  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(
      (u) =>
        u.email.toLowerCase().includes(search) ||
        (u.first_name?.toLowerCase() ?? "").includes(search) ||
        (u.last_name?.toLowerCase() ?? "").includes(search)
    )
  }
  
  if (filters.role && filters.role !== "all") {
    filtered = filtered.filter((u) => u.role === filters.role)
  }
  
  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((u) => u.status === filters.status)
  }
  
  const page = filters.page ?? 1
  const per_page = filters.per_page ?? 20
  const start = (page - 1) * per_page
  const end = start + per_page
  
  return {
    data: filtered.slice(start, end),
    meta: {
      current_page: page,
      per_page,
      total: filtered.length,
      total_pages: Math.ceil(filtered.length / per_page),
    },
  }
}

export async function getDashboardStatsMock(): Promise<DashboardStats> {
  await mockDelay()
  return {
    total_users: MOCK_USERS.length,
    total_hagee: MOCK_USERS.filter((u) => u.role === "HAGEE").length,
    total_hagu: MOCK_USERS.filter((u) => u.role === "HAGU").length,
    active_users_today: 2,
    new_users_today: 0,
    pending_verifications: MOCK_USERS.filter((u) => u.status === "pending_verification").length,
    suspended_users: MOCK_USERS.filter((u) => u.status === "suspended").length,
  }
}

export async function suspendUserMock(userId: number, reason?: string): Promise<void> {
  await mockDelay()
  const user = MOCK_USERS.find((u) => u.id === userId)
  if (!user) throw new Error("User not found")
  user.status = "suspended"
}

export async function activateUserMock(userId: number): Promise<void> {
  await mockDelay()
  const user = MOCK_USERS.find((u) => u.id === userId)
  if (!user) throw new Error("User not found")
  user.status = "active"
}

// ============================================================================
// Bookings Mock API
// ============================================================================

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 1,
    uuid: "bk-001",
    hagee_id: 1,
    hagu_id: 2,
    status: "confirmed",
    type: "one_time",
    title: "Coffee meetup",
    description: "Casual coffee meetup downtown",
    start_time: new Date(Date.now() + 86400000).toISOString(),
    end_time: new Date(Date.now() + 90000000).toISOString(),
    duration_minutes: 60,
    location: "Downtown Coffee Shop",
    price_cents: 5000,
    currency: "EUR",
    platform_fee_cents: 500,
    hagu_payout_cents: 4500,
    notes: null,
    cancellation_reason: null,
    cancelled_by: null,
    cancelled_at: null,
    completed_at: null,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 2,
    uuid: "bk-002",
    hagee_id: 1,
    hagu_id: 2,
    status: "completed",
    type: "one_time",
    title: "Dinner date",
    description: "Nice dinner at Italian restaurant",
    start_time: new Date(Date.now() - 172800000).toISOString(),
    end_time: new Date(Date.now() - 169200000).toISOString(),
    duration_minutes: 120,
    location: "Bella Italia",
    price_cents: 10000,
    currency: "EUR",
    platform_fee_cents: 1000,
    hagu_payout_cents: 9000,
    notes: null,
    cancellation_reason: null,
    cancelled_by: null,
    cancelled_at: null,
    completed_at: new Date(Date.now() - 169200000).toISOString(),
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 169200000).toISOString(),
  },
  {
    id: 3,
    uuid: "bk-003",
    hagee_id: 3,
    hagu_id: 2,
    status: "cancelled",
    type: "one_time",
    title: "Movie night",
    description: "Watch the latest blockbuster",
    start_time: new Date(Date.now() - 86400000).toISOString(),
    end_time: new Date(Date.now() - 82800000).toISOString(),
    duration_minutes: 120,
    location: "Cinema City",
    price_cents: 7500,
    currency: "EUR",
    platform_fee_cents: 750,
    hagu_payout_cents: 6750,
    notes: null,
    cancellation_reason: "User changed plans",
    cancelled_by: "hagee",
    cancelled_at: new Date(Date.now() - 90000000).toISOString(),
    completed_at: null,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 90000000).toISOString(),
  },
  {
    id: 4,
    uuid: "bk-004",
    hagee_id: 1,
    hagu_id: 4,
    status: "pending",
    type: "one_time",
    title: "Park walk",
    description: "Relaxing walk in the park",
    start_time: new Date(Date.now() + 172800000).toISOString(),
    end_time: new Date(Date.now() + 176400000).toISOString(),
    duration_minutes: 90,
    location: "Central Park",
    price_cents: 3000,
    currency: "EUR",
    platform_fee_cents: 300,
    hagu_payout_cents: 2700,
    notes: null,
    cancellation_reason: null,
    cancelled_by: null,
    cancelled_at: null,
    completed_at: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 5,
    uuid: "bk-005",
    hagee_id: 3,
    hagu_id: 4,
    status: "disputed",
    type: "one_time",
    title: "Concert evening",
    description: "Live music event",
    start_time: new Date(Date.now() - 259200000).toISOString(),
    end_time: new Date(Date.now() - 255600000).toISOString(),
    duration_minutes: 180,
    location: "Music Hall",
    price_cents: 15000,
    currency: "EUR",
    platform_fee_cents: 1500,
    hagu_payout_cents: 13500,
    notes: "Dispute raised about service quality",
    cancellation_reason: null,
    cancelled_by: null,
    cancelled_at: null,
    completed_at: new Date(Date.now() - 255600000).toISOString(),
    created_at: new Date(Date.now() - 345600000).toISOString(),
    updated_at: new Date(Date.now() - 250000000).toISOString(),
  },
]

export async function fetchBookingsMock(
  filters: BookingFilters = {}
): Promise<PaginatedResponse<Booking>> {
  await mockDelay()
  
  let filtered = [...MOCK_BOOKINGS]
  
  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(search) ||
        b.description?.toLowerCase().includes(search) ||
        b.location?.toLowerCase().includes(search)
    )
  }
  
  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((b) => b.status === filters.status)
  }
  
  if (filters.type && filters.type !== "all") {
    filtered = filtered.filter((b) => b.type === filters.type)
  }
  
  const page = filters.page ?? 1
  const per_page = filters.per_page ?? 20
  const start = (page - 1) * per_page
  const end = start + per_page
  
  return {
    data: filtered.slice(start, end),
    meta: {
      current_page: page,
      per_page,
      total: filtered.length,
      total_pages: Math.ceil(filtered.length / per_page),
    },
  }
}

export async function getBookingMock(bookingId: number): Promise<Booking> {
  await mockDelay()
  const booking = MOCK_BOOKINGS.find((b) => b.id === bookingId)
  if (!booking) throw new Error("Booking not found")
  return booking
}

export async function performBookingActionMock(
  bookingId: number,
  action: BookingAction
): Promise<Booking> {
  await mockDelay()
  const booking = MOCK_BOOKINGS.find((b) => b.id === bookingId)
  if (!booking) throw new Error("Booking not found")
  
  switch (action.action) {
    case "cancel":
      booking.status = "cancelled"
      booking.cancellation_reason = action.reason || "Cancelled by admin"
      booking.cancelled_by = "admin"
      booking.cancelled_at = new Date().toISOString()
      break
    case "complete":
      booking.status = "completed"
      booking.completed_at = new Date().toISOString()
      break
    case "reschedule":
      if (action.new_start_time) booking.start_time = action.new_start_time
      if (action.new_end_time) booking.end_time = action.new_end_time
      break
    default:
      break
  }
  
  booking.updated_at = new Date().toISOString()
  return booking
}

// ============================================================================
// KYC Mock API
// ============================================================================

const MOCK_KYC: KycVerification[] = [
  {
    id: 1,
    user_id: 2,
    status: "approved",
    document_type: "passport",
    document_number: "XP123456",
    document_front_url: "https://example.com/doc1-front.jpg",
    document_back_url: null,
    selfie_url: "https://example.com/selfie1.jpg",
    full_name: "Bob Smith",
    date_of_birth: "1988-03-20",
    nationality: "NL",
    address: "123 Main St",
    city: "Amsterdam",
    postal_code: "1012 AB",
    country: "NL",
    submitted_at: new Date(Date.now() - 2592000000).toISOString(),
    reviewed_at: new Date(Date.now() - 2505600000).toISOString(),
    reviewed_by: 1,
    rejection_reason: null,
    expiry_date: "2030-03-20",
    created_at: new Date(Date.now() - 2592000000).toISOString(),
    updated_at: new Date(Date.now() - 2505600000).toISOString(),
  },
  {
    id: 2,
    user_id: 4,
    status: "pending",
    document_type: "id_card",
    document_number: null,
    document_front_url: "https://example.com/doc2-front.jpg",
    document_back_url: "https://example.com/doc2-back.jpg",
    selfie_url: "https://example.com/selfie2.jpg",
    full_name: null,
    date_of_birth: null,
    nationality: null,
    address: null,
    city: null,
    postal_code: null,
    country: null,
    submitted_at: new Date(Date.now() - 86400000).toISOString(),
    reviewed_at: null,
    reviewed_by: null,
    rejection_reason: null,
    expiry_date: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    user_id: 1,
    status: "rejected",
    document_type: "drivers_license",
    document_number: "DL789012",
    document_front_url: "https://example.com/doc3-front.jpg",
    document_back_url: "https://example.com/doc3-back.jpg",
    selfie_url: "https://example.com/selfie3.jpg",
    full_name: "Alice Johnson",
    date_of_birth: "1990-05-15",
    nationality: "NL",
    address: "456 Oak Ave",
    city: "Rotterdam",
    postal_code: "3011 CD",
    country: "NL",
    submitted_at: new Date(Date.now() - 172800000).toISOString(),
    reviewed_at: new Date(Date.now() - 86400000).toISOString(),
    reviewed_by: 1,
    rejection_reason: "Document unclear, please resubmit",
    expiry_date: null,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

export async function fetchKycVerificationsMock(
  filters: KycFilters = {}
): Promise<PaginatedResponse<KycVerification>> {
  await mockDelay()
  
  let filtered = [...MOCK_KYC]
  
  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((k) => k.status === filters.status)
  }
  
  if (filters.document_type && filters.document_type !== "all") {
    filtered = filtered.filter((k) => k.document_type === filters.document_type)
  }
  
  const page = filters.page ?? 1
  const per_page = filters.per_page ?? 20
  const start = (page - 1) * per_page
  const end = start + per_page
  
  return {
    data: filtered.slice(start, end),
    meta: {
      current_page: page,
      per_page,
      total: filtered.length,
      total_pages: Math.ceil(filtered.length / per_page),
    },
  }
}

export async function getKycVerificationMock(kycId: number): Promise<KycVerification> {
  await mockDelay()
  const kyc = MOCK_KYC.find((k) => k.id === kycId)
  if (!kyc) throw new Error("KYC verification not found")
  return kyc
}

export async function performKycActionMock(
  kycId: number,
  action: KycAction
): Promise<KycVerification> {
  await mockDelay()
  const kyc = MOCK_KYC.find((k) => k.id === kycId)
  if (!kyc) throw new Error("KYC verification not found")
  
  switch (action.action) {
    case "approve":
      kyc.status = "approved"
      kyc.reviewed_at = new Date().toISOString()
      kyc.reviewed_by = 1
      break
    case "reject":
      kyc.status = "rejected"
      kyc.rejection_reason = action.reason || "Verification rejected"
      kyc.reviewed_at = new Date().toISOString()
      kyc.reviewed_by = 1
      break
    case "restart":
      kyc.status = "pending"
      kyc.rejection_reason = null
      kyc.reviewed_at = null
      kyc.reviewed_by = null
      break
    default:
      break
  }
  
  kyc.updated_at = new Date().toISOString()
  return kyc
}

// ============================================================================
// Payments Mock API
// ============================================================================

const MOCK_PAYMENTS: Payment[] = [
  {
    id: 1,
    uuid: "pay-001",
    booking_id: 1,
    user_id: 1,
    type: "payment",
    status: "completed",
    method: "ideal",
    amount_cents: 5000,
    currency: "EUR",
    platform_fee_cents: 500,
    stripe_payment_intent_id: "pi_1234567890",
    stripe_charge_id: "ch_1234567890",
    description: "Payment for Coffee meetup",
    metadata: null,
    processed_at: new Date(Date.now() - 172800000).toISOString(),
    failed_at: null,
    failure_reason: null,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 2,
    uuid: "pay-002",
    booking_id: 2,
    user_id: 1,
    type: "payment",
    status: "completed",
    method: "card",
    amount_cents: 10000,
    currency: "EUR",
    platform_fee_cents: 1000,
    stripe_payment_intent_id: "pi_2345678901",
    stripe_charge_id: "ch_2345678901",
    description: "Payment for Dinner date",
    metadata: null,
    processed_at: new Date(Date.now() - 259200000).toISOString(),
    failed_at: null,
    failure_reason: null,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 3,
    uuid: "pay-003",
    booking_id: 3,
    user_id: 3,
    type: "refund",
    status: "completed",
    method: "ideal",
    amount_cents: 7500,
    currency: "EUR",
    platform_fee_cents: 0,
    stripe_payment_intent_id: null,
    stripe_charge_id: null,
    description: "Refund for cancelled Movie night",
    metadata: { original_payment_id: 3 },
    processed_at: new Date(Date.now() - 85000000).toISOString(),
    failed_at: null,
    failure_reason: null,
    created_at: new Date(Date.now() - 85000000).toISOString(),
    updated_at: new Date(Date.now() - 85000000).toISOString(),
  },
  {
    id: 4,
    uuid: "pay-004",
    booking_id: null,
    user_id: 2,
    type: "payout",
    status: "completed",
    method: "sepa_direct_debit",
    amount_cents: 13500,
    currency: "EUR",
    platform_fee_cents: 0,
    stripe_payment_intent_id: null,
    stripe_charge_id: null,
    description: "Payout to HAGU Bob Smith",
    metadata: null,
    processed_at: new Date(Date.now() - 86400000).toISOString(),
    failed_at: null,
    failure_reason: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 5,
    uuid: "pay-005",
    booking_id: 4,
    user_id: 1,
    type: "payment",
    status: "pending",
    method: "card",
    amount_cents: 3000,
    currency: "EUR",
    platform_fee_cents: 300,
    stripe_payment_intent_id: "pi_3456789012",
    stripe_charge_id: null,
    description: "Payment for Park walk",
    metadata: null,
    processed_at: null,
    failed_at: null,
    failure_reason: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

const MOCK_REFUNDS: Refund[] = [
  {
    id: 1,
    uuid: "ref-001",
    payment_id: 3,
    booking_id: 3,
    amount_cents: 7500,
    currency: "EUR",
    reason: "Booking cancelled by user",
    status: "completed",
    processed_by: 1,
    stripe_refund_id: "re_1234567890",
    created_at: new Date(Date.now() - 85000000).toISOString(),
    processed_at: new Date(Date.now() - 85000000).toISOString(),
  },
]

const MOCK_PAYOUTS: Payout[] = [
  {
    id: 1,
    uuid: "po-001",
    user_id: 2,
    amount_cents: 13500,
    currency: "EUR",
    status: "completed",
    stripe_payout_id: "po_1234567890",
    bank_account_last4: "4242",
    processed_at: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

export async function fetchPaymentsMock(
  filters: PaymentFilters = {}
): Promise<PaginatedResponse<Payment>> {
  await mockDelay()
  
  let filtered = [...MOCK_PAYMENTS]
  
  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((p) => p.status === filters.status)
  }
  
  if (filters.type && filters.type !== "all") {
    filtered = filtered.filter((p) => p.type === filters.type)
  }
  
  if (filters.method && filters.method !== "all") {
    filtered = filtered.filter((p) => p.method === filters.method)
  }
  
  const page = filters.page ?? 1
  const per_page = filters.per_page ?? 20
  const start = (page - 1) * per_page
  const end = start + per_page
  
  return {
    data: filtered.slice(start, end),
    meta: {
      current_page: page,
      per_page,
      total: filtered.length,
      total_pages: Math.ceil(filtered.length / per_page),
    },
  }
}

export async function getPaymentMock(paymentId: number): Promise<Payment> {
  await mockDelay()
  const payment = MOCK_PAYMENTS.find((p) => p.id === paymentId)
  if (!payment) throw new Error("Payment not found")
  return payment
}

export async function createRefundMock(data: RefundRequest): Promise<Refund> {
  await mockDelay()
  const newRefund: Refund = {
    id: MOCK_REFUNDS.length + 1,
    uuid: `ref-00${MOCK_REFUNDS.length + 1}`,
    payment_id: data.payment_id,
    booking_id: null,
    amount_cents: data.amount_cents,
    currency: "EUR",
    reason: data.reason,
    status: "pending",
    processed_by: null,
    stripe_refund_id: null,
    created_at: new Date().toISOString(),
    processed_at: null,
  }
  MOCK_REFUNDS.push(newRefund)
  return newRefund
}

export async function fetchRefundsMock(
  filters: { status?: string; page?: number; per_page?: number } = {}
): Promise<PaginatedResponse<Refund>> {
  await mockDelay()
  
  let filtered = [...MOCK_REFUNDS]
  
  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((r) => r.status === filters.status)
  }
  
  const page = filters.page ?? 1
  const per_page = filters.per_page ?? 20
  const start = (page - 1) * per_page
  const end = start + per_page
  
  return {
    data: filtered.slice(start, end),
    meta: {
      current_page: page,
      per_page,
      total: filtered.length,
      total_pages: Math.ceil(filtered.length / per_page),
    },
  }
}

export async function fetchPayoutsMock(
  filters: { status?: string; user_id?: number; page?: number; per_page?: number } = {}
): Promise<PaginatedResponse<Payout>> {
  await mockDelay()
  
  let filtered = [...MOCK_PAYOUTS]
  
  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((p) => p.status === filters.status)
  }
  
  if (filters.user_id) {
    filtered = filtered.filter((p) => p.user_id === filters.user_id)
  }
  
  const page = filters.page ?? 1
  const per_page = filters.per_page ?? 20
  const start = (page - 1) * per_page
  const end = start + per_page
  
  return {
    data: filtered.slice(start, end),
    meta: {
      current_page: page,
      per_page,
      total: filtered.length,
      total_pages: Math.ceil(filtered.length / per_page),
    },
  }
}

// ============================================================================
// Disputes Mock API
// ============================================================================

const MOCK_DISPUTES: Dispute[] = [
  {
    id: 1,
    uuid: "dsp-001",
    booking_id: 5,
    hagee_id: 3,
    hagu_id: 4,
    initiated_by: "hagee",
    status: "open",
    reason: "unsatisfactory_service",
    description: "The HAGU was late and seemed disinterested during our meeting",
    evidence_hagee: "Chat logs showing delayed responses",
    evidence_hagu: null,
    resolution_notes: null,
    refund_amount_cents: null,
    refund_to: null,
    resolved_by: null,
    resolved_at: null,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
]

export async function fetchDisputesMock(
  filters: DisputeFilters = {}
): Promise<PaginatedResponse<Dispute>> {
  await mockDelay()
  
  let filtered = [...MOCK_DISPUTES]
  
  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((d) => d.status === filters.status)
  }
  
  if (filters.reason && filters.reason !== "all") {
    filtered = filtered.filter((d) => d.reason === filters.reason)
  }
  
  const page = filters.page ?? 1
  const per_page = filters.per_page ?? 20
  const start = (page - 1) * per_page
  const end = start + per_page
  
  return {
    data: filtered.slice(start, end),
    meta: {
      current_page: page,
      per_page,
      total: filtered.length,
      total_pages: Math.ceil(filtered.length / per_page),
    },
  }
}

export async function getDisputeMock(disputeId: number): Promise<Dispute> {
  await mockDelay()
  const dispute = MOCK_DISPUTES.find((d) => d.id === disputeId)
  if (!dispute) throw new Error("Dispute not found")
  return dispute
}

export async function resolveDisputeMock(
  disputeId: number,
  resolution: DisputeResolution
): Promise<Dispute> {
  await mockDelay()
  const dispute = MOCK_DISPUTES.find((d) => d.id === disputeId)
  if (!dispute) throw new Error("Dispute not found")
  
  dispute.status = resolution.status
  dispute.resolution_notes = resolution.resolution_notes
  dispute.refund_amount_cents = resolution.refund_amount_cents || null
  dispute.refund_to = resolution.refund_to || null
  dispute.resolved_by = 1
  dispute.resolved_at = new Date().toISOString()
  dispute.updated_at = new Date().toISOString()
  
  return dispute
}

// ============================================================================
// Booking Notes Mock API
// ============================================================================

const MOCK_BOOKING_NOTES: BookingNote[] = [
  {
    id: 1,
    booking_id: 1,
    admin_id: 1,
    note: "Initial booking confirmed by both parties",
    is_internal: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 2,
    booking_id: 5,
    admin_id: 1,
    note: "Dispute raised - awaiting evidence from HAGU",
    is_internal: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

export async function fetchBookingNotesMock(bookingId: number): Promise<BookingNote[]> {
  await mockDelay()
  return MOCK_BOOKING_NOTES.filter((n) => n.booking_id === bookingId)
}

export async function addBookingNoteMock(
  bookingId: number,
  note: string,
  isInternal = true
): Promise<BookingNote> {
  await mockDelay()
  const newNote: BookingNote = {
    id: MOCK_BOOKING_NOTES.length + 1,
    booking_id: bookingId,
    admin_id: 1,
    note,
    is_internal: isInternal,
    created_at: new Date().toISOString(),
  }
  MOCK_BOOKING_NOTES.push(newNote)
  return newNote
}
