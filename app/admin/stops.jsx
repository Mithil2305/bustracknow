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

const seedStops = [
	{ id: "s1", name: "Central Station", code: "CEN", priority: "High" },
	{ id: "s2", name: "Waterfront", code: "WTF", priority: "Medium" },
	{ id: "s3", name: "Airport T1", code: "APT", priority: "High" },
];

export default function StopManagement() {
	const [stops, setStops] = useState(seedStops);
	const [search, setSearch] = useState("");

	const filtered = stops.filter(
		(s) =>
			s.name.toLowerCase().includes(search.toLowerCase()) ||
			s.code.toLowerCase().includes(search.toLowerCase())
	);

	const promote = (id) => {
		setStops((prev) =>
			prev.map((s) =>
				s.id === id
					? { ...s, priority: s.priority === "High" ? "Medium" : "High" }
					: s
			)
		);
	};

	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.container}>
				<Text style={styles.title}>Stops</Text>
				<TextInput
					style={styles.input}
					placeholder="Search by name or code"
					value={search}
					onChangeText={setSearch}
				/>

				<FlatList
					data={filtered}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<View style={styles.card}>
							<View style={{ flex: 1 }}>
								<Text style={styles.stopName}>{item.name}</Text>
								<Text style={styles.meta}>Code: {item.code}</Text>
							</View>
							<TouchableOpacity
								style={styles.priority}
								onPress={() => promote(item.id)}
							>
								<Text style={styles.priorityText}>{item.priority}</Text>
							</TouchableOpacity>
						</View>
					)}
					ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
				/>

				<TouchableOpacity style={styles.primary}>
					<Text style={styles.primaryText}>Add demo stop</Text>
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
	stopName: { fontSize: 16, fontWeight: "700" },
	meta: { fontSize: 13, color: "#4b5563", marginTop: 2 },
	priority: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 999,
		backgroundColor: "#2563eb",
	},
	priorityText: { color: "white", fontWeight: "700" },
	primary: {
		marginTop: 8,
		backgroundColor: "#2563eb",
		padding: 14,
		borderRadius: 12,
		alignItems: "center",
	},
	primaryText: { color: "white", fontWeight: "700" },
});
