import { useState } from "react";
import {
	FlatList,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { palette, radius, shadow, spacing } from "../../app/design/tokens";

const seedBuses = [
	{ id: "b1", route: "Route A", eta: "2m", occupancy: "Low" },
	{ id: "b2", route: "Route B", eta: "6m", occupancy: "High" },
	{ id: "b3", route: "Airport Express", eta: "12m", occupancy: "Medium" },
];

export default function LiveTrackingScreen() {
	const [buses, setBuses] = useState(seedBuses);

	const refresh = () => {
		setBuses((prev) =>
			prev.map((b, i) => ({
				...b,
				eta: `${Math.max(0, parseInt(b.eta) - (i + 1))}m`,
			}))
		);
	};

	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.container}>
				<Text style={styles.title}>Live Tracking</Text>
				<Text style={styles.subtitle}>Nearby active buses</Text>

				<View style={styles.mapPlaceholder}>
					<Text style={styles.mapText}>Map preview placeholder</Text>
				</View>

				<FlatList
					data={buses}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ gap: spacing.sm }}
					renderItem={({ item }) => (
						<View style={styles.busCard}>
							<View style={styles.busInfo}>
								<Text style={styles.busRoute}>{item.route}</Text>
								<Text style={styles.busMeta}>Occupancy: {item.occupancy}</Text>
							</View>
							<View style={styles.busEta}>
								<Text style={styles.etaText}>{item.eta}</Text>
								<Text style={styles.etaLabel}>ETA</Text>
							</View>
						</View>
					)}
				/>

				<TouchableOpacity style={styles.primary} onPress={refresh}>
					<Text style={styles.primaryText}>Refresh list</Text>
				</TouchableOpacity>
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
		height: 180,
		borderRadius: radius.lg,
		backgroundColor: "#E0E7FF",
		alignItems: "center",
		justifyContent: "center",
		...shadow.card,
	},
	mapText: { color: palette.subtext, fontWeight: "600" },
	busCard: {
		backgroundColor: palette.card,
		borderRadius: radius.lg,
		padding: spacing.md,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderWidth: 1,
		borderColor: palette.border,
		...shadow.card,
	},
	busInfo: { gap: 4 },
	busRoute: { fontSize: 16, fontWeight: "700", color: palette.text },
	busMeta: { fontSize: 13, color: palette.subtext },
	busEta: { alignItems: "flex-end", gap: 2 },
	etaText: { fontSize: 18, fontWeight: "800", color: palette.primaryDark },
	etaLabel: { fontSize: 12, color: palette.subtext },
	primary: {
		marginTop: spacing.md,
		height: 52,
		borderRadius: radius.lg,
		backgroundColor: palette.primary,
		alignItems: "center",
		justifyContent: "center",
		...shadow.elevated,
	},
	primaryText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
