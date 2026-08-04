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
  total_bookings?: number
  pending_bookings?: number
  total_payments?: number
  pending_kyc?: number
}

// ============================================================================
// Booking Types
// ============================================================================

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "disputed"
  | "refunded"

export type BookingType = "one_time" | "recurring" | "subscription"

export interface Booking {
  id: number
  uuid: string
  hagee_id: number
  hagu_id: number
  hagee?: User
  hagu?: User
  status: BookingStatus
  type: BookingType
  title: string
  description: string | null
  start_time: string
  end_time: string
  duration_minutes: number
  location: string | null
  price_cents: number
  currency: string
  platform_fee_cents: number
  hagu_payout_cents: number
  notes: string | null
  cancellation_reason: string | null
  cancelled_by: "hagee" | "hagu" | "admin" | "system" | null
  cancelled_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface BookingFilters {
  search?: string
  status?: BookingStatus | "all"
  type?: BookingType | "all"
  hagee_id?: number
  hagu_id?: number
  date_from?: string
  date_to?: string
  page?: number
  per_page?: number
}

export interface BookingAction {
  action: "cancel" | "reschedule" | "retry" | "flag" | "unflag" | "complete"
  reason?: string
  notes?: string
  new_start_time?: string
  new_end_time?: string
}

export interface BookingNote {
  id: number
  booking_id: number
  admin_id: number
  note: string
  is_internal: boolean
  created_at: string
}

// ============================================================================
// KYC Types
// ============================================================================

export type KycStatus = "pending" | "in_review" | "approved" | "rejected" | "expired"
export type KycDocumentType = "id_card" | "passport" | "drivers_license" | "residence_permit" | "utility_bill" | "bank_statement"

export interface KycVerification {
  id: number
  user_id: number
  user?: User
  status: KycStatus
  document_type: KycDocumentType
  document_number: string | null
  document_front_url: string | null
  document_back_url: string | null
  selfie_url: string | null
  full_name: string | null
  date_of_birth: string | null
  nationality: string | null
  address: string | null
  city: string | null
  postal_code: string | null
  country: string | null
  submitted_at: string | null
  reviewed_at: string | null
  reviewed_by: number | null
  rejection_reason: string | null
  expiry_date: string | null
  created_at: string
  updated_at: string
}

export interface KycFilters {
  search?: string
  status?: KycStatus | "all"
  document_type?: KycDocumentType | "all"
  page?: number
  per_page?: number
}

export interface KycAction {
  action: "approve" | "reject" | "restart" | "request_more_info" | "sync"
  reason?: string
  notes?: string
}

// ============================================================================
// Payment Types
// ============================================================================

export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded" | "partially_refunded" | "disputed" | "cancelled"
export type PaymentMethod = "ideal" | "card" | "sepa_direct_debit" | "bancontact" | "paypal"
export type TransactionType = "payment" | "refund" | "payout" | "platform_fee" | "dispute_fee"

export interface Payment {
  id: number
  uuid: string
  booking_id: number | null
  booking?: Booking
  user_id: number
  user?: User
  type: TransactionType
  status: PaymentStatus
  method: PaymentMethod
  amount_cents: number
  currency: string
  platform_fee_cents: number
  stripe_payment_intent_id: string | null
  stripe_charge_id: string | null
  description: string | null
  metadata: Record<string, unknown> | null
  processed_at: string | null
  failed_at: string | null
  failure_reason: string | null
  created_at: string
  updated_at: string
}

export interface Refund {
  id: number
  uuid: string
  payment_id: number
  payment?: Payment
  booking_id: number | null
  amount_cents: number
  currency: string
  reason: string
  status: "pending" | "processing" | "completed" | "failed"
  processed_by: number | null
  stripe_refund_id: string | null
  created_at: string
  processed_at: string | null
}

export interface Payout {
  id: number
  uuid: string
  user_id: number
  user?: User
  amount_cents: number
  currency: string
  status: "pending" | "processing" | "completed" | "failed"
  stripe_payout_id: string | null
  bank_account_last4: string | null
  processed_at: string | null
  created_at: string
}

export interface PaymentFilters {
  search?: string
  status?: PaymentStatus | "all"
  type?: TransactionType | "all"
  method?: PaymentMethod | "all"
  user_id?: number
  booking_id?: number
  date_from?: string
  date_to?: string
  page?: number
  per_page?: number
}

export interface RefundRequest {
  payment_id: number
  amount_cents: number
  reason: string
}

export interface PayoutRequest {
  user_id: number
  amount_cents: number
}

// ============================================================================
// Dispute Types
// ============================================================================

export type DisputeStatus = "open" | "under_review" | "resolved_hagee" | "resolved_hagu" | "resolved_split" | "closed"
export type DisputeReason = "no_show" | "unsatisfactory_service" | "incorrect_charges" | "fraud" | "other"

export interface Dispute {
  id: number
  uuid: string
  booking_id: number
  booking?: Booking
  hagee_id: number
  hagu_id: number
  initiated_by: "hagee" | "hagu"
  status: DisputeStatus
  reason: DisputeReason
  description: string
  evidence_hagee: string | null
  evidence_hagu: string | null
  resolution_notes: string | null
  refund_amount_cents: number | null
  refund_to: "hagee" | "hagu" | "split" | null
  resolved_by: number | null
  resolved_at: string | null
  created_at: string
  updated_at: string
}

export interface DisputeFilters {
  search?: string
  status?: DisputeStatus | "all"
  reason?: DisputeReason | "all"
  page?: number
  per_page?: number
}

export interface DisputeResolution {
  status: "resolved_hagee" | "resolved_hagu" | "resolved_split" | "closed"
  resolution_notes: string
  refund_amount_cents?: number
  refund_to?: "hagee" | "hagu" | "split"
}

// ============================================================================
// Content Moderation Types
// ============================================================================

export type ReviewStatus = "pending" | "approved" | "rejected"
export type ReportStatus = "open" | "under_review" | "resolved" | "dismissed"
export type ReportReason = "inappropriate_content" | "harassment" | "spam" | "fake_review" | "fraud" | "other"
export type ModerationAction = "approve" | "reject" | "flag" | "unflag" | "warn" | "ban"

export interface Review {
  id: number
  uuid: string
  booking_id: number
  booking?: Booking
  hagee_id: number
  hagee?: User
  hagu_id: number
  hagu?: User
  rating: number
  title: string | null
  content: string
  status: ReviewStatus
  is_flagged: boolean
  flag_reason: string | null
  flagged_at: string | null
  flagged_by: number | null
  moderated_at: string | null
  moderated_by: number | null
  moderation_notes: string | null
  created_at: string
  updated_at: string
}

export interface ReviewFilters {
  search?: string
  status?: ReviewStatus | "all"
  rating?: number | "all"
  hagee_id?: number
  hagu_id?: number
  is_flagged?: boolean
  date_from?: string
  date_to?: string
  page?: number
  per_page?: number
}

export interface Report {
  id: number
  uuid: string
  reporter_id: number
  reporter?: User
  target_type: "review" | "profile" | "message" | "booking"
  target_id: number
  reason: ReportReason
  description: string
  status: ReportStatus
  assigned_to: number | null
  assigned_admin?: AdminUser
  resolution_notes: string | null
  resolved_at: string | null
  resolved_by: number | null
  created_at: string
  updated_at: string
}

export interface ReportFilters {
  search?: string
  status?: ReportStatus | "all"
  reason?: ReportReason | "all"
  target_type?: "review" | "profile" | "message" | "booking" | "all"
  assigned_to?: number
  date_from?: string
  date_to?: string
  page?: number
  per_page?: number
}

export interface ModerationActionRequest {
  action: ModerationAction
  reason?: string
  notes?: string
  duration_days?: number // for bans
}

export interface FlaggedContent {
  id: number
  content_type: "review" | "profile" | "message"
  content_id: number
  content_preview: string
  flagged_by: number
  flagged_by_user?: User
  flag_reason: string
  created_at: string
}

// ============================================================================
// Platform Settings Types
// ============================================================================

export interface PlatformSettings {
  general: GeneralSettings
  service_rates: ServiceRates
  booking_settings: BookingSettings
  notifications: NotificationSettings
}

export interface GeneralSettings {
  platform_name: string
  support_email: string
  support_phone: string | null
  default_language: string
  default_currency: string
  maintenance_mode: boolean
  maintenance_message: string | null
  terms_version: string
  privacy_version: string
}

export interface ServiceRates {
  platform_fee_percent: number
  minimum_booking_amount_cents: number
  hagu_payout_delay_days: number
  stripe_connect_enabled: boolean
  payment_methods: string[]
}

export interface BookingSettings {
  min_advance_booking_hours: number
  max_advance_booking_days: number
  cancellation_policy_hours: number
  reschedule_policy_hours: number
  auto_confirm_bookings: boolean
  require_verified_hagu: boolean
}

export interface NotificationSettings {
  admin_email_alerts: boolean
  new_user_alert: boolean
  dispute_alert: boolean
  high_value_booking_threshold_cents: number
}

export interface Category {
  id: number
  slug: string
  name: string
  description: string | null
  icon: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Tag {
  id: number
  slug: string
  name: string
  description: string | null
  color: string | null
  is_active: boolean
  usage_count: number
  created_at: string
  updated_at: string
}

// ============================================================================
// Support & Escalation Types
// ============================================================================

export type SupportTicketStatus = "open" | "in_progress" | "waiting" | "resolved" | "closed"
export type SupportTicketPriority = "low" | "medium" | "high" | "urgent"
export type WarningLevel = "minor" | "moderate" | "severe"
export type BanType = "temporary" | "permanent"

export interface SupportTicket {
  id: number
  uuid: string
  user_id: number
  user?: User
  subject: string
  description: string
  status: SupportTicketStatus
  priority: SupportTicketPriority
  category: string
  assigned_to: number | null
  assigned_admin?: AdminUser
  resolution_notes: string | null
  resolved_at: string | null
  created_at: string
  updated_at: string
}

export interface SupportTicketFilters {
  search?: string
  status?: SupportTicketStatus | "all"
  priority?: SupportTicketPriority | "all"
  category?: string
  assigned_to?: number | "unassigned" | "me"
  date_from?: string
  date_to?: string
  page?: number
  per_page?: number
}

export interface SupportTicketReply {
  id: number
  ticket_id: number
  author_id: number
  author?: AdminUser | User
  is_internal: boolean
  message: string
  created_at: string
}

export interface UserWarning {
  id: number
  user_id: number
  user?: User
  level: WarningLevel
  reason: string
  details: string | null
  issued_by: number
  issued_by_admin?: AdminUser
  expires_at: string | null
  acknowledged_at: string | null
  created_at: string
}

export interface UserBan {
  id: number
  user_id: number
  user?: User
  type: BanType
  reason: string
  details: string | null
  issued_by: number
  issued_by_admin?: AdminUser
  expires_at: string | null
  revoked_at: string | null
  revoked_by: number | null
  revoked_reason: string | null
  created_at: string
}

export interface EscalationRule {
  id: number
  name: string
  condition: string
  action: string
  is_active: boolean
  priority: number
  created_at: string
  updated_at: string
}
