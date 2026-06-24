export const ROUTES = {
  entry: "/",
  login: "/login",
  forgotPassword: "/forgot-password",
  selectRole: "/select-role",
  onboardingHagee: "/onboarding",
  onboardingHagu: "/onboarding/hagu",
  home: "/home",
  /** HAGEE — swipe explore stack and sub-flows */
  explore: "/explore",
  exploreRefine: "/explore/refine",
  exploreMatches: "/explore/matches",
  /** HAGU — provider home (not shared with HAGEE explore) */
  discover: "/discover",
  discoverWelcome: "/home",
  /** @deprecated Use ROUTES.exploreRefine — kept for legacy redirects */
  discoverRefine: "/discover/refine",
  /** @deprecated Use ROUTES.exploreMatches */
  discoverMatches: "/discover/matches",
  bookings: "/bookings",
  calendar: "/calendar",
  chat: "/chat",
  chatThread: (id: string) => `/chat/${id}` as const,
  requests: "/requests",
  reviews: "/reviews",
  review: (id: string) => `/reviews/${id}` as const,
  profile: "/profile",
  profileEdit: "/profile/edit",
  settings: "/settings",
  settingsTransactions: "/settings/transactions",
} as const
