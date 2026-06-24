import type { HageeProfile } from "@/lib/hagee-profile"
import { HAGEE_PROFILE } from "@/lib/hagee-profile"

export type HageeProfileVisibility = {
  showAsAvailable: boolean
  showInterestsPublicly: boolean
  showCharacterTraits: boolean
}

export type HageeProfileNotifications = {
  newMatchRequests: boolean
  messages: boolean
  weeklyDigest: boolean
}

export type HageeProfileData = HageeProfile & {
  traitIds: string[]
  visibility: HageeProfileVisibility
  notifications: HageeProfileNotifications
  paused: boolean
}

const STORAGE_KEY = "hagee-profile-data"

export const DEFAULT_HAGEE_PROFILE_DATA: HageeProfileData = {
  ...HAGEE_PROFILE,
  traitIds: ["night-owl", "overthinker", "dry-humour", "deep-diver"],
  visibility: {
    showAsAvailable: true,
    showInterestsPublicly: true,
    showCharacterTraits: false,
  },
  notifications: {
    newMatchRequests: true,
    messages: true,
    weeklyDigest: false,
  },
  paused: false,
}

export function getHageeProfileData(): HageeProfileData {
  if (typeof window === "undefined") return DEFAULT_HAGEE_PROFILE_DATA
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_HAGEE_PROFILE_DATA
    return { ...DEFAULT_HAGEE_PROFILE_DATA, ...JSON.parse(raw) } as HageeProfileData
  } catch {
    return DEFAULT_HAGEE_PROFILE_DATA
  }
}

export function saveHageeProfileData(data: HageeProfileData) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
