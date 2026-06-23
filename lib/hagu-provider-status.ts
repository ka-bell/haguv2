export type ProviderProfileStatus = "active" | "paused"

const STATUS_KEY = "hagu-provider-status"
export const PROVIDER_STATUS_EVENT = "hagu-provider-status-change"

function readStorage(key: string): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(key)
}

function writeStorage(key: string, value: string) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(key, value)
}

export function getProviderProfileStatus(): ProviderProfileStatus {
  const raw = readStorage(STATUS_KEY)
  return raw === "paused" ? "paused" : "active"
}

export function setProviderProfileStatus(status: ProviderProfileStatus) {
  writeStorage(STATUS_KEY, status)
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PROVIDER_STATUS_EVENT))
  }
}

export function clearProviderProfileStatus() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STATUS_KEY)
  window.dispatchEvent(new Event(PROVIDER_STATUS_EVENT))
}
