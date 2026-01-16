import { Link } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const metrics = [
	{ label: "Active Buses", value: 42, color: "#2563eb" },
	{ label: "Routes", value: 18, color: "#16a34a" },
	{ label: "Pending Reports", value: 7, color: "#f59e0b" },
];

const actions = [
	{ label: "Manage Routes", href: "/admin/routes" },
	{ label: "Manage Stops", href: "/admin/stops" },
	{ label: "Manage Users", href: "/admin/users" },
	{ label: "God Mode Map", href: "/admin/god-mode" },
];

export default function AdminDashboard() {
	return (
		<SafeAreaView style={styles.safe}>
			<ScrollView contentContainerStyle={styles.container}>
				<Text style={styles.title}>Admin Dashboard</Text>
				<Text style={styles.subtitle}>
					Monitor system status and jump into key management areas.
				</Text>

				<View style={styles.metricRow}>
					{metrics.map((m) => (
						<View
							key={m.label}
							style={[styles.metricCard, { borderColor: m.color }]}
						>
							<Text style={styles.metricValue}>{m.value}</Text>
							<Text style={styles.metricLabel}>{m.label}</Text>
						</View>
					))}
				</View>

				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Quick actions</Text>
					{actions.map((action) => (
						<Link key={action.href} href={action.href} style={styles.link}>
							{action.label}
						</Link>
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
	metricRow: { flexDirection: "row", gap: 10 },
	metricCard: {
		flex: 1,
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 14,
		borderWidth: 2,
	},
	metricValue: { fontSize: 24, fontWeight: "700" },
	metricLabel: { fontSize: 14, color: "#4b5563" },
	card: {
		backgroundColor: "#fff",
		padding: 14,
		borderRadius: 12,
		gap: 8,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	sectionTitle: { fontSize: 18, fontWeight: "600" },
	link: { fontSize: 15, color: "#2563eb", paddingVertical: 6 },
});
