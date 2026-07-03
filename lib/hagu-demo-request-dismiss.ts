const DISMISSED_DEMO_REQUESTS_KEY = "hagu-dismissed-demo-requests"

export function readDismissedDemoRequestIds(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.sessionStorage.getItem(DISMISSED_DEMO_REQUESTS_KEY)
    if (!raw?.trim()) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : []
  } catch {
    return []
  }
}

export function dismissDemoRequestId(id: string): string[] {
  const current = readDismissedDemoRequestIds()
  const next = current.includes(id) ? current : [...current, id]
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(DISMISSED_DEMO_REQUESTS_KEY, JSON.stringify(next))
  }
  return next
}
