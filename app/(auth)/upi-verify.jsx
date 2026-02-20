import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { palette, radius, shadow, spacing } from "../../design/tokens";
import { useAuth } from "../../hooks/useAuth";
import { firestore } from "../../services/firebase/firebaseConfig";

export default function UpiVerifyScreen() {
	const router = useRouter();
	const { user } = useAuth();
	const [upiId, setUpiId] = useState("");
	const [verifying, setVerifying] = useState(false);

	const handleVerify = async () => {
		if (!upiId.includes("@")) {
			Alert.alert(
				"Invalid UPI ID",
				"Please enter a valid UPI ID (e.g. name@upi)",
			);
			return;
		}

		setVerifying(true);
		try {
			await updateDoc(doc(firestore, "users", user.uid), {
				upiId,
				upiVerified: true,
				upiVerifiedAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			});

			Alert.alert(
				"UPI Verified",
				"Your UPI ID has been verified successfully.",
				[{ text: "OK", onPress: () => router.back() }],
			);
		} catch (e) {
			console.error("UPI verify error:", e);
			Alert.alert("Error", "Verification failed. Please try again.");
		} finally {
			setVerifying(false);
		}
	};

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="dark-content" />
			<View style={styles.container}>
				<View style={styles.header}>
					<Ionicons name="shield-checkmark" size={48} color={palette.primary} />
					<Text style={styles.title}>UPI Verification</Text>
					<Text style={styles.subtitle}>
						Verify your UPI ID for secure redemption payouts.
					</Text>
				</View>

				<View style={styles.card}>
					<Input
						label="UPI ID"
						placeholder="yourname@upi"
						value={upiId}
						onChangeText={setUpiId}
						keyboardType="email-address"
						autoCapitalize="none"
						leftIcon={
							<Ionicons
								name="wallet-outline"
								size={18}
								color={palette.subtext}
							/>
						}
						error={
							upiId.length > 0 && !upiId.includes("@")
								? "Enter a valid UPI ID"
								: null
						}
					/>
				</View>

				<Button
					label={verifying ? "Verifying..." : "Verify UPI"}
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
	container: {
		flex: 1,
		padding: spacing.lg,
		justifyContent: "center",
		gap: spacing.lg,
	},
	header: { alignItems: "center", gap: spacing.xs },
	title: { fontSize: 22, fontWeight: "800", color: palette.text },
	subtitle: {
		fontSize: 14,
		color: palette.subtext,
		textAlign: "center",
		lineHeight: 20,
	},
	card: {
		backgroundColor: palette.card,
		padding: spacing.lg,
		borderRadius: radius.xl,
		...shadow.card,
	},
});
