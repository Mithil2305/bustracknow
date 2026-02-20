import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
	addDoc,
	collection,
	doc,
	getDoc,
	increment,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
	Alert,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../components/common/Button";
import Loader from "../../../components/common/Loader";
import { APP_CONSTANTS } from "../../../config/constants";
import { palette, radius, shadow, spacing } from "../../../design/tokens";
import { useAuth } from "../../../hooks/useAuth";
import { firestore } from "../../../services/firebase/firebaseConfig";

export default function RedeemScreen() {
	const router = useRouter();
	const { user } = useAuth();
	const [userData, setUserData] = useState(null);
	const [upiId, setUpiId] = useState("");
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (!user?.uid) return;
		const fetchUser = async () => {
			try {
				const snap = await getDoc(doc(firestore, "users", user.uid));
				if (snap.exists()) {
					setUserData(snap.data());
					setUpiId(snap.data().upiId || "");
				}
			} catch (e) {
				console.error("Redeem fetch error:", e);
			} finally {
				setLoading(false);
			}
		};
		fetchUser();
	}, [user]);

	if (loading) return <Loader label="Loading..." />;

	const points = userData?.points || 0;
	const redeemableAmount = Math.floor(
		points / APP_CONSTANTS.POINTS.POINTS_TO_INR_RATIO,
	);
	const canRedeem = points >= APP_CONSTANTS.POINTS.MIN_REDEMPTION_POINTS;

	const handleRedeem = async () => {
		if (!upiId || !upiId.includes("@")) {
			Alert.alert(
				"Invalid UPI ID",
				"Please enter a valid UPI ID (e.g. name@upi)",
			);
			return;
		}

		if (!canRedeem) {
			Alert.alert(
				"Insufficient Points",
				`You need at least ${APP_CONSTANTS.POINTS.MIN_REDEMPTION_POINTS.toLocaleString()} points to redeem.`,
			);
			return;
		}

		Alert.alert(
			"Confirm Redemption",
			`Redeem ${points.toLocaleString()} points for ₹${redeemableAmount}?\n\nUPI: ${upiId}`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Confirm",
					onPress: async () => {
						setSubmitting(true);
						try {
							// Create redemption request
							const redemptionRef = await addDoc(
								collection(firestore, "redemptions"),
								{
									userId: user.uid,
									pointsUsed: points,
									amount: redeemableAmount,
									upiId,
									status: "pending",
									createdAt: serverTimestamp(),
								},
							);

							// Deduct points from user
							await updateDoc(doc(firestore, "users", user.uid), {
								points: increment(-points),
								updatedAt: serverTimestamp(),
							});

							router.replace({
								pathname: "/wallet/receipt",
								params: {
									redemptionId: redemptionRef.id,
									amount: redeemableAmount,
									pointsUsed: points,
									upiId,
								},
							});
						} catch (e) {
							console.error("Redemption error:", e);
							Alert.alert("Error", "Redemption failed. Please try again.");
						} finally {
							setSubmitting(false);
						}
					},
				},
			],
		);
	};

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="dark-content" />
			<View style={styles.container}>
				<Text style={styles.title}>Redeem Points</Text>

				<View style={styles.card}>
					<Text style={styles.cardLabel}>Available Points</Text>
					<Text style={styles.cardValue}>{points.toLocaleString()}</Text>
					<Text style={styles.cardSub}>= ₹{redeemableAmount}</Text>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>UPI ID</Text>
					<View style={styles.inputWrap}>
						<Ionicons name="wallet-outline" size={18} color={palette.subtext} />
						<TextInput
							style={styles.input}
							placeholder="yourname@upi"
							value={upiId}
							onChangeText={setUpiId}
							keyboardType="email-address"
							autoCapitalize="none"
							placeholderTextColor={palette.subtext}
						/>
					</View>
					{!upiId.includes("@") && upiId.length > 0 && (
						<Text style={styles.error}>
							Enter a valid UPI ID (e.g. name@upi)
						</Text>
					)}
				</View>

				{!userData?.upiVerified && (
					<View style={styles.warningCard}>
						<Ionicons name="warning" size={18} color="#92400E" />
						<Text style={styles.warningText}>
							UPI verification recommended.{" "}
							<Text
								style={styles.link}
								onPress={() => router.push("/wallet/verify-upi")}
							>
								Verify now
							</Text>
						</Text>
					</View>
				)}

				<View style={styles.infoCard}>
					<Ionicons name="information-circle" size={16} color="#0369A1" />
					<Text style={styles.infoText}>
						Minimum redemption:{" "}
						{APP_CONSTANTS.POINTS.MIN_REDEMPTION_POINTS.toLocaleString()} points
						(₹{APP_CONSTANTS.LIMITS.MIN_REDEMPTION_AMOUNT}). Payments are
						processed within 48 hours.
					</Text>
				</View>

				<Button
					label={submitting ? "Processing..." : `Redeem ₹${redeemableAmount}`}
					onPress={handleRedeem}
					disabled={!canRedeem || submitting || !upiId.includes("@")}
					loading={submitting}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	container: { flex: 1, padding: spacing.lg, gap: spacing.md },
	title: { fontSize: 22, fontWeight: "800", color: palette.text },
	card: {
		backgroundColor: palette.primary,
		padding: spacing.xl,
		borderRadius: radius.xl,
		alignItems: "center",
		gap: 4,
		...shadow.elevated,
	},
	cardLabel: {
		color: "rgba(255,255,255,0.8)",
		fontSize: 14,
		fontWeight: "600",
	},
	cardValue: { color: "#fff", fontSize: 36, fontWeight: "900" },
	cardSub: { color: "rgba(255,255,255,0.7)", fontSize: 16, fontWeight: "600" },
	inputGroup: { gap: spacing.xs },
	label: { fontSize: 13, fontWeight: "700", color: palette.subtext },
	inputWrap: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		borderWidth: 1,
		borderColor: palette.border,
		borderRadius: radius.lg,
		paddingHorizontal: spacing.md,
		backgroundColor: "#F8FAFC",
		...shadow.card,
		minHeight: 52,
	},
	input: {
		flex: 1,
		fontSize: 15,
		color: palette.text,
		paddingVertical: spacing.xs,
	},
	error: { color: "#EF4444", fontSize: 12, fontWeight: "700" },
	warningCard: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		backgroundColor: "#FEF3C7",
		padding: spacing.md,
		borderRadius: radius.lg,
	},
	warningText: { flex: 1, color: "#92400E", fontSize: 13, fontWeight: "600" },
	link: { color: palette.primary, textDecorationLine: "underline" },
	infoCard: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		backgroundColor: "#E0F2FE",
		padding: spacing.md,
		borderRadius: radius.lg,
	},
	infoText: { flex: 1, color: "#0369A1", fontSize: 12, fontWeight: "600" },
});
