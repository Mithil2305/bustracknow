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
import { palette, radius, shadow, spacing } from "../../app/design/tokens";

const seedStops = [
	{ id: "s1", name: "Central Bus Stand", area: "Downtown", active: true },
	{ id: "s2", name: "City Mall", area: "North", active: true },
	{ id: "s3", name: "Industrial Park", area: "East", active: false },
];

export default function StopManagement() {
	const [stops, setStops] = useState(seedStops);
	const [search, setSearch] = useState("");

	const toggle = (id) => {
		setStops((prev) =>
			prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
		);
	};

	const filtered = stops.filter((s) =>
		`${s.name} ${s.area}`.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.container}>
				<Text style={styles.title}>Stops</Text>
				<TextInput
					style={styles.input}
					placeholder="Search stops"
					value={search}
					onChangeText={setSearch}
					placeholderTextColor={palette.subtext}
				/>

				<FlatList
					data={filtered}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ gap: spacing.sm }}
					renderItem={({ item }) => (
						<View style={styles.stopCard}>
							<View style={{ flex: 1, gap: 2 }}>
								<Text style={styles.stopName}>{item.name}</Text>
								<Text style={styles.meta}>{item.area}</Text>
							</View>
							<TouchableOpacity
								style={[
									styles.statusPill,
									{ backgroundColor: item.active ? "#DCFCE7" : "#FEF3C7" },
								]}
								onPress={() => toggle(item.id)}
							>
								<Text
									style={{
										color: item.active ? palette.secondary : "#F59E0B",
										fontWeight: "700",
									}}
								>
									{item.active ? "Active" : "Paused"}
								</Text>
							</TouchableOpacity>
						</View>
					)}
				/>

				<TouchableOpacity style={styles.primary}>
					<Text style={styles.primaryText}>Add stop</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	container: { flex: 1, padding: spacing.lg, gap: spacing.md },
	title: { fontSize: 24, fontWeight: "800", color: palette.text },
	input: {
		borderWidth: 1,
		borderColor: palette.border,
		borderRadius: radius.lg,
		padding: spacing.md,
		backgroundColor: palette.card,
		color: palette.text,
		...shadow.card,
	},
	stopCard: {
		backgroundColor: palette.card,
		borderRadius: radius.lg,
		padding: spacing.md,
		borderWidth: 1,
		borderColor: palette.border,
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		...shadow.card,
	},
	stopName: { fontSize: 16, fontWeight: "700", color: palette.text },
	meta: { fontSize: 13, color: palette.subtext },
	statusPill: {
		borderRadius: radius.lg,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs,
	},
	primary: {
		marginTop: spacing.md,
		height: 52,
		borderRadius: radius.lg,
		backgroundColor: palette.primary,
		alignItems: "center",
		justifyContent: "center",
		...shadow.elevated,
	},
	primaryText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
});
