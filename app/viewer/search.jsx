import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
	FlatList,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { palette, radius, shadow, spacing } from "../design/tokens";

const seedResults = [
	{ id: "r1", from: "Gandhipuram", to: "Airport", eta: "5m" },
	{ id: "r2", from: "Railway Station", to: "Town Hall", eta: "8m" },
	{ id: "r3", from: "Peelamedu", to: "Central", eta: "14m" },
];

export default function RouteSearchScreen() {
	const [query, setQuery] = useState("");

	const filtered = seedResults.filter((r) =>
		`${r.from} ${r.to}`.toLowerCase().includes(query.toLowerCase())
	);

	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.container}>
				<Text style={styles.title}>Route Search</Text>
				<Text style={styles.subtitle}>Find the best bus for your trip</Text>

				<View style={styles.inputRow}>
					<Ionicons name="search" size={18} color={palette.primary} />
					<TextInput
						style={styles.input}
						placeholder="Search by stop or destination"
						value={query}
						onChangeText={setQuery}
						placeholderTextColor={palette.subtext}
					/>
				</View>

				<FlatList
					data={filtered}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ gap: spacing.sm }}
					renderItem={({ item }) => (
						<View style={styles.card}>
							<View style={{ flex: 1, gap: 2 }}>
								<Text style={styles.routeLine}>
									{item.from} → {item.to}
								</Text>
								<Text style={styles.meta}>Next bus in {item.eta}</Text>
							</View>
							<Ionicons
								name="chevron-forward"
								size={18}
								color={palette.subtext}
							/>
						</View>
					)}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	container: { flex: 1, padding: spacing.lg, gap: spacing.md },
	title: { fontSize: 24, fontWeight: "800", color: palette.text },
	subtitle: { fontSize: 14, color: palette.subtext },
	inputRow: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: palette.border,
		borderRadius: radius.lg,
		paddingHorizontal: spacing.md,
		backgroundColor: palette.card,
		...shadow.card,
		height: 52,
	},
	input: { flex: 1, marginLeft: spacing.sm, color: palette.text, fontSize: 15 },
	card: {
		backgroundColor: palette.card,
		borderRadius: radius.lg,
		padding: spacing.md,
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: palette.border,
		...shadow.card,
		gap: spacing.md,
	},
	routeLine: { fontSize: 16, fontWeight: "700", color: palette.text },
	meta: { fontSize: 13, color: palette.subtext },
});
