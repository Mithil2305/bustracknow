import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { palette, radius, shadow, spacing } from "../../design/tokens";

const metrics = [
	{
		label: "Active Buses",
		value: 42,
		delta: "+6",
		color: palette.primary,
		icon: "bus",
	},
	{
		label: "Routes",
		value: 18,
		delta: "+1",
		color: palette.secondary,
		icon: "map",
	},
	{
		label: "Pending Reports",
		value: 7,
		delta: "-2",
		color: "#F59E0B",
		icon: "warning",
	},
];

const quickActions = [
	{ label: "Manage Routes", href: "/admin/routes", icon: "git-branch" },
	{ label: "Manage Stops", href: "/admin/stops", icon: "pin" },
	{ label: "Manage Users", href: "/admin/users", icon: "people" },
	{ label: "God Mode Map", href: "/admin/god-mode", icon: "earth" },
];

const systemCards = [
	{
		title: "Service Health",
		icon: "pulse",
		body: "All services operational. Last deploy: 12m ago.",
		badge: "Healthy",
		badgeColor: palette.secondary,
	},
	{
		title: "Data Freshness",
		icon: "time",
		body: "Live locations updating every 15s. Cache hit rate: 92%.",
		badge: "Live",
		badgeColor: palette.primary,
	},
];

export default function AdminDashboard() {
	return (
		<SafeAreaView style={styles.safe}>
			<ScrollView
				contentContainerStyle={styles.container}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.header}>
					<View>
						<Text style={styles.title}>Admin Dashboard</Text>
						<Text style={styles.subtitle}>
							Monitor operations and jump into actions.
						</Text>
					</View>
					<View style={styles.pill}>
						<Ionicons name="cloud-done" size={16} color={palette.secondary} />
						<Text style={styles.pillText}>All systems go</Text>
					</View>
				</View>

				<View style={styles.grid3}>
					{metrics.map((m) => (
						<View
							key={m.label}
							style={[styles.metricCard, { borderColor: m.color }]}
						>
							<View style={styles.metricIconCircle}>
								<Ionicons name={m.icon} size={18} color={m.color} />
							</View>
							<Text style={styles.metricValue}>{m.value}</Text>
							<Text style={styles.metricLabel}>{m.label}</Text>
							<Text style={[styles.metricDelta, { color: m.color }]}>
								{m.delta} today
							</Text>
						</View>
					))}
				</View>

				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Quick actions</Text>
					<View style={styles.grid2}>
						{quickActions.map((qa) => (
							<Link key={qa.href} href={qa.href} style={styles.actionCard}>
								<View style={styles.actionIconCircle}>
									<Ionicons name={qa.icon} size={18} color={palette.primary} />
								</View>
								<Text style={styles.actionLabel}>{qa.label}</Text>
								<Ionicons
									name="chevron-forward"
									size={16}
									color={palette.subtext}
								/>
							</Link>
						))}
					</View>
				</View>

				<View style={styles.grid2}>
					{systemCards.map((c) => (
						<View key={c.title} style={styles.infoCard}>
							<View style={styles.infoHeader}>
								<View style={styles.infoIconCircle}>
									<Ionicons
										name={c.icon}
										size={18}
										color={palette.primaryDark}
									/>
								</View>
								<View
									style={[
										styles.badge,
										{ backgroundColor: c.badgeColor + "22" },
									]}
								>
									<Text style={[styles.badgeText, { color: c.badgeColor }]}>
										{c.badge}
									</Text>
								</View>
							</View>
							<Text style={styles.infoTitle}>{c.title}</Text>
							<Text style={styles.infoBody}>{c.body}</Text>
						</View>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	container: { padding: spacing.lg, gap: spacing.md },
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	title: { fontSize: 26, fontWeight: "800", color: palette.text },
	subtitle: { fontSize: 14, color: palette.subtext },
	pill: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: radius.lg,
		backgroundColor: "#E8FFF4",
	},
	pillText: { color: palette.secondary, fontWeight: "700", fontSize: 12 },
	grid3: { flexDirection: "row", gap: spacing.sm },
	metricCard: {
		flex: 1,
		backgroundColor: palette.card,
		borderRadius: radius.lg,
		padding: spacing.md,
		borderWidth: 1,
		...shadow.card,
		gap: 4,
	},
	metricIconCircle: {
		width: 32,
		height: 32,
		borderRadius: radius.md,
		backgroundColor: "#F1F5F9",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: spacing.xs,
	},
	metricValue: { fontSize: 22, fontWeight: "800", color: palette.text },
	metricLabel: { fontSize: 12, color: palette.subtext },
	metricDelta: { fontSize: 12, fontWeight: "700" },
	card: {
		backgroundColor: palette.card,
		borderRadius: radius.xl,
		padding: spacing.md,
		gap: spacing.sm,
		...shadow.card,
	},
	sectionTitle: { fontSize: 16, fontWeight: "800", color: palette.text },
	grid2: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" },
	actionCard: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		backgroundColor: "#F8FAFC",
		borderRadius: radius.lg,
		padding: spacing.md,
		flex: 1,
		minWidth: "48%",
		...shadow.card,
	},
	actionIconCircle: {
		width: 34,
		height: 34,
		borderRadius: radius.md,
		backgroundColor: "#E7F0FF",
		alignItems: "center",
		justifyContent: "center",
	},
	actionLabel: {
		flex: 1,
		fontSize: 15,
		fontWeight: "700",
		color: palette.text,
	},
	infoCard: {
		flex: 1,
		backgroundColor: palette.card,
		borderRadius: radius.lg,
		padding: spacing.md,
		minWidth: "48%",
		...shadow.card,
		gap: spacing.xs,
	},
	infoHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	infoIconCircle: {
		width: 34,
		height: 34,
		borderRadius: radius.md,
		backgroundColor: "#E7F0FF",
		alignItems: "center",
		justifyContent: "center",
	},
	badge: {
		paddingHorizontal: spacing.sm,
		paddingVertical: 4,
		borderRadius: radius.md,
	},
	badgeText: { fontWeight: "800", fontSize: 12 },
	infoTitle: { fontSize: 16, fontWeight: "800", color: palette.text },
	infoBody: { fontSize: 14, color: palette.subtext },
});
