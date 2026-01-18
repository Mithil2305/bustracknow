import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { palette, radius, spacing } from "../../design/tokens";

export default function ErrorBanner({
	message = "Something went wrong",
	action,
	actionLabel,
}) {
	return (
		<View style={styles.bar}>
			<Ionicons name="alert-circle" size={18} color="#B91C1C" />
			<Text style={styles.text}>{message}</Text>
			{action && actionLabel ? (
				<Text style={styles.action} onPress={action}>
					{actionLabel}
				</Text>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	bar: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		backgroundColor: "#FEE2E2",
		borderRadius: radius.lg,
	},
	text: { color: "#991B1B", flex: 1, fontWeight: "700", fontSize: 13 },
	action: { color: palette.primaryDark, fontWeight: "800", fontSize: 13 },
});
