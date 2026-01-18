import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { palette, radius, shadow, spacing } from "../../design/tokens";

export default function GodModeMap() {
	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.container}>
				<Text style={styles.title}>God Mode Map</Text>
				<Text style={styles.subtitle}>
					System-wide control and diagnostics.
				</Text>

				<View style={styles.mapPlaceholder}>
					<Text style={styles.mapText}>Map + overlays placeholder</Text>
				</View>

				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Tools</Text>
					<Text style={styles.item}>• Toggle route visibility</Text>
					<Text style={styles.item}>• Force refresh vehicle locations</Text>
					<Text style={styles.item}>• Inspect stop health</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	container: { flex: 1, padding: spacing.lg, gap: spacing.md },
	title: { fontSize: 24, fontWeight: "800", color: palette.text },
	subtitle: { fontSize: 14, color: palette.subtext },
	mapPlaceholder: {
		height: 220,
		borderRadius: radius.xl,
		backgroundColor: "#E0E7FF",
		alignItems: "center",
		justifyContent: "center",
		...shadow.card,
	},
	mapText: { color: palette.subtext, fontWeight: "600" },
	card: {
		backgroundColor: palette.card,
		borderRadius: radius.lg,
		padding: spacing.md,
		...shadow.card,
		gap: 6,
	},
	sectionTitle: { fontSize: 16, fontWeight: "800", color: palette.text },
	item: { fontSize: 14, color: palette.subtext },
});
