export type UserRole = "HAGEE" | "HAGU"

export interface MockSession {
  isLoggedIn: boolean
  role: UserRole | null
  onboardingComplete: boolean
}

const SESSION_KEY = "hagu-mock-session"
const PENDING_ROLE_KEY = "hagu-pending-role"

const defaultSession: MockSession = {
  isLoggedIn: false,
  role: null,
  onboardingComplete: false,
}

function readStorage(key: string): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(key)
}

function writeStorage(key: string, value: string) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(key, value)
}

function removeStorage(key: string) {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(key)
}

export function getSession(): MockSession {
  const raw = readStorage(SESSION_KEY)
  if (!raw) return defaultSession

  try {
    return { ...defaultSession, ...JSON.parse(raw) }
  } catch {
    return defaultSession
  }
}

export function setSession(session: MockSession) {
  writeStorage(SESSION_KEY, JSON.stringify(session))
}

export function setPendingRole(role: UserRole) {
  writeStorage(PENDING_ROLE_KEY, role)
}

export function getPendingRole(): UserRole | null {
  const role = readStorage(PENDING_ROLE_KEY)
  return role === "HAGEE" || role === "HAGU" ? role : null
}

export function clearPendingRole() {
  removeStorage(PENDING_ROLE_KEY)
}

export function loginAsReturningUser(role: UserRole = "HAGEE") {
  setSession({
    isLoggedIn: true,
    role,
    onboardingComplete: true,
  })
}

export function completeOnboarding(role: UserRole) {
  setSession({
    isLoggedIn: true,
    role,
    onboardingComplete: true,
  })
  clearPendingRole()
}

export function logout() {
  removeStorage(SESSION_KEY)
  clearPendingRole()
}
