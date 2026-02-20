import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { palette, radius, shadow, spacing } from "../../design/tokens";

/**
 * Route card displayed inside the bottom sheet.
 * Shows route number, name, ETA, and crowd level.
 */
export default function RouteCard({
	routeNumber,
	routeName,
	eta,
	crowdLevel = "low", // low | medium | high
	busCount = 0,
	onPress,
}) {
	const crowdConfig = {
		low: { label: "Low Crowd", color: "#10B981", bg: "#D1FAE5" },
		medium: { label: "Moderate", color: "#F59E0B", bg: "#FEF3C7" },
		high: { label: "Crowded", color: "#EF4444", bg: "#FEE2E2" },
	};

	const crowd = crowdConfig[crowdLevel] || crowdConfig.low;

	return (
		<TouchableOpacity
			style={styles.card}
			onPress={onPress}
			activeOpacity={0.85}
		>
			<View style={styles.routeBadge}>
				<Ionicons name="bus" size={18} color="#fff" />
				<Text style={styles.routeNumber}>{routeNumber}</Text>
			</View>

			<View style={styles.content}>
				<Text style={styles.routeName} numberOfLines={1}>
					{routeName}
				</Text>
				<View style={styles.metaRow}>
					{eta && (
						<View style={styles.metaItem}>
							<Ionicons name="time-outline" size={13} color={palette.subtext} />
							<Text style={styles.metaText}>{eta}</Text>
						</View>
					)}
					<View style={styles.metaItem}>
						<Ionicons name="bus-outline" size={13} color={palette.subtext} />
						<Text style={styles.metaText}>{busCount} active</Text>
					</View>
				</View>
			</View>

			<View style={[styles.crowdBadge, { backgroundColor: crowd.bg }]}>
				<Text style={[styles.crowdText, { color: crowd.color }]}>
					{crowd.label}
				</Text>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		backgroundColor: palette.card,
		padding: spacing.md,
		borderRadius: radius.lg,
		...shadow.card,
	},
	routeBadge: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		backgroundColor: palette.primary,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: radius.md,
	},
	routeNumber: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "800",
	},
	content: { flex: 1 },
	routeName: { fontSize: 15, fontWeight: "700", color: palette.text },
	metaRow: { flexDirection: "row", gap: spacing.sm, marginTop: 3 },
	metaItem: { flexDirection: "row", alignItems: "center", gap: 3 },
	metaText: { fontSize: 12, color: palette.subtext, fontWeight: "600" },
	crowdBadge: {
		paddingHorizontal: spacing.xs,
		paddingVertical: 3,
		borderRadius: radius.sm,
	},
	crowdText: { fontSize: 11, fontWeight: "700" },
});
