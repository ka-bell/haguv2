/**
 * Hagu CMS - Admin Types and Interfaces
 * 
 * Defines all types for the admin dashboard including:
 * - Admin user roles and permissions
 * - API response types
 * - Audit log types
 */

// Admin roles
export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "SUPPORT"

// User roles from the main app
export type UserRole = "HAGEE" | "HAGU"

// User status
export type UserStatus = "active" | "suspended" | "pending_verification" | "banned"

// Admin permission enum
export enum Permission {
  USERS_VIEW = "users.view",
  USERS_CREATE = "users.create",
  USERS_EDIT = "users.edit",
  USERS_DELETE = "users.delete",
  USERS_SUSPEND = "users.suspend",
  USERS_IMPERSONATE = "users.impersonate",
  AUDITLOG_VIEW = "auditlog.view",
  SETTINGS_VIEW = "settings.view",
  SETTINGS_EDIT = "settings.edit",
  ADMIN_MANAGE = "admin.manage",
}

// Permission map per role
export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  SUPER_ADMIN: [
    Permission.USERS_VIEW,
    Permission.USERS_CREATE,
    Permission.USERS_EDIT,
    Permission.USERS_DELETE,
    Permission.USERS_SUSPEND,
    Permission.USERS_IMPERSONATE,
    Permission.AUDITLOG_VIEW,
    Permission.SETTINGS_VIEW,
    Permission.SETTINGS_EDIT,
    Permission.ADMIN_MANAGE,
  ],
  ADMIN: [
    Permission.USERS_VIEW,
    Permission.USERS_CREATE,
    Permission.USERS_EDIT,
    Permission.USERS_SUSPEND,
    Permission.USERS_IMPERSONATE,
    Permission.AUDITLOG_VIEW,
    Permission.SETTINGS_VIEW,
  ],
  SUPPORT: [
    Permission.USERS_VIEW,
    Permission.AUDITLOG_VIEW,
  ],
}

// Check if a role has a permission
export function hasPermission(role: AdminRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission)
}

// Admin user session
export interface AdminSession {
  isLoggedIn: boolean
  token: string | null
  user: AdminUser | null
}

// Admin user from API
export interface AdminUser {
  id: number
  email: string
  first_name: string
  last_name: string
  role: AdminRole
  permissions: Permission[]
  is_super_admin: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string
}

// HAGEE/HAGU User from API
export interface User {
  id: number
  uuid: string
  email: string
  first_name: string | null
  last_name: string | null
  role: UserRole
  status: UserStatus
  email_verified_at: string | null
  profile: Profile | null
  created_at: string
  updated_at: string
  last_login_at: string | null
}

// User profile
export interface Profile {
  id: number
  user_id: number
  type: "hagee" | "hagu"
  photo_url: string | null
  bio: string | null
  tagline: string | null
  date_of_birth: string | null
  phone: string | null
  is_verified: boolean
  kyc_status: "pending" | "verified" | "rejected" | null
  response_time_label: string | null
}

// Pagination meta
export interface PaginationMeta {
  current_page: number
  per_page: number
  total: number
  total_pages: number
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// Audit log entry
export interface AuditLogEntry {
  id: number
  action: AuditAction
  actor_id: number
  actor_email: string
  actor_role: AdminRole
  target_type: string
  target_id: number | null
  target_email: string | null
  details: Record<string, unknown>
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

// Audit action types
export type AuditAction =
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_SUSPENDED"
  | "USER_ACTIVATED"
  | "USER_DELETED"
  | "USER_IMPERSONATED"
  | "PASSWORD_RESET_SENT"
  | "ADMIN_LOGIN"
  | "ADMIN_LOGOUT"
  | "SETTINGS_UPDATED"

// API Error response
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  code?: string
}

// Login credentials
export interface LoginCredentials {
  email: string
  password: string
}

// Password reset request
export interface PasswordResetRequest {
  email: string
}

// Password reset confirm
export interface PasswordResetConfirm {
  token: string
  email: string
  password: string
  password_confirmation: string
}

// User filters
export interface UserFilters {
  search?: string
  role?: UserRole | "all"
  status?: UserStatus | "all"
  date_from?: string
  date_to?: string
  page?: number
  per_page?: number
}

// Audit log filters
export interface AuditLogFilters {
  action?: AuditAction | "all"
  actor_email?: string
  date_from?: string
  date_to?: string
  page?: number
  per_page?: number
}

// Impersonate response
export interface ImpersonateResponse {
  original_admin_token: string
  impersonated_user_token: string
  user: User
}

// Dashboard stats
export interface DashboardStats {
  total_users: number
  total_hagee: number
  total_hagu: number
  active_users_today: number
  new_users_today: number
  pending_verifications: number
  suspended_users: number
}
