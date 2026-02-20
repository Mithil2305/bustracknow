import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { palette, spacing } from "../../design/tokens";

export default function AuthScreen() {
	const router = useRouter();
	const [phone, setPhone] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSendOtp = async () => {
		if (phone.length < 10) return;
		setLoading(true);
		try {
			// In production: trigger Firebase phone auth
			router.push({ pathname: "/(auth)/otp", params: { phone } });
		} catch (e) {
			console.error("OTP send error:", e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="dark-content" />
			<View style={styles.container}>
				<View style={styles.header}>
					<Ionicons name="bus" size={48} color={palette.primary} />
					<Text style={styles.title}>BusTrackNow</Text>
					<Text style={styles.subtitle}>
						Track buses in real-time, earn rewards
					</Text>
				</View>

				<View style={styles.form}>
					<Input
						label="Phone Number"
						placeholder="+91 XXXXX XXXXX"
						value={phone}
						onChangeText={setPhone}
						keyboardType="phone-pad"
						leftIcon={
							<Ionicons name="call-outline" size={18} color={palette.subtext} />
						}
					/>

					<Button
						label={loading ? "Sending OTP..." : "Continue with Phone"}
						onPress={handleSendOtp}
						loading={loading}
						disabled={phone.length < 10 || loading}
					/>
				</View>

				<Text style={styles.terms}>
					By continuing, you agree to our Terms of Service and Privacy Policy.
				</Text>
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
		gap: spacing.xl,
	},
	header: { alignItems: "center", gap: spacing.xs },
	title: { fontSize: 28, fontWeight: "900", color: palette.text },
	subtitle: { fontSize: 14, color: palette.subtext, textAlign: "center" },
	form: { gap: spacing.md },
	terms: {
		fontSize: 12,
		color: palette.subtext,
		textAlign: "center",
		lineHeight: 18,
	},
});
