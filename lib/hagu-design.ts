/**
 * Design tokens from Figma reference screens:
 * - Provider Home (2467:19060)
 * - Profile Basics (2468:19975)
 * - Rates & Logistics (2468:20300)
 */
export const haguColors = {
  canvas: "#FCFFFF",
  canvasAlt: "#FEFFFF",
  surface: "#FFFFFF",
  surfaceMuted: "#F7F6F3",
  ink: "#1A1A1E",
  heading: "#2D1012",
  label: "#4A4A52",
  muted: "#8A8A96",
  placeholder: "#B8B8C2",
  accent: "#D0F1F0",
  accentStrong: "#5BBFB5",
  accentSoft: "rgba(208, 241, 240, 0.4)",
  accentSelected: "#EAF7F5",
  border: "rgba(0, 0, 0, 0.06)",
  borderStrong: "rgba(0, 0, 0, 0.1)",
  glassBorder: "rgba(208, 241, 240, 0.3)",
  glassBg: "rgba(255, 255, 255, 0.2)",
  glassNavBg: "rgba(255, 255, 255, 0.8)",
  cta: "#2D1012",
  onCta: "#FFFFFF",
  earningsCard: "#2D1012",
  pending: "#D0F1F0",
} as const

export const haguRadius = {
  input: "20px",
  card: "20px",
  cardLg: "24px",
  pill: "100px",
  chrome: "32px",
  photo: "60px",
} as const

export const haguShadow = {
  card: "0px 2px 8px rgba(26, 26, 30, 0.04)",
  chrome: "0px 20px 40px -10px rgba(45, 16, 18, 0.1)",
  phone: "0px 32px 80px rgba(0, 0, 0, 0.16), 0px 0px 0px 1px rgba(0, 0, 0, 0.07)",
} as const
