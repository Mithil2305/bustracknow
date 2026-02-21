export const palette = {
  primary: "#0D9488",
  primaryDark: "#0F766E",
  primaryLight: "#CCFBF1",
  secondary: "#2563EB",
  secondaryLight: "#DBEAFE",
  success: "#10B981",
  successLight: "#ECFDF5",
  warning: "#F59E0B",
  warningLight: "#FFFBEB",
  warningBorder: "#FEF3C7",
  warningDark: "#D97706",
  danger: "#EF4444",
  dangerLight: "#FEF2F2",
  offline: "#64748B",
  background: "#F8FAFC",
  surface: "#F1F5F9",
  card: "#FFFFFF",
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  text: "#0F172A",
  subtext: "#475569",
  muted: "#94A3B8",
  shadow: "rgba(0,0,0,0.08)",
  dark: "#1E293B",
  darkMuted: "#334155",
};

export const radius = {
  xs: 8,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

/**
 * Color aliases used by UI components.
 */
export const colors = {
  ...palette,
  gray50: "#F8FAFC",
  gray100: "#F1F5F9",
  gray200: "#E2E8F0",
  gray300: "#CBD5E1",
  gray400: "#94A3B8",
  gray500: "#64748B",
  gray600: "#475569",
  gray700: "#334155",
  gray800: "#1E293B",
  gray900: "#0F172A",
};

export const shadow = {
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  elevated: {
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  soft: {
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
};
