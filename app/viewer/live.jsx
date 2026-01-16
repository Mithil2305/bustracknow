import { useState } from "react";
import {
	FlatList,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const seedBuses = [
	{ id: "b1", route: "Route A", eta: "2m", occupancy: "Low" },
	{ id: "b2", route: "Route B", eta: "6m", occupancy: "High" },
	{ id: "b3", route: "Airport Express", eta: "12m", occupancy: "Medium" },
];

export default function LiveTrackingScreen() {
	const [buses, setBuses] = useState(seedBuses);

	const refresh = () => {
		setBuses((prev) => [...prev].reverse());
	};

	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.container}>
				<Text style={styles.title}>Live Tracking</Text>
				<View style={styles.mapPlaceholder}>
					<Text style={styles.mapText}>Map placeholder</Text>
				</View>

				<FlatList
					data={buses}
					keyExtractor={(item) => item.id}
					style={{ marginTop: 12 }}
					renderItem={({ item }) => (
						<View style={styles.card}>
							<View style={{ flex: 1 }}>
								<Text style={styles.route}>{item.route}</Text>
								<Text style={styles.meta}>ETA: {item.eta}</Text>
							</View>
							<Text style={styles.badge}>{item.occupancy}</Text>
						</View>
					)}
					ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
				/>

				<TouchableOpacity style={styles.primary} onPress={refresh}>
					<Text style={styles.primaryText}>Refresh list</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: "#f7f9fc" },
	container: { flex: 1, padding: 16, gap: 12 },
	title: { fontSize: 24, fontWeight: "700" },
	mapPlaceholder: {
		height: 180,
		borderRadius: 14,
		backgroundColor: "#e0e7ff",
		alignItems: "center",
		justifyContent: "center",
	},
	mapText: { fontSize: 16, fontWeight: "700", color: "#1d4ed8" },
	card: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		padding: 14,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 6,
		elevation: 1,
	},
	route: { fontSize: 16, fontWeight: "700" },
	meta: { fontSize: 13, color: "#4b5563", marginTop: 2 },
	badge: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 999,
		backgroundColor: "#2563eb",
		color: "white",
		fontWeight: "700",
	},
	primary: {
		marginTop: 8,
		backgroundColor: "#2563eb",
		padding: 14,
		borderRadius: 12,
		alignItems: "center",
	},
	primaryText: { color: "white", fontWeight: "700" },
});
