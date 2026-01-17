import { Ionicons } from "@expo/vector-icons";
import {
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const palette = {
	primary: "#0A84FF",
	surface: "#F4F7FB",
	card: "#FFFFFF",
	border: "#E5E7EB",
	text: "#0F172A",
	subtext: "#475569",
	success: "#16A34A",
	shadow: "rgba(0,0,0,0.08)",
};

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
					<Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
					<Text style={styles.logoutText}>Log Out</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	container: { flex: 1, padding: 20, gap: 16 },
	headerCard: {
		backgroundColor: palette.card,
		borderRadius: 18,
		padding: 18,
		alignItems: "center",
		gap: 10,
		shadowColor: palette.shadow,
		shadowOpacity: 0.12,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 8 },
		elevation: 4,
	},
	avatar: {
		width: 84,
		height: 84,
		borderRadius: 24,
		backgroundColor: "#E5F0FF",
		alignItems: "center",
		justifyContent: "center",
	},
	avatarText: { fontSize: 28, fontWeight: "800", color: palette.primary },
	name: { fontSize: 20, fontWeight: "700", color: palette.text },
	role: { fontSize: 13, color: palette.subtext },
	progressTrack: {
		width: "100%",
		height: 8,
		borderRadius: 6,
		backgroundColor: palette.border,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: palette.success,
		borderRadius: 6,
	},
	menuCard: {
		backgroundColor: palette.card,
		borderRadius: 16,
		paddingVertical: 4,
		shadowColor: palette.shadow,
		shadowOpacity: 0.1,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 6 },
		elevation: 3,
	},
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 14,
		gap: 12,
		borderBottomWidth: 1,
		borderBottomColor: palette.border,
	},
	menuText: { flex: 1, fontSize: 15, color: palette.text, fontWeight: "600" },
	logoutBtn: {
		marginTop: "auto",
		height: 52,
		borderRadius: 14,
		backgroundColor: palette.primary,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		shadowColor: palette.shadow,
		shadowOpacity: 0.2,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 8 },
		elevation: 4,
	},
	logoutText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
