import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { palette, radius, spacing } from "../../design/tokens";

/**
 * Badge pill component for gamification display.
 * Used in profiles, leaderboard, and contribution screens.
 */
export default function Badge({
	label,
	icon = "ribbon",
	color = palette.primary,
	size = "md", // sm | md | lg
	variant = "filled", // filled | outlined
}) {
	const sizeConfig = {
		sm: { fontSize: 11, iconSize: 12, px: spacing.xs, py: 2 },
		md: { fontSize: 13, iconSize: 14, px: spacing.sm, py: 4 },
		lg: { fontSize: 15, iconSize: 16, px: spacing.md, py: spacing.xs },
	};

	const s = sizeConfig[size] || sizeConfig.md;
	const isFilled = variant === "filled";

	return (
		<View
			style={[
				styles.badge,
				{
					backgroundColor: isFilled ? color : "transparent",
					borderColor: color,
					borderWidth: isFilled ? 0 : 1.5,
					paddingHorizontal: s.px,
					paddingVertical: s.py,
				},
			]}
		>
			<Ionicons
				name={icon}
				size={s.iconSize}
				color={isFilled ? "#fff" : color}
			/>
			<Text
				style={[
					styles.label,
					{ fontSize: s.fontSize, color: isFilled ? "#fff" : color },
				]}
			>
				{label}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	badge: {
		flexDirection: "row",
		alignItems: "center",
		gap: 3,
		borderRadius: radius.xl,
		alignSelf: "flex-start",
	},
	label: {
		fontWeight: "700",
	},
});
