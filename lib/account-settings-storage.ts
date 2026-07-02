const EMAIL_KEY = "hagu-account-email"

export const HAGEE_DEFAULT_ACCOUNT_EMAIL = "alex@hagu.app"

export function getAccountEmail(fallback: string): string {
  if (typeof window === "undefined") return fallback
  return window.localStorage.getItem(EMAIL_KEY) ?? fallback
}

export function setAccountEmail(email: string) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(EMAIL_KEY, email.trim())
}
