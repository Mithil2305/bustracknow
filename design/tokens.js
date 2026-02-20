export const palette = {
	primary: "#0D9488", // Teal (PDF spec - brand color)
	primaryDark: "#0F766E",
	secondary: "#2563EB", // Blue (PDF spec - actions)
	success: "#10B981", // Green (positive states)
	warning: "#F59E0B", // Amber (alerts/caution)
	danger: "#EF4444", // Red (errors/critical)
	offline: "#64748B", // Gray (offline state)
	surface: "#F4F7FB",
	card: "#FFFFFF",
	border: "#E5E7EB",
	text: "#0F172A",
	subtext: "#475569",
	shadow: "rgba(0,0,0,0.08)",
};

export const radius = {
	xs: 8,
	sm: 10,
	md: 12,
	lg: 14,
	xl: 18,
};

export const spacing = {
	xs: 6,
	sm: 10,
	md: 14,
	lg: 18,
	xl: 22,
	xxl: 28,
};

export const shadow = {
	card: {
		shadowColor: palette.shadow,
		shadowOpacity: 0.12,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 6 },
		elevation: 4,
	},
	elevated: {
		shadowColor: palette.shadow,
		shadowOpacity: 0.2,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 10 },
		elevation: 6,
	},
};
