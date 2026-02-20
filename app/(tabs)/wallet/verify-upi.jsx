import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useState } from "react";
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
import { palette, radius, shadow, spacing } from "../../../design/tokens";
import { useAuth } from "../../../hooks/useAuth";
import { firestore } from "../../../services/firebase/firebaseConfig";

export default function VerifyUpiScreen() {
	const router = useRouter();
	const { user } = useAuth();
	const [upiId, setUpiId] = useState("");
	const [verifying, setVerifying] = useState(false);

	const handleVerify = async () => {
		if (!upiId || !upiId.includes("@")) {
			Alert.alert(
				"Invalid UPI ID",
				"Please enter a valid UPI ID (e.g. name@upi)",
			);
			return;
		}

		setVerifying(true);
		try {
			// In production, this would trigger a micro-payment verification flow
			// For MVP, we just store the UPI ID as verified
			await updateDoc(doc(firestore, "users", user.uid), {
				upiId,
				upiVerified: true,
				upiVerifiedAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			});

			Alert.alert("UPI Verified", "Your UPI ID has been saved successfully.", [
				{ text: "OK", onPress: () => router.back() },
			]);
		} catch (e) {
			console.error("UPI verification error:", e);
			Alert.alert("Error", "Verification failed. Please try again.");
		} finally {
			setVerifying(false);
		}
	};

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="dark-content" />
			<View style={styles.container}>
				<Text style={styles.title}>Verify UPI ID</Text>
				<Text style={styles.subtitle}>
					Link your UPI ID for instant payouts when you redeem points.
				</Text>

				<View style={styles.card}>
					<Ionicons name="shield-checkmark" size={48} color={palette.primary} />
					<Text style={styles.cardTitle}>Why verify?</Text>
					<Text style={styles.cardDesc}>
						A verified UPI ID ensures faster, error-free payouts. Your UPI ID is
						stored securely and only used for redemptions.
					</Text>
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

				<Button
					label={verifying ? "Verifying..." : "Verify & Save"}
					onPress={handleVerify}
					loading={verifying}
					disabled={verifying || !upiId.includes("@")}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	container: { flex: 1, padding: spacing.lg, gap: spacing.md },
	title: { fontSize: 22, fontWeight: "800", color: palette.text },
	subtitle: { fontSize: 14, color: palette.subtext, lineHeight: 20 },
	card: {
		backgroundColor: palette.card,
		padding: spacing.xl,
		borderRadius: radius.xl,
		alignItems: "center",
		gap: spacing.sm,
		...shadow.card,
	},
	cardTitle: { fontSize: 16, fontWeight: "800", color: palette.text },
	cardDesc: {
		fontSize: 13,
		color: palette.subtext,
		textAlign: "center",
		lineHeight: 20,
	},
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
});
