import { useState } from "react";
import {
	FlatList,
	SafeAreaView,
	StyleSheet,
	Switch,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { palette, radius, shadow, spacing } from "../design/tokens";

const seedUsers = [
	{ id: "u1", name: "Ava Chen", role: "admin", active: true },
	{ id: "u2", name: "Liam Patel", role: "viewer", active: true },
	{ id: "u3", name: "Maria Rossi", role: "viewer", active: false },
];

export default function UserManagement() {
	const [users, setUsers] = useState(seedUsers);
	const [search, setSearch] = useState("");

	const toggleActive = (id) =>
		setUsers((prev) =>
			prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
		);
	const toggleRole = (id) =>
		setUsers((prev) =>
			prev.map((u) =>
				u.id === id
					? { ...u, role: u.role === "admin" ? "viewer" : "admin" }
					: u
			)
		);

	const filtered = users.filter(
		(u) =>
			u.name.toLowerCase().includes(search.toLowerCase()) ||
			u.role.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.container}>
				<Text style={styles.title}>Users</Text>
				<TextInput
					style={styles.input}
					placeholder="Search by name or role"
					value={search}
					onChangeText={setSearch}
					placeholderTextColor={palette.subtext}
				/>

				<FlatList
					data={filtered}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ gap: spacing.sm }}
					renderItem={({ item }) => (
						<View style={styles.card}>
							<View style={{ flex: 1 }}>
								<Text style={styles.name}>{item.name}</Text>
								<Text style={styles.meta}>Role: {item.role}</Text>
							</View>
							<View style={styles.row}>
								<TouchableOpacity
									style={styles.role}
									onPress={() => toggleRole(item.id)}
								>
									<Text style={styles.roleText}>
										{item.role === "admin" ? "Make viewer" : "Make admin"}
									</Text>
								</TouchableOpacity>
								<Switch
									value={item.active}
									onValueChange={() => toggleActive(item.id)}
								/>
							</View>
						</View>
					)}
				/>

				<TouchableOpacity style={styles.primary}>
					<Text style={styles.primaryText}>Invite user</Text>
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
	card: {
		backgroundColor: palette.card,
		borderRadius: radius.lg,
		padding: spacing.md,
		borderWidth: 1,
		borderColor: palette.border,
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
		...shadow.card,
	},
	name: { fontSize: 16, fontWeight: "700", color: palette.text },
	meta: { fontSize: 13, color: palette.subtext },
	row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
	role: {
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs,
		borderRadius: radius.lg,
		backgroundColor: "#E0F2FE",
	},
	roleText: { color: palette.primaryDark, fontWeight: "700" },
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
