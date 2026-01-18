import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { palette, radius, shadow, spacing } from "../../design/tokens";

export default function Button({
	label,
	onPress,
	variant = "primary", // primary | secondary | ghost
	loading = false,
	disabled = false,
	icon,
	style,
	textStyle,
}) {
	const isGhost = variant === "ghost";
	const isSecondary = variant === "secondary";
	const bg = isGhost
		? "transparent"
		: isSecondary
			? "#E7F0FF"
			: palette.primary;
	const color = isGhost
		? palette.primaryDark
		: isSecondary
			? palette.primaryDark
			: "#fff";
	const borderColor = isGhost ? palette.primary : "transparent";

	return (
		<TouchableOpacity
			activeOpacity={0.9}
			onPress={onPress}
			disabled={disabled || loading}
			style={[
				styles.base,
				{ backgroundColor: bg, borderColor },
				isGhost || isSecondary ? shadow.card : shadow.elevated,
				disabled && { opacity: 0.55 },
				style,
			]}
		>
			<View style={styles.content}>
				{icon ? <View style={styles.icon}>{icon}</View> : null}
				{loading ? (
					<ActivityIndicator color={color} />
				) : (
					<Text style={[styles.label, { color }, textStyle]}>{label}</Text>
				)}
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	base: {
		height: 52,
		borderRadius: radius.lg,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: spacing.md,
		borderWidth: 1,
	},
	content: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
	icon: { justifyContent: "center", alignItems: "center" },
	label: { fontSize: 16, fontWeight: "700" },
});
