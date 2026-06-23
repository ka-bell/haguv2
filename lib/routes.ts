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
  chatThread: (id: string) => `/chat/${id}` as const,
  requests: "/requests",
  reviews: "/reviews",
  review: (id: string) => `/reviews/${id}` as const,
  profile: "/profile",
  settings: "/settings",
  settingsTransactions: "/settings/transactions",
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
  { key: "settings", label: "Settings", href: ROUTES.settings },
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
  if (pathname.startsWith(ROUTES.settings) || pathname.startsWith(ROUTES.profile)) return "settings"
  if (pathname.startsWith(ROUTES.requests)) return "home"
  if (pathname.startsWith(ROUTES.reviews)) return "home"
  return "home"
}
