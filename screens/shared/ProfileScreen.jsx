import { Ionicons } from "@expo/vector-icons";
import {
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { palette, radius, shadow, spacing } from "../../app/design/tokens";

const MenuItem = ({ icon, label }) => (
	<TouchableOpacity style={styles.menuItem}>
		<Ionicons name={icon} size={20} color={palette.primary} />
		<Text style={styles.menuText}>{label}</Text>
		<Ionicons name="chevron-forward" size={18} color={palette.subtext} />
	</TouchableOpacity>
);

export default function ProfileScreen() {
	const trustScore = 85;
	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.container}>
				<View style={styles.headerCard}>
					<View style={styles.avatar}>
						<Text style={styles.avatarText}>JD</Text>
					</View>
					<Text style={styles.name}>John Doe</Text>
					<Text style={styles.role}>Trust Score: {trustScore}/100</Text>
					<View style={styles.progressTrack}>
						<View style={[styles.progressFill, { width: `${trustScore}%` }]} />
					</View>
				</View>

				<View style={styles.menuCard}>
					<MenuItem icon="person-outline" label="Edit Profile" />
					<MenuItem icon="bus-outline" label="My Trips" />
					<MenuItem icon="settings-outline" label="Settings" />
					<MenuItem icon="help-circle-outline" label="Help & Support" />
				</View>

				<TouchableOpacity style={styles.logoutBtn}>
					<Ionicons name="log-out-outline" size={18} color="#fff" />
					<Text style={styles.logoutText}>Log Out</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	container: { flex: 1, padding: spacing.lg, gap: spacing.md },
	headerCard: {
		backgroundColor: palette.card,
		borderRadius: radius.xl,
		padding: spacing.lg,
		alignItems: "center",
		gap: spacing.sm,
		...shadow.card,
	},
	avatar: {
		width: 84,
		height: 84,
		borderRadius: radius.xl,
		backgroundColor: "#E5F0FF",
		alignItems: "center",
		justifyContent: "center",
	},
	avatarText: { fontSize: 28, fontWeight: "800", color: palette.primary },
	name: { fontSize: 20, fontWeight: "800", color: palette.text },
	role: { fontSize: 13, color: palette.subtext },
	progressTrack: {
		width: "100%",
		height: 8,
		borderRadius: radius.md,
		backgroundColor: palette.border,
		overflow: "hidden",
	},
	progressFill: { height: "100%", backgroundColor: palette.secondary },
	menuCard: {
		backgroundColor: palette.card,
		borderRadius: radius.lg,
		paddingVertical: 4,
		...shadow.card,
	},
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
		gap: spacing.sm,
		borderBottomWidth: 1,
		borderBottomColor: palette.border,
	},
	menuText: { flex: 1, fontSize: 15, color: palette.text, fontWeight: "600" },
	logoutBtn: {
		marginTop: "auto",
		height: 52,
		borderRadius: radius.lg,
		backgroundColor: palette.primary,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: spacing.xs,
		...shadow.elevated,
	},
	logoutText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
