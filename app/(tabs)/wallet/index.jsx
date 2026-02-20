import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from "../../../components/common/Loader";
import { APP_CONSTANTS } from "../../../config/constants";
import { palette, radius, shadow, spacing } from "../../../design/tokens";
import { useAuth } from "../../../hooks/useAuth";
import { firestore } from "../../../services/firebase/firebaseConfig";

export default function WalletScreen() {
	const router = useRouter();
	const { user } = useAuth();
	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user?.uid) return;
		const fetchUser = async () => {
			try {
				const snap = await getDoc(doc(firestore, "users", user.uid));
				if (snap.exists()) setUserData(snap.data());
			} catch (e) {
				console.error("Wallet fetch error:", e);
			} finally {
				setLoading(false);
			}
		};
		fetchUser();
	}, [user]);

	if (loading) return <Loader label="Loading wallet..." />;

	const points = userData?.points || 0;
	const inrValue = (points / APP_CONSTANTS.POINTS.POINTS_TO_INR_RATIO).toFixed(
		2,
	);
	const canRedeem = points >= APP_CONSTANTS.POINTS.MIN_REDEMPTION_POINTS;

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="dark-content" />
			<ScrollView contentContainerStyle={styles.container}>
				<Text style={styles.title}>Wallet</Text>

				{/* Points Card */}
				<View style={styles.balanceCard}>
					<Text style={styles.balanceLabel}>Total Points</Text>
					<Text style={styles.balanceValue}>{points.toLocaleString()}</Text>
					<Text style={styles.balanceSub}>≈ ₹{inrValue}</Text>
				</View>

				{/* Quick Actions */}
				<View style={styles.actionsRow}>
					<TouchableOpacity
						style={[styles.actionBtn, !canRedeem && styles.actionBtnDisabled]}
						onPress={() => canRedeem && router.push("/wallet/redeem")}
						disabled={!canRedeem}
					>
						<Ionicons
							name="cash-outline"
							size={22}
							color={canRedeem ? "#fff" : palette.subtext}
						/>
						<Text
							style={[
								styles.actionText,
								!canRedeem && styles.actionTextDisabled,
							]}
						>
							Redeem
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.actionBtnSecondary}
						onPress={() => router.push("/wallet/history")}
					>
						<Ionicons name="time-outline" size={22} color={palette.primary} />
						<Text style={styles.actionTextSecondary}>History</Text>
					</TouchableOpacity>
				</View>

				{!canRedeem && (
					<View style={styles.infoCard}>
						<Ionicons name="information-circle" size={18} color="#0369A1" />
						<Text style={styles.infoText}>
							You need at least{" "}
							{APP_CONSTANTS.POINTS.MIN_REDEMPTION_POINTS.toLocaleString()}{" "}
							points (₹{APP_CONSTANTS.LIMITS.MIN_REDEMPTION_AMOUNT}) to redeem.
							Keep contributing!
						</Text>
					</View>
				)}

				{/* Earn More Section */}
				<Text style={styles.sectionTitle}>Earn More Points</Text>
				<View style={styles.card}>
					<EarnRow
						icon="navigate"
						label="Share live location"
						points="+5 pts/min (max 30)"
					/>
					<EarnRow icon="flag" label="Confirm bus stop" points="+2 pts" />
					<EarnRow icon="megaphone" label="Report bus full" points="+10 pts" />
					<EarnRow icon="megaphone" label="Report bus late" points="+8 pts" />
					<EarnRow
						icon="megaphone"
						label="Report not running"
						points="+15 pts"
					/>
					<EarnRow icon="flame" label="3-day streak" points="+30 pts bonus" />
					<EarnRow icon="flame" label="7-day streak" points="+50 pts bonus" />
					<EarnRow icon="flame" label="30-day streak" points="+200 pts bonus" />
					<EarnRow icon="people" label="Refer a friend" points="+100 pts" />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const EarnRow = ({ icon, label, points }) => (
	<View style={styles.earnRow}>
		<Ionicons name={icon} size={18} color={palette.primary} />
		<Text style={styles.earnLabel}>{label}</Text>
		<Text style={styles.earnPoints}>{points}</Text>
	</View>
);

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	container: { padding: spacing.lg, gap: spacing.md },
	title: { fontSize: 26, fontWeight: "800", color: palette.text },
	balanceCard: {
		backgroundColor: palette.primary,
		padding: spacing.xl,
		borderRadius: radius.xl,
		alignItems: "center",
		gap: 4,
		...shadow.elevated,
	},
	balanceLabel: {
		color: "rgba(255,255,255,0.8)",
		fontSize: 14,
		fontWeight: "600",
	},
	balanceValue: { color: "#fff", fontSize: 42, fontWeight: "900" },
	balanceSub: {
		color: "rgba(255,255,255,0.7)",
		fontSize: 16,
		fontWeight: "600",
	},
	actionsRow: { flexDirection: "row", gap: spacing.sm },
	actionBtn: {
		flex: 1,
		backgroundColor: palette.primary,
		borderRadius: radius.lg,
		paddingVertical: spacing.md,
		alignItems: "center",
		gap: 4,
		...shadow.elevated,
	},
	actionBtnDisabled: { backgroundColor: palette.border },
	actionText: { color: "#fff", fontWeight: "700", fontSize: 14 },
	actionTextDisabled: { color: palette.subtext },
	actionBtnSecondary: {
		flex: 1,
		backgroundColor: palette.card,
		borderRadius: radius.lg,
		paddingVertical: spacing.md,
		alignItems: "center",
		gap: 4,
		borderWidth: 1,
		borderColor: palette.border,
		...shadow.card,
	},
	actionTextSecondary: {
		color: palette.primary,
		fontWeight: "700",
		fontSize: 14,
	},
	infoCard: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		backgroundColor: "#E0F2FE",
		padding: spacing.md,
		borderRadius: radius.lg,
	},
	infoText: { flex: 1, color: "#0369A1", fontSize: 13, fontWeight: "600" },
	sectionTitle: {
		fontSize: 18,
		fontWeight: "800",
		color: palette.text,
		marginTop: spacing.sm,
	},
	card: {
		backgroundColor: palette.card,
		padding: spacing.md,
		borderRadius: radius.lg,
		gap: spacing.sm,
		...shadow.card,
	},
	earnRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
	earnLabel: { flex: 1, fontSize: 14, fontWeight: "600", color: palette.text },
	earnPoints: { fontSize: 13, fontWeight: "700", color: palette.primary },
});
