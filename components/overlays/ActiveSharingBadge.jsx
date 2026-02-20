import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { radius, spacing } from "../../design/tokens";

/**
 * "Sharing Live Location" floating badge shown during active broadcast.
 */
export default function ActiveSharingBadge({
	routeNumber,
	minutesActive = 0,
	pointsEarned = 0,
}) {
	return (
		<View style={styles.container}>
			<View style={styles.dot} />
			<Ionicons name="navigate" size={16} color="#fff" />
			<View style={styles.content}>
				<Text style={styles.label}>Sharing Live • {routeNumber}</Text>
				<Text style={styles.meta}>
					{minutesActive}m • +{pointsEarned} pts
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		backgroundColor: "#0D9488",
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs,
		borderRadius: radius.xl,
		alignSelf: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 4,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#EF4444",
	},
	content: { marginLeft: 2 },
	label: { color: "#fff", fontSize: 13, fontWeight: "700" },
	meta: { color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: "600" },
});
