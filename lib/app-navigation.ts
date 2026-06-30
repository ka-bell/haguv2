import type { UserRole } from "@/lib/session"
import { ROUTES } from "@/lib/routes"

/**
 * HAGEE (client) and HAGU (provider) are separate apps that share only auth shell.
 *
 * HAGEE tabs: Home · Explore · Connections · Profile  →  /home, /explore, /chat, /profile
 * HAGU tabs:  Home · Bookings · Calendar · Settings  →  /discover, /bookings, /calendar, /settings
 */

/** HAGEE-only route prefixes — HAGU sessions are redirected away. */
export const HAGEE_ONLY_PATH_PREFIXES = [ROUTES.home, ROUTES.explore] as const

/** HAGU-only route prefixes — HAGEE sessions are redirected away. */
export const HAGU_ONLY_PATH_PREFIXES = [
  ROUTES.discover,
  ROUTES.bookings,
  ROUTES.calendar,
  ROUTES.settingsTransactions,
  ROUTES.requests,
  ROUTES.reviews,
] as const

export type NavIconKey =
  | "home"
  | "search"
  | "message"
  | "user"
  | "bookings"
  | "calendar"

export type BottomNavTab = {
  key: string
  label: string
  href: string
  icon: NavIconKey
}

export type HageeNavTab = "home" | "explore" | "chat" | "profile"
export type HaguNavTab = "home" | "bookings" | "calendar" | "profile"

export const HAGEE_BOTTOM_NAV: readonly BottomNavTab[] = [
  { key: "home", label: "Home", href: ROUTES.home, icon: "home" },
  { key: "explore", label: "Explore", href: ROUTES.explore, icon: "search" },
  { key: "chat", label: "Connections", href: ROUTES.chat, icon: "message" },
  { key: "profile", label: "Profile", href: ROUTES.profile, icon: "user" },
] as const

export const HAGU_BOTTOM_NAV: readonly BottomNavTab[] = [
  { key: "home", label: "Home", href: ROUTES.discover, icon: "home" },
  { key: "bookings", label: "Bookings", href: ROUTES.bookings, icon: "bookings" },
  { key: "calendar", label: "Calendar", href: ROUTES.calendar, icon: "calendar" },
  { key: "profile", label: "Profile", href: ROUTES.profile, icon: "user" },
] as const

export function hageeNavTabFromPathname(pathname: string): HageeNavTab {
  if (pathname.startsWith(ROUTES.home)) return "home"
  if (pathname.startsWith(ROUTES.chat)) return "chat"
  if (pathname.startsWith(ROUTES.profile) || pathname.startsWith(ROUTES.profileEdit)) {
    return "profile"
  }
  if (
    pathname.startsWith(ROUTES.explore) ||
    pathname.startsWith(ROUTES.exploreMatches) ||
    pathname.startsWith(ROUTES.exploreRefine)
  ) {
    return "explore"
  }
  return "home"
}

export function haguNavTabFromPathname(pathname: string): HaguNavTab {
  if (pathname.startsWith(ROUTES.bookings)) return "bookings"
  if (pathname.startsWith(ROUTES.calendar)) return "calendar"
  if (pathname.startsWith(ROUTES.settingsTransactions)) return "profile"
  if (pathname.startsWith(ROUTES.settings) || pathname.startsWith(ROUTES.profile)) {
    return "profile"
  }
  if (pathname.startsWith(ROUTES.requests) || pathname.startsWith(ROUTES.reviews)) {
    return "home"
  }
  return "home"
}

export function isHageeClient(role: UserRole | null): boolean {
  return role !== "HAGU"
}

export function isHaguProvider(role: UserRole | null): boolean {
  return role === "HAGU"
}

export function getDefaultRouteForRole(role: UserRole | null): string {
  return isHaguProvider(role) ? ROUTES.discover : ROUTES.home
}

function pathnameMatchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

/** Redirect when a role opens the other audience's routes. */
export function roleGuardRedirect(pathname: string, role: UserRole | null): string | null {
  const hagu = isHaguProvider(role)

  if (pathname === ROUTES.settings) {
    return ROUTES.profile
  }

  // Legacy HAGEE discover URLs → explore tree
  if (pathnameMatchesPrefix(pathname, ROUTES.discoverRefine)) {
    return hagu ? ROUTES.discover : ROUTES.exploreRefine
  }
  if (pathnameMatchesPrefix(pathname, ROUTES.discoverMatches)) {
    return hagu ? ROUTES.discover : ROUTES.exploreMatches
  }
  if (pathnameMatchesPrefix(pathname, ROUTES.discover)) {
    return hagu ? null : ROUTES.explore
  }

  if (hagu) {
    if (pathnameMatchesPrefix(pathname, ROUTES.home)) return ROUTES.discover
    if (pathnameMatchesPrefix(pathname, ROUTES.explore)) return ROUTES.discover
    if (pathname === ROUTES.chat) return ROUTES.chatThread("luca")
    if (pathnameMatchesPrefix(pathname, ROUTES.profileEdit)) {
      return `${ROUTES.onboardingHagu}?step=2&edit=1`
    }
    return null
  }

  if (HAGU_ONLY_PATH_PREFIXES.some((prefix) => pathnameMatchesPrefix(pathname, prefix))) {
    return ROUTES.home
  }

  return null
}

export function getBottomNavConfig(role: UserRole | null) {
  if (isHaguProvider(role)) {
    return {
      audience: "HAGU" as const,
      tabs: HAGU_BOTTOM_NAV,
      activeTabFromPathname: haguNavTabFromPathname,
    }
  }

  return {
    audience: "HAGEE" as const,
    tabs: HAGEE_BOTTOM_NAV,
    activeTabFromPathname: hageeNavTabFromPathname,
  }
}

/** Hide bottom nav on full-screen flows (chat thread, refine, edit profile, reviews). */
export function shouldHideBottomNav(pathname: string): boolean {
  if (pathname.startsWith(`${ROUTES.chat}/`) && pathname !== ROUTES.chat) return true
  if (pathname.startsWith(ROUTES.reviews)) return true
  if (pathname.startsWith(ROUTES.exploreRefine)) return true
  if (pathname.startsWith(ROUTES.profileEdit)) return true
  if (
    pathname.startsWith(`${ROUTES.explore}/`) &&
    !pathname.startsWith(ROUTES.exploreRefine) &&
    !pathname.startsWith(ROUTES.exploreMatches)
  ) {
    return true
  }
  return false
}

// Legacy aliases — prefer HAGEE_BOTTOM_NAV / HAGU_BOTTOM_NAV in new code.
export const APP_TABS = HAGEE_BOTTOM_NAV
export const PROVIDER_TABS = HAGU_BOTTOM_NAV
export type AppTab = HageeNavTab
export type ProviderTab = HaguNavTab
export const tabFromPathname = hageeNavTabFromPathname
export const providerTabFromPathname = haguNavTabFromPathname
