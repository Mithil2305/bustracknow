import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { radius, spacing } from "../../design/tokens";

/**
 * "Offline mode" banner displayed when device loses connectivity.
 * Shows cached data timestamp if available.
 */
export default function OfflineBanner({ lastSyncTime }) {
	const syncLabel = lastSyncTime
		? `Last synced: ${new Date(lastSyncTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
		: "Using cached data";

	return (
		<View style={styles.container}>
			<Ionicons name="cloud-offline" size={16} color="#fff" />
			<Text style={styles.text}>Offline Mode</Text>
			<Text style={styles.sub}>{syncLabel}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		backgroundColor: "#64748B",
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs,
		borderRadius: radius.md,
		alignSelf: "stretch",
	},
	text: { color: "#fff", fontSize: 13, fontWeight: "700" },
	sub: {
		color: "rgba(255,255,255,0.7)",
		fontSize: 11,
		fontWeight: "600",
		marginLeft: "auto",
	},
});
