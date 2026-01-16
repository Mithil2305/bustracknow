import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const layers = [
	{ label: "Live buses", status: "Streaming" },
	{ label: "Crowd reports", status: "Enabled" },
	{ label: "Speed estimates", status: "OK" },
	{ label: "Route coverage", status: "97%" },
];

export default function GodModeMap() {
	return (
		<SafeAreaView style={styles.safe}>
			<ScrollView contentContainerStyle={styles.container}>
				<Text style={styles.title}>God Mode Map</Text>
				<Text style={styles.subtitle}>
					Monitor layers and broadcast overlays. This is a static preview for
					now.
				</Text>

				<View style={styles.mapPlaceholder}>
					<Text style={styles.mapText}>Map preview</Text>
				</View>

				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Layers</Text>
					{layers.map((l) => (
						<View key={l.label} style={styles.row}>
							<Text style={styles.label}>{l.label}</Text>
							<Text style={styles.status}>{l.status}</Text>
						</View>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: "#f7f9fc" },
	container: { padding: 16, gap: 12 },
	title: { fontSize: 26, fontWeight: "700" },
	subtitle: { fontSize: 14, color: "#4b5563" },
	mapPlaceholder: {
		height: 220,
		borderRadius: 14,
		backgroundColor: "#e0e7ff",
		alignItems: "center",
		justifyContent: "center",
	},
	mapText: { fontSize: 16, fontWeight: "700", color: "#1d4ed8" },
	card: {
		backgroundColor: "#fff",
		padding: 14,
		borderRadius: 12,
		gap: 10,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	sectionTitle: { fontSize: 18, fontWeight: "600" },
	row: { flexDirection: "row", justifyContent: "space-between" },
	label: { fontSize: 15, fontWeight: "600" },
	status: { fontSize: 14, color: "#2563eb" },
});
