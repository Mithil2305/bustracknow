import { Link } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const highlights = [
	{ label: "Live buses near you", href: "/viewer/live", color: "#2563eb" },
	{ label: "Search a route", href: "/viewer/search", color: "#f59e0b" },
	{
		label: "Contribute a report",
		href: "/viewer/contribute",
		color: "#16a34a",
	},
];

export default function ViewerHome() {
	return (
		<SafeAreaView style={styles.safe}>
			<ScrollView contentContainerStyle={styles.container}>
				<Text style={styles.title}>Viewer Home</Text>
				<Text style={styles.subtitle}>
					Quick entry points to live tracking, route search, and community
					reports.
				</Text>

				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Highlights</Text>
					{highlights.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							style={[styles.pill, { backgroundColor: item.color }]}
						>
							{item.label}
						</Link>
					))}
				</View>

				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Today&apos;s status</Text>
					<Text style={styles.status}>Network health: Good</Text>
					<Text style={styles.status}>Average bus delay: 3m</Text>
					<Text style={styles.status}>Crowd reports: 12</Text>
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
	card: {
		backgroundColor: "#fff",
		padding: 14,
		borderRadius: 12,
		gap: 10,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	sectionTitle: { fontSize: 18, fontWeight: "600" },
	pill: {
		color: "white",
		fontWeight: "700",
		paddingVertical: 10,
		paddingHorizontal: 12,
		borderRadius: 10,
	},
	status: { fontSize: 15, color: "#111827" },
});
