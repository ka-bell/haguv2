export const ROUTES = {
  entry: "/",
  login: "/login",
  forgotPassword: "/forgot-password",
  selectRole: "/select-role",
  onboardingHagee: "/onboarding",
  onboardingHagu: "/onboarding/hagu",
  discover: "/discover",
  bookings: "/bookings",
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

export function tabFromPathname(pathname: string): AppTab {
  if (pathname.startsWith(ROUTES.bookings)) return "bookings"
  if (pathname.startsWith(ROUTES.chat)) return "chat"
  if (pathname.startsWith(ROUTES.profile)) return "profile"
  return "discover"
}
