import { Link } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const quickLinks = [
	{
		title: "Viewer",
		links: [
			{ label: "Home", href: "/viewer" },
			{ label: "Live Tracking", href: "/viewer/live" },
			{ label: "Route Search", href: "/viewer/search" },
			{ label: "Contribute", href: "/viewer/contribute" },
		],
	},
	{
		title: "Admin",
		links: [
			{ label: "Dashboard", href: "/admin" },
			{ label: "Routes", href: "/admin/routes" },
			{ label: "Stops", href: "/admin/stops" },
			{ label: "Users", href: "/admin/users" },
			{ label: "God Mode Map", href: "/admin/god-mode" },
		],
	},
	{
		title: "Account",
		links: [
			{ label: "Login", href: "/login" },
			{ label: "OTP", href: "/otp" },
			{ label: "Profile", href: "/profile" },
			{ label: "Settings", href: "/settings" },
		],
	},
];

export default function HomeScreen() {
	return (
		<SafeAreaView style={styles.safe}>
			<ScrollView contentContainerStyle={styles.container}>
				<Text style={styles.title}>BusTrackNow</Text>
				<Text style={styles.subtitle}>
					Jump into any area to test viewer and admin flows.
				</Text>
				<View style={styles.grid}>
					{quickLinks.map((section) => (
						<View key={section.title} style={styles.card}>
							<Text style={styles.cardTitle}>{section.title}</Text>
							{section.links.map((link) => (
								<Link key={link.href} href={link.href} style={styles.link}>
									{link.label}
								</Link>
							))}
						</View>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		backgroundColor: "#f7f9fc",
	},
	container: {
		padding: 16,
		gap: 12,
	},
	title: {
		fontSize: 26,
		fontWeight: "700",
		marginBottom: 4,
	},
	subtitle: {
		fontSize: 14,
		color: "#4b5563",
		marginBottom: 12,
	},
	grid: {
		flexDirection: "column",
		gap: 12,
	},
	card: {
		backgroundColor: "#fff",
		padding: 14,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
		gap: 8,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: "600",
	},
	link: {
		fontSize: 15,
		color: "#2563eb",
		paddingVertical: 4,
	},
});
