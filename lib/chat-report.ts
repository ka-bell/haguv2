export const CHAT_REPORT_REASONS = [
  {
    id: "inappropriate",
    label: "Inappropriate behavior",
    description: "Offensive or disrespectful conduct",
  },
  {
    id: "harassment",
    label: "Harassment",
    description: "Threatening, bullying, or unwanted contact",
  },
  {
    id: "spam",
    label: "Spam or scam",
    description: "Suspicious links, fraud, or promotional spam",
  },
  {
    id: "safety",
    label: "Safety concern",
    description: "Something feels unsafe or urgent",
  },
  {
    id: "other",
    label: "Other",
    description: "Something else not listed here",
  },
] as const

export type ChatReportReasonId = (typeof CHAT_REPORT_REASONS)[number]["id"]

export type ChatReport = {
  threadId: string
  personName: string
  reason: ChatReportReasonId
  details?: string
  reportedAt: string
}

const STORAGE_KEY = "hagu-chat-reports"

export function submitChatReport(report: Omit<ChatReport, "reportedAt">) {
  if (typeof window === "undefined") return

  const existing = getChatReports()
  existing.push({ ...report, reportedAt: new Date().toISOString() })
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
}

export function getChatReports(): ChatReport[] {
  if (typeof window === "undefined") return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ChatReport[]
  } catch {
    return []
  }
}
