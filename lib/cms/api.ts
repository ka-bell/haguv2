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
