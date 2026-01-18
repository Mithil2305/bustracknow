import { useState } from "react";
import {
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { palette, radius, shadow, spacing } from "../../design/tokens";

const seedRoutes = [
	{ id: "1", name: "Route A", distance: "12.4 km", active: true },
	{ id: "2", name: "Route B", distance: "9.8 km", active: false },
	{ id: "3", name: "Airport Express", distance: "22.1 km", active: true },
];

export default function RouteManagement() {
	const [routes, setRoutes] = useState(seedRoutes);
	const [search, setSearch] = useState("");

	const toggle = (id) => {
		setRoutes((prev) =>
			prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)),
		);
	};

	const filtered = routes.filter((r) =>
		r.name.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.container}>
				<Text style={styles.title}>Routes</Text>
				<TextInput
					style={styles.input}
					placeholder="Search routes"
					value={search}
					onChangeText={setSearch}
					placeholderTextColor={palette.subtext}
				/>

				<FlatList
					data={filtered}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ gap: spacing.sm }}
					renderItem={({ item }) => (
						<View style={styles.routeCard}>
							<View style={{ flex: 1, gap: 2 }}>
								<Text style={styles.routeName}>{item.name}</Text>
								<Text style={styles.meta}>{item.distance}</Text>
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
					<Text style={styles.primaryText}>Add route</Text>
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
	routeCard: {
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
	routeName: { fontSize: 16, fontWeight: "700", color: palette.text },
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
