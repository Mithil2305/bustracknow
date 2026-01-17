import { Link } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { palette, radius, shadow, spacing } from "../design/tokens";

const links = [
	{ label: "Dashboard", href: "/admin" },
	{ label: "Routes", href: "/admin/routes" },
	{ label: "Stops", href: "/admin/stops" },
	{ label: "Users", href: "/admin/users" },
	{ label: "God Mode Map", href: "/admin/god-mode" },
];

export default function AdminNavigator() {
	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.card}>
				<Text style={styles.title}>Admin Area</Text>
				<Text style={styles.subtitle}>
					Manage routes, stops, users, and system map.
				</Text>
				<View style={styles.links}>
					{links.map((link) => (
						<Link key={link.href} href={link.href} style={styles.link}>
							{link.label}
						</Link>
					))}
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface, padding: spacing.lg },
	card: {
		backgroundColor: palette.card,
		borderRadius: radius.xl,
		padding: spacing.lg,
		gap: spacing.sm,
		...shadow.card,
	},
	title: { fontSize: 22, fontWeight: "800", color: palette.text },
	subtitle: { fontSize: 14, color: palette.subtext, marginBottom: spacing.sm },
	links: { gap: spacing.xs },
	link: {
		fontSize: 16,
		color: palette.primary,
		fontWeight: "700",
		paddingVertical: 4,
	},
});
