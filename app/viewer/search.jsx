import { useMemo, useState } from "react";
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
	{ id: "1", name: "Route A", from: "Central", to: "Uptown" },
	{ id: "2", name: "Route B", from: "Central", to: "Waterfront" },
	{ id: "3", name: "Airport Express", from: "Central", to: "Airport" },
];

export default function RouteSearchScreen() {
	const [query, setQuery] = useState("");
	const results = useMemo(
		() =>
			seedRoutes.filter(
				(r) =>
					r.name.toLowerCase().includes(query.toLowerCase()) ||
					r.to.toLowerCase().includes(query.toLowerCase()) ||
					r.from.toLowerCase().includes(query.toLowerCase())
			),
		[query]
	);

	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.container}>
				<Text style={styles.title}>Search Routes</Text>
				<TextInput
					style={styles.input}
					placeholder="Try 'Airport'"
					value={query}
					onChangeText={setQuery}
				/>

				<FlatList
					data={results}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<View style={styles.card}>
							<View style={{ flex: 1 }}>
								<Text style={styles.name}>{item.name}</Text>
								<Text style={styles.meta}>
									{item.from} → {item.to}
								</Text>
							</View>
							<TouchableOpacity style={styles.badge}>
								<Text style={styles.badgeText}>Track</Text>
							</TouchableOpacity>
						</View>
					)}
					ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
					ListEmptyComponent={() => (
						<Text style={{ textAlign: "center", marginTop: 20 }}>
							No results
						</Text>
					)}
				/>
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
	name: { fontSize: 16, fontWeight: "700" },
	meta: { fontSize: 13, color: "#4b5563", marginTop: 2 },
	badge: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 10,
		backgroundColor: "#2563eb",
	},
	badgeText: { color: "white", fontWeight: "700" },
});
