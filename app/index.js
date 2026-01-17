import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { palette, radius, shadow, spacing } from "./design/tokens";

const isAdmin = false; // TODO: replace with real auth/role check

const essentials = [
	{
		label: "Live Tracking",
		href: "/viewer/live",
		icon: "locate-outline",
		tag: "Live",
	},
	{
		label: "Route Search",
		href: "/viewer/search",
		icon: "search-outline",
		tag: "Plan",
	},
	{
		label: "Contribute",
		href: "/viewer/contribute",
		icon: "megaphone-outline",
		tag: "Report",
	},
	{
		label: "Profile",
		href: "/profile",
		icon: "person-circle-outline",
		tag: "You",
	},
	{
		label: "Settings",
		href: "/settings",
		icon: "settings-outline",
		tag: "Prefs",
	},
	{ label: "Login / OTP", href: "/login", icon: "key-outline", tag: "Access" },
];

const adminTiles = [
	{
		label: "Admin Dashboard",
		href: "/admin",
		icon: "speedometer-outline",
		tag: "Admin",
	},
	{
		label: "Routes",
		href: "/admin/routes",
		icon: "git-branch-outline",
		tag: "Routes",
	},
	{ label: "Stops", href: "/admin/stops", icon: "pin-outline", tag: "Stops" },
	{
		label: "Users",
		href: "/admin/users",
		icon: "people-outline",
		tag: "Users",
	},
	{
		label: "God Mode Map",
		href: "/admin/god-mode",
		icon: "planet-outline",
		tag: "Map",
	},
];

const bottomNav = [
	{ label: "Home", icon: "home-outline", href: "/" },
	{ label: "Bus", icon: "bus-outline", href: "/viewer" },
	{ label: "Settings", icon: "settings-outline", href: "/settings" },
	{
		label: "God Mode",
		icon: "planet-outline",
		href: "/admin/god-mode",
		adminOnly: true,
	},
];

export default function HomeScreen() {
	const router = useRouter();
	const navItems = bottomNav.filter((item) => !item.adminOnly || isAdmin);
	const tiles = isAdmin ? [...essentials, ...adminTiles] : essentials;

	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.wrap}>
				<ScrollView
					contentContainerStyle={styles.container}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.header}>
						<View>
							<Text style={styles.title}>BusTrackNow</Text>
							<Text style={styles.subtitle}>
								Your essential tools in one place.
							</Text>
						</View>
						<View style={styles.badge}>
							<Ionicons
								name="shield-checkmark"
								size={16}
								color={palette.secondary}
							/>
							<Text style={styles.badgeText}>Secure</Text>
						</View>
					</View>

					<View style={styles.grid}>
						{tiles.map((item) => (
							<TouchableOpacity
								key={item.href}
								style={styles.tile}
								activeOpacity={0.9}
								onPress={() => router.push(item.href)}
							>
								<View style={styles.tileTop}>
									<View style={styles.iconCircle}>
										<Ionicons
											name={item.icon}
											size={18}
											color={palette.primary}
										/>
									</View>
									<Text style={styles.tag}>{item.tag}</Text>
								</View>
								<Text style={styles.tileLabel}>{item.label}</Text>
								<View style={styles.tileFooter}>
									<Text style={styles.cta}>Open</Text>
									<Ionicons
										name="chevron-forward"
										size={16}
										color={palette.subtext}
									/>
								</View>
							</TouchableOpacity>
						))}
					</View>
				</ScrollView>

				<View style={styles.navbarContainer}>
					<View style={styles.navbar}>
						{navItems.map((item) => (
							<TouchableOpacity
								key={item.href}
								style={styles.navItem}
								activeOpacity={0.8}
								onPress={() => router.push(item.href)}
							>
								<Ionicons name={item.icon} size={20} color={palette.text} />
								<Text style={styles.navLabel}>{item.label}</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	// Extra inset at top/bottom to leave room for status icons and system gesture/back bar
	safe: {
		flex: 1,
		backgroundColor: palette.surface,
		paddingTop: spacing.lg,
		paddingBottom: spacing.lg,
	},
	wrap: { flex: 1 },
	container: {
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.sm,
		paddingBottom: spacing.xl, // keeps scrollable content above navbar
		gap: spacing.md,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	title: { fontSize: 26, fontWeight: "800", color: palette.text },
	subtitle: { fontSize: 14, color: palette.subtext, marginTop: 2 },
	badge: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: radius.lg,
		backgroundColor: "#E8FFF4",
	},
	badgeText: { color: palette.secondary, fontWeight: "700", fontSize: 12 },
	grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
	tile: {
		width: "48%",
		backgroundColor: palette.card,
		borderRadius: radius.xl,
		padding: spacing.md,
		gap: spacing.xs,
		...shadow.card,
	},
	tileTop: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	iconCircle: {
		width: 34,
		height: 34,
		borderRadius: radius.md,
		backgroundColor: "#E7F0FF",
		alignItems: "center",
		justifyContent: "center",
	},
	tag: { fontSize: 12, color: palette.subtext, fontWeight: "700" },
	tileLabel: {
		fontSize: 16,
		fontWeight: "800",
		color: palette.text,
		marginTop: 4,
	},
	tileFooter: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: spacing.xs,
	},
	cta: { color: palette.primary, fontWeight: "700", fontSize: 13 },
	navbarContainer: {
		borderTopWidth: 1,
		borderTopColor: palette.border,
		backgroundColor: palette.card,
		paddingBottom: spacing.md, // extra bottom inset for system gestures/back bar
		paddingTop: spacing.sm,
	},
	navbar: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingHorizontal: spacing.md,
	},
	navItem: { alignItems: "center", gap: 4, paddingVertical: spacing.xs },
	navLabel: { fontSize: 12, fontWeight: "700", color: palette.text },
});
