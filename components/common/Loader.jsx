import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { palette, radius, shadow, spacing } from "../../app/design/tokens";

export default function Loader({ label = "Loading...", inline = false }) {
	if (inline) {
		return (
			<View style={styles.inline}>
				<ActivityIndicator color={palette.primary} />
				<Text style={styles.inlineText}>{label}</Text>
			</View>
		);
	}
	return (
		<View style={styles.card}>
			<ActivityIndicator size="large" color={palette.primary} />
			<Text style={styles.label}>{label}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: palette.card,
		padding: spacing.md,
		borderRadius: radius.lg,
		alignItems: "center",
		gap: spacing.xs,
		...shadow.card,
	},
	label: { color: palette.text, fontWeight: "700" },
	inline: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
	inlineText: { color: palette.text, fontWeight: "600" },
});
