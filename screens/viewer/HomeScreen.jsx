import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
	Image,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { palette, radius, shadow, spacing } from "../../app/design/tokens";

const MockMapBackground = () => (
	<View style={styles.mapContainer}>
		<Image
			source={{
				uri: "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/14/4824/6158.png",
			}}
			style={styles.mapImage}
			resizeMode="cover"
		/>
		<View style={[styles.marker, { top: "42%", left: "30%" }]}>
			<View style={[styles.markerLabel, { backgroundColor: palette.primary }]}>
				<Text style={styles.markerText}>45A</Text>
			</View>
			<View style={[styles.markerDot, { backgroundColor: palette.primary }]} />
		</View>
		<View style={[styles.marker, { top: "28%", left: "68%" }]}>
			<View
				style={[styles.markerLabel, { backgroundColor: palette.secondary }]}
			>
				<Text style={styles.markerText}>12C</Text>
			</View>
			<View
				style={[styles.markerDot, { backgroundColor: palette.secondary }]}
			/>
		</View>
	</View>
);

const bentoCards = [
	{
		title: "Nearest Stop",
		value: "Gandhipuram",
		meta: "2 min walk",
		icon: "pin",
	},
	{ title: "Next Arrival", value: "45A", meta: "3m • Low crowd", icon: "bus" },
	{
		title: "Saved Place",
		value: "Home",
		meta: "Tap to navigate",
		icon: "home",
	},
	{
		title: "Search Routes",
		value: "Find a bus",
		meta: "Plan your trip",
		icon: "search",
		href: "/viewer/search",
	},
];

export default function HomeScreen() {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" />
			<MockMapBackground />

			<SafeAreaView style={styles.topOverlay}>
				<View style={styles.headerRow}>
					<TouchableOpacity
						style={styles.iconButton}
						onPress={() => router.push("/settings")}
					>
						<Ionicons name="menu" size={22} color={palette.text} />
					</TouchableOpacity>
					<View style={styles.locationPill}>
						<Ionicons name="location" size={16} color="#F97316" />
						<Text style={styles.locationText}>Coimbatore, TN</Text>
					</View>
					<TouchableOpacity
						style={styles.profileButton}
						onPress={() => router.push("/profile")}
					>
						<Image
							source={{ uri: "https://i.pravatar.cc/100?img=33" }}
							style={styles.profileImage}
						/>
					</TouchableOpacity>
				</View>
			</SafeAreaView>

			<View style={styles.bottomSheet}>
				<View style={styles.handle} />
				<Text style={styles.sheetTitle}>Dashboard</Text>

				<View style={styles.grid2}>
					{bentoCards.map((c) => (
						<TouchableOpacity
							key={c.title}
							style={styles.bento}
							onPress={() => c.href && router.push(c.href)}
							activeOpacity={c.href ? 0.8 : 1}
						>
							<View style={styles.bentoHeader}>
								<View style={styles.iconCircle}>
									<Ionicons name={c.icon} size={18} color={palette.primary} />
								</View>
								<Text style={styles.bentoMeta}>{c.meta}</Text>
							</View>
							<Text style={styles.bentoTitle}>{c.title}</Text>
							<Text style={styles.bentoValue}>{c.value}</Text>
						</TouchableOpacity>
					))}
				</View>

				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>Nearby stops</Text>
					<TouchableOpacity>
						<Text style={styles.seeAllText}>See All</Text>
					</TouchableOpacity>
				</View>

				<ScrollView
					style={{ maxHeight: 240 }}
					showsVerticalScrollIndicator={false}
				>
					<TouchableOpacity
						style={styles.stopCard}
						onPress={() => router.push("/viewer/live")}
					>
						<View style={[styles.iconBox, { backgroundColor: "#EFF6FF" }]}>
							<FontAwesome5 name="bus" size={20} color={palette.primary} />
						</View>
						<View style={styles.cardInfo}>
							<Text style={styles.stopName}>Gandhipuram Stand</Text>
							<Text style={styles.stopMeta}>
								2 mins walk • 4 buses arriving
							</Text>
						</View>
						<View style={styles.cardStatus}>
							<Text style={styles.statusTime}>Now</Text>
							<Text style={styles.statusBus}>Bus 45A</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity style={styles.stopCard}>
						<View style={[styles.iconBox, { backgroundColor: "#FFF7ED" }]}>
							<Ionicons name="walk-outline" size={22} color="#EA580C" />
						</View>
						<View style={styles.cardInfo}>
							<Text style={styles.stopName}>Race Course</Text>
							<Text style={styles.stopMeta}>
								8 mins walk • 2 buses arriving
							</Text>
						</View>
						<View style={styles.cardStatus}>
							<Text style={styles.statusTime}>5m</Text>
							<Text style={styles.statusBus}>Bus 12C</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity style={styles.stopCard}>
						<View style={[styles.iconBox, { backgroundColor: "#FAF5FF" }]}>
							<Ionicons name="home" size={22} color="#9333EA" />
						</View>
						<View style={styles.cardInfo}>
							<Text style={styles.stopName}>Home</Text>
							<Text style={styles.stopMeta}>Saved location</Text>
						</View>
						<View style={styles.cardStatus}>
							<Ionicons
								name="chevron-forward"
								size={20}
								color={palette.subtext}
							/>
						</View>
					</TouchableOpacity>
				</ScrollView>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: palette.surface },
	mapContainer: { position: "absolute", top: 0, width: "100%", height: "65%" },
	mapImage: { width: "100%", height: "100%" },
	marker: { position: "absolute", alignItems: "center" },
	markerLabel: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: radius.md,
		marginBottom: 4,
		...shadow.card,
	},
	markerText: { color: "#fff", fontWeight: "700" },
	markerDot: { width: 10, height: 10, borderRadius: 8 },
	topOverlay: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.sm,
	},
	iconButton: {
		width: 44,
		height: 44,
		borderRadius: radius.md,
		backgroundColor: palette.card,
		alignItems: "center",
		justifyContent: "center",
		...shadow.card,
	},
	locationPill: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs,
		borderRadius: radius.lg,
		backgroundColor: palette.card,
		...shadow.card,
	},
	locationText: { fontWeight: "700", color: palette.text },
	profileButton: {
		width: 44,
		height: 44,
		borderRadius: radius.md,
		overflow: "hidden",
		backgroundColor: palette.card,
		...shadow.card,
	},
	profileImage: { width: "100%", height: "100%" },
	bottomSheet: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		backgroundColor: palette.card,
		borderTopLeftRadius: radius.xl,
		borderTopRightRadius: radius.xl,
		paddingHorizontal: spacing.lg,
		paddingBottom: spacing.xl,
		paddingTop: spacing.md,
		...shadow.elevated,
	},
	handle: {
		alignSelf: "center",
		width: 50,
		height: 5,
		borderRadius: 3,
		backgroundColor: palette.border,
		marginBottom: spacing.md,
	},
	sheetTitle: {
		fontSize: 18,
		fontWeight: "800",
		color: palette.text,
		marginBottom: spacing.sm,
	},
	grid2: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" },
	bento: {
		flex: 1,
		minWidth: "48%",
		backgroundColor: "#F8FAFC",
		borderRadius: radius.lg,
		padding: spacing.md,
		gap: spacing.xs,
		...shadow.card,
	},
	bentoHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	iconCircle: {
		width: 30,
		height: 30,
		borderRadius: radius.md,
		backgroundColor: "#E7F0FF",
		alignItems: "center",
		justifyContent: "center",
	},
	bentoMeta: { fontSize: 12, color: palette.subtext },
	bentoTitle: { fontSize: 14, fontWeight: "800", color: palette.text },
	bentoValue: { fontSize: 16, fontWeight: "800", color: palette.primaryDark },
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: spacing.md,
		marginBottom: spacing.xs,
	},
	sectionTitle: {
		fontSize: 12,
		color: palette.subtext,
		letterSpacing: 0.6,
		fontWeight: "800",
	},
	seeAllText: { color: palette.primary, fontWeight: "700" },
	stopCard: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
		backgroundColor: palette.card,
		borderRadius: radius.lg,
		padding: spacing.md,
		borderWidth: 1,
		borderColor: palette.border,
		marginBottom: spacing.sm,
		...shadow.card,
	},
	iconBox: {
		width: 46,
		height: 46,
		borderRadius: radius.md,
		alignItems: "center",
		justifyContent: "center",
	},
	cardInfo: { flex: 1, gap: 2 },
	stopName: { fontSize: 16, fontWeight: "700", color: palette.text },
	stopMeta: { fontSize: 13, color: palette.subtext },
	cardStatus: { alignItems: "flex-end", gap: 2 },
	statusTime: { fontSize: 13, color: palette.primaryDark, fontWeight: "700" },
	statusBus: { fontSize: 12, color: palette.subtext },
});
