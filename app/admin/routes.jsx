import { useState } from "react";
import {
	FlatList,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const seedRoutes = [
	{ id: "1", name: "Route A", distance: "12.4 km", active: true },
	{ id: "2", name: "Route B", distance: "9.8 km", active: false },
	{ id: "3", name: "Airport Express", distance: "22.1 km", active: true },
];

export default function RouteManagement() {
	const [routes, setRoutes] = useState(seedRoutes);
	const [filter, setFilter] = useState("");

	const toggle = (id) => {
		setRoutes((prev) =>
			prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
		);
	};

	const filtered = routes.filter((r) =>
		r.name.toLowerCase().includes(filter.toLowerCase())
	);

	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.container}>
				<Text style={styles.title}>Routes</Text>
				<TextInput
					style={styles.input}
					placeholder="Search routes"
					value={filter}
					onChangeText={setFilter}
				/>

				<FlatList
					data={filtered}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<View style={styles.routeCard}>
							<View style={{ flex: 1 }}>
								<Text style={styles.routeName}>{item.name}</Text>
								<Text style={styles.meta}>Distance: {item.distance}</Text>
							</View>
							<TouchableOpacity
								style={[
									styles.badge,
									{ backgroundColor: item.active ? "#16a34a" : "#ef4444" },
								]}
								onPress={() => toggle(item.id)}
							>
								<Text style={styles.badgeText}>
									{item.active ? "Active" : "Paused"}
								</Text>
							</TouchableOpacity>
						</View>
					)}
					ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
				/>

				<TouchableOpacity style={styles.primary}>
					<Text style={styles.primaryText}>Add demo route</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: "#f7f9fc" },
	container: { flex: 1, padding: 16, gap: 12 },
	title: { fontSize: 24, fontWeight: "700" },
	input: {
		borderWidth: 1,
		borderColor: "#e5e7eb",
		borderRadius: 10,
		padding: 12,
		backgroundColor: "#fff",
	},
	routeCard: {
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
	routeName: { fontSize: 16, fontWeight: "700" },
	meta: { fontSize: 13, color: "#4b5563", marginTop: 2 },
	badge: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 999,
	},
	badgeText: { color: "white", fontWeight: "700" },
	primary: {
		marginTop: 8,
		backgroundColor: "#2563eb",
		padding: 14,
		borderRadius: 12,
		alignItems: "center",
	},
	primaryText: { color: "white", fontWeight: "700" },
});
