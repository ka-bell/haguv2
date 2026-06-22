export const ROUTES = {
  entry: "/",
  login: "/login",
  forgotPassword: "/forgot-password",
  selectRole: "/select-role",
  onboardingHagee: "/onboarding",
  onboardingHagu: "/onboarding/hagu",
  discover: "/discover",
  bookings: "/bookings",
  calendar: "/calendar",
  chat: "/chat",
  profile: "/profile",
} as const

export type AppTab = "discover" | "bookings" | "chat" | "profile"

export const APP_TABS: { key: AppTab; label: string; href: string }[] = [
  { key: "discover", label: "Discover", href: ROUTES.discover },
  { key: "bookings", label: "Bookings", href: ROUTES.bookings },
  { key: "chat", label: "Chat", href: ROUTES.chat },
  { key: "profile", label: "Profile", href: ROUTES.profile },
]

export type ProviderTab = "home" | "bookings" | "calendar" | "settings"

/** Figma provider app bottom nav — Home · Bookings · Calendar · Settings */
export const PROVIDER_TABS: { key: ProviderTab; label: string; href: string }[] = [
  { key: "home", label: "Home", href: ROUTES.discover },
  { key: "bookings", label: "Bookings", href: ROUTES.bookings },
  { key: "calendar", label: "Calendar", href: ROUTES.calendar },
  { key: "settings", label: "Settings", href: ROUTES.profile },
]

export function tabFromPathname(pathname: string): AppTab {
  if (pathname.startsWith(ROUTES.bookings)) return "bookings"
  if (pathname.startsWith(ROUTES.chat)) return "chat"
  if (pathname.startsWith(ROUTES.profile)) return "profile"
  return "discover"
}

export function providerTabFromPathname(pathname: string): ProviderTab {
  if (pathname.startsWith(ROUTES.bookings)) return "bookings"
  if (pathname.startsWith(ROUTES.calendar)) return "calendar"
  if (pathname.startsWith(ROUTES.profile)) return "profile"
  return "home"
}
