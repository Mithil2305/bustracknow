import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { palette, radius, shadow, spacing } from "../../app/design/tokens";

export default function LoginScreen() {
	const router = useRouter();
	const [phone, setPhone] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSendOtp = () => {
		if (!phone) {
			setError("Enter your phone number");
			return;
		}
		setError("");
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			router.push("/otp");
		}, 600);
	};

	return (
		<SafeAreaView style={styles.safe}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<View style={styles.container}>
					<View style={styles.header}>
						<View style={styles.logoCircle}>
							<Text style={styles.logoIcon}>🚌</Text>
						</View>
						<Text style={styles.brand}>BusTrackNow</Text>
					</View>

					<Text style={styles.title}>Login</Text>
					<Text style={styles.subtitle}>
						Enter your phone number to continue
					</Text>

					<View style={styles.card}>
						{error ? <Text style={styles.error}>{error}</Text> : null}
						<Text style={styles.label}>PHONE NUMBER</Text>
						<View style={styles.inputRow}>
							<Text style={styles.country}>🇮🇳 +91</Text>
							<View style={styles.divider} />
							<TextInput
								style={styles.input}
								placeholder="98765 43210"
								keyboardType="phone-pad"
								value={phone}
								onChangeText={setPhone}
								placeholderTextColor={palette.subtext}
							/>
						</View>

						<TouchableOpacity
							style={styles.primary}
							onPress={handleSendOtp}
							disabled={loading}
						>
							{loading ? (
								<ActivityIndicator color="#fff" />
							) : (
								<>
									<Text style={styles.primaryText}>Send OTP</Text>
									<Ionicons name="arrow-forward" size={18} color="#fff" />
								</>
							)}
						</TouchableOpacity>

						<Text style={styles.terms}>
							By continuing, you agree to our{" "}
							<Text style={styles.link}>Terms</Text> &{" "}
							<Text style={styles.link}>Privacy</Text>.
						</Text>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	container: { flex: 1, padding: spacing.lg, gap: spacing.md },
	header: { alignItems: "center", marginBottom: spacing.sm },
	logoCircle: {
		width: 72,
		height: 72,
		borderRadius: radius.xl,
		backgroundColor: palette.primary,
		alignItems: "center",
		justifyContent: "center",
		...shadow.card,
	},
	logoIcon: { fontSize: 36, color: "#fff" },
	brand: {
		marginTop: spacing.xs,
		fontSize: 20,
		fontWeight: "800",
		color: palette.primaryDark,
	},
	title: { fontSize: 26, fontWeight: "800", color: palette.text },
	subtitle: { fontSize: 14, color: palette.subtext },
	card: {
		backgroundColor: palette.card,
		borderRadius: radius.xl,
		padding: spacing.lg,
		gap: spacing.sm,
		...shadow.card,
	},
	label: {
		fontSize: 12,
		fontWeight: "700",
		color: palette.subtext,
		letterSpacing: 0.5,
	},
	inputRow: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: palette.border,
		borderRadius: radius.lg,
		paddingHorizontal: spacing.md,
		height: 54,
		backgroundColor: "#F8FAFC",
	},
	country: { fontSize: 16, fontWeight: "700", color: palette.text },
	divider: {
		width: 1,
		height: "60%",
		backgroundColor: palette.border,
		marginHorizontal: spacing.sm,
	},
	input: { flex: 1, fontSize: 16, color: palette.text },
	primary: {
		marginTop: spacing.sm,
		height: 54,
		borderRadius: radius.lg,
		backgroundColor: palette.primary,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: spacing.xs,
		...shadow.elevated,
	},
	primaryText: { color: "#fff", fontSize: 16, fontWeight: "700" },
	terms: { fontSize: 12, color: palette.subtext, textAlign: "center" },
	link: { color: palette.primaryDark, fontWeight: "700" },
	error: { color: "#EF4444", fontWeight: "700" },
});
