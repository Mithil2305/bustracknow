import { StyleSheet, Text, View } from "react-native";
import { palette, radius, shadow, spacing } from "../../design/tokens";

export default function BusMarker({
	label = "45A",
	eta = "2 min",
	crowd = "Moderate",
	active = true,
}) {
	return (
		<View style={[styles.wrap, !active && { opacity: 0.55 }]}>
			<View
				style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
			>
				<Text style={styles.label}>{label}</Text>
			</View>
			<View
				style={[styles.dot, active ? styles.dotActive : styles.dotInactive]}
			/>
			<Text style={styles.meta}>
				{eta} • {crowd}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: { alignItems: "center", gap: 4 },
	pill: {
		paddingHorizontal: spacing.md,
		paddingVertical: 6,
		borderRadius: radius.md,
		...shadow.card,
	},
	pillActive: { backgroundColor: palette.primary },
	pillInactive: { backgroundColor: palette.border },
	label: { color: "#fff", fontWeight: "800", fontSize: 14 },
	dot: {
		width: 12,
		height: 12,
		borderRadius: 6,
		borderWidth: 2,
		borderColor: "#fff",
	},
	dotActive: { backgroundColor: palette.primary },
	dotInactive: { backgroundColor: palette.border },
	meta: {
		color: palette.subtext,
		fontSize: 12,
		fontWeight: "700",
		backgroundColor: "#FFFFFFEE",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: radius.sm,
	},
});
