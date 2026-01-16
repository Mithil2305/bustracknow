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

const seedUsers = [
	{ id: "u1", name: "Ava Chen", role: "admin", active: true },
	{ id: "u2", name: "Liam Patel", role: "viewer", active: true },
	{ id: "u3", name: "Maria Rossi", role: "viewer", active: false },
];

export default function UserManagement() {
	const [users, setUsers] = useState(seedUsers);
	const [search, setSearch] = useState("");

	const toggleActive = (id) => {
		setUsers((prev) =>
			prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
		);
	};

	const toggleRole = (id) => {
		setUsers((prev) =>
			prev.map((u) =>
				u.id === id
					? { ...u, role: u.role === "admin" ? "viewer" : "admin" }
					: u
			)
		);
	};

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
				/>

				<FlatList
					data={filtered}
					keyExtractor={(item) => item.id}
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
					ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
				/>

				<TouchableOpacity style={styles.primary}>
					<Text style={styles.primaryText}>Invite user</Text>
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
	name: { fontSize: 16, fontWeight: "700" },
	meta: { fontSize: 13, color: "#4b5563", marginTop: 2 },
	row: { flexDirection: "row", alignItems: "center", gap: 8 },
	role: {
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderRadius: 10,
		backgroundColor: "#2563eb",
	},
	roleText: { color: "white", fontWeight: "700" },
	primary: {
		marginTop: 8,
		backgroundColor: "#2563eb",
		padding: 14,
		borderRadius: 12,
		alignItems: "center",
	},
	primaryText: { color: "white", fontWeight: "700" },
});
