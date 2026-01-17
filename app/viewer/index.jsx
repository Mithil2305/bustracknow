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
import { COLORS, SHADOWS, SIZES } from "../constants/theme";

// Mock Component for Map (replace with actual MapView)
const MockMapBackground = () => (
	<View style={styles.mapContainer}>
		<Image
			source={{
				uri: "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/14/4824/6158.png",
			}}
			style={styles.mapImage}
			resizeMode="cover"
		/>
		{/* Mock Bus Markers */}
		<View style={[styles.marker, { top: "40%", left: "30%" }]}>
			<View style={styles.markerLabel}>
				<Text style={styles.markerText}>45A</Text>
			</View>
			<View style={styles.markerDot} />
		</View>
		<View style={[styles.marker, { top: "30%", left: "70%" }]}>
			<View style={[styles.markerLabel, { backgroundColor: COLORS.secondary }]}>
				<Text style={styles.markerText}>12C</Text>
			</View>
			<View style={[styles.markerDot, { backgroundColor: COLORS.secondary }]} />
		</View>
	</View>
);

export default function ViewerHome() {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" />

			{/* Map Background occupies top 60% approx */}
			<MockMapBackground />

			{/* Floating Header on Map */}
			<SafeAreaView style={styles.topOverlay}>
				<View style={styles.headerRow}>
					<TouchableOpacity
						style={styles.iconButton}
						onPress={() => router.push("/settings")}
					>
						<Ionicons name="menu" size={24} color={COLORS.text} />
					</TouchableOpacity>

					<View style={styles.locationPill}>
						<Ionicons name="location" size={16} color={COLORS.error} />
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

			{/* Bottom Sheet Content */}
			<View style={styles.bottomSheet}>
				<View style={styles.handle} />

				<View style={styles.sheetHeader}>
					<Text style={styles.sheetTitle}>Find your bus</Text>
				</View>

				{/* Search Bar */}
				<TouchableOpacity
					style={styles.searchBar}
					onPress={() => router.push("/viewer/search")}
				>
					<Ionicons
						name="search"
						size={20}
						color={COLORS.primary}
						style={{ marginRight: 12 }}
					/>
					<Text style={styles.searchText}>Where are you going?</Text>
				</TouchableOpacity>

				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>NEARBY STOPS</Text>
					<TouchableOpacity>
						<Text style={styles.seeAllText}>See All</Text>
					</TouchableOpacity>
				</View>

				<ScrollView
					style={styles.scrollList}
					showsVerticalScrollIndicator={false}
				>
					{/* Bus Stop Item */}
					<TouchableOpacity
						style={styles.stopCard}
						onPress={() => router.push("/viewer/live")}
					>
						<View style={[styles.iconBox, { backgroundColor: "#EFF6FF" }]}>
							<FontAwesome5 name="bus" size={20} color={COLORS.primary} />
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

					{/* Bus Stop Item 2 */}
					<TouchableOpacity style={styles.stopCard}>
						<View style={[styles.iconBox, { backgroundColor: "#FFF7ED" }]}>
							<Ionicons name="map" size={22} color={COLORS.secondary} />
						</View>
						<View style={styles.cardInfo}>
							<Text style={styles.stopName}>Railway Station</Text>
							<Text style={styles.stopMeta}>12 mins walk • 1 bus arriving</Text>
						</View>
						<View style={styles.cardStatus}>
							<Text style={[styles.statusTime, { color: COLORS.text }]}>
								5m
							</Text>
							<Text style={styles.statusBus}>Bus 12C</Text>
						</View>
					</TouchableOpacity>

					{/* Bus Stop Item 3 */}
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
								color={COLORS.textPlaceholder}
							/>
						</View>
					</TouchableOpacity>
				</ScrollView>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.surface,
	},
	mapContainer: {
		position: "absolute",
		top: 0,
		width: "100%",
		height: "65%", // Map takes up top portion
	},
	mapImage: {
		width: "100%",
		height: "100%",
	},
	marker: {
		position: "absolute",
		alignItems: "center",
	},
	markerLabel: {
		backgroundColor: COLORS.primary,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		marginBottom: 4,
		...SHADOWS.light,
	},
	markerText: {
		color: COLORS.white,
		fontWeight: "bold",
		fontSize: 10,
	},
	markerDot: {
		width: 16,
		height: 16,
		borderRadius: 8,
		backgroundColor: COLORS.primary,
		borderWidth: 2,
		borderColor: COLORS.white,
	},
	topOverlay: {
		position: "absolute",
		top: 0,
		width: "100%",
		zIndex: 10,
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: 10,
	},
	iconButton: {
		width: 44,
		height: 44,
		backgroundColor: "rgba(255,255,255,0.95)",
		borderRadius: 22,
		justifyContent: "center",
		alignItems: "center",
		...SHADOWS.light,
	},
	locationPill: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255,255,255,0.95)",
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 24,
		...SHADOWS.light,
	},
	locationText: {
		marginLeft: 6,
		fontWeight: "700",
		color: COLORS.text,
		fontSize: 13,
	},
	profileButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		borderWidth: 2,
		borderColor: COLORS.white,
		...SHADOWS.light,
	},
	profileImage: {
		width: "100%",
		height: "100%",
		borderRadius: 22,
	},
	bottomSheet: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		height: "45%",
		backgroundColor: COLORS.white,
		borderTopLeftRadius: 32,
		borderTopRightRadius: 32,
		paddingHorizontal: SIZES.padding,
		paddingTop: 12,
		...SHADOWS.primary, // Strong shadow to separate from map
	},
	handle: {
		width: 40,
		height: 4,
		backgroundColor: COLORS.border,
		borderRadius: 2,
		alignSelf: "center",
		marginBottom: 20,
	},
	sheetHeader: {
		marginBottom: 16,
	},
	sheetTitle: {
		fontSize: SIZES.h3,
		fontWeight: "700",
		color: COLORS.text,
	},
	searchBar: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: COLORS.surface,
		paddingHorizontal: 16,
		height: 52,
		borderRadius: SIZES.radius,
		borderWidth: 1,
		borderColor: COLORS.surfaceHighlight,
		marginBottom: 24,
	},
	searchText: {
		color: COLORS.textPlaceholder,
		fontSize: 14,
		fontWeight: "500",
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	sectionTitle: {
		fontSize: 12,
		fontWeight: "700",
		color: COLORS.textSecondary,
		letterSpacing: 0.5,
	},
	seeAllText: {
		color: COLORS.primary,
		fontSize: 12,
		fontWeight: "700",
	},
	scrollList: {
		flex: 1,
	},
	stopCard: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: COLORS.white,
		padding: 16,
		borderRadius: 20,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: COLORS.surfaceHighlight,
		...SHADOWS.light,
	},
	iconBox: {
		width: 48,
		height: 48,
		borderRadius: 14,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	cardInfo: {
		flex: 1,
	},
	stopName: {
		fontSize: 15,
		fontWeight: "700",
		color: COLORS.text,
		marginBottom: 4,
	},
	stopMeta: {
		fontSize: 12,
		color: COLORS.textSecondary,
	},
	cardStatus: {
		alignItems: "flex-end",
	},
	statusTime: {
		fontSize: 14,
		fontWeight: "700",
		color: COLORS.success,
		marginBottom: 2,
	},
	statusBus: {
		fontSize: 11,
		color: COLORS.textPlaceholder,
	},
});
