// MicroLink Super Admin — dark glassmorphism theme (mirrors main app TH.dark)
export const AT = {
  bg: "#07061a",
  bgGrad: "linear-gradient(135deg,#07061a 0%,#0e0c2a 50%,#120e35 100%)",
  card: "rgba(18,14,44,0.65)",
  border: "rgba(139,92,246,0.2)",
  borderStrong: "rgba(139,92,246,0.4)",
  text: "#f0edff",
  sub: "#9b8fc0",
  muted: "#6b5f8a",
  primary: "#8b5cf6",
  primaryGrad: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
  accent: "#06d6a0",
  accentGrad: "linear-gradient(135deg,#06d6a0,#00b894)",
  secondary: "rgba(139,92,246,0.1)",
  danger: "#f87171",
  warn: "#fbbf24",
  sidebar: "rgba(7,6,26,0.98)",
  shadow: "0 8px 32px rgba(139,92,246,0.25)",
  glow: "rgba(139,92,246,0.4)",
} as const;

export type AdminTheme = typeof AT;

// Shared glass-card style — keyed as a plain object, cast where needed
export const GLASS_CARD = {
  background: AT.card,
  border: `1px solid ${AT.border}`,
  backdropFilter: "blur(16px) saturate(180%)",
  WebkitBackdropFilter: "blur(16px) saturate(180%)",
  borderRadius: 16,
} as const;
