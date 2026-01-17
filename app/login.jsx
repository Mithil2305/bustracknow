import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const palette = {
	primary: "#0A84FF",
	primaryDark: "#0060DF",
	surface: "#F4F7FB",
	card: "#FFFFFF",
	border: "#E5E7EB",
	text: "#0F172A",
	subtext: "#475569",
	success: "#16A34A",
	error: "#EF4444",
	shadow: "rgba(0,0,0,0.08)",
};

export default function LoginScreen() {
	const router = useRouter();
	const [phone, setPhone] = useState("");
	const [status, setStatus] = useState(
		"We’ll send a 6-digit code to your number"
	);

	const handleSendOtp = () => {
		setStatus("Sending code...");
		setTimeout(() => {
			setStatus("Code sent. Check your phone.");
			router.push("/otp");
		}, 500);
	};

	return (
		<SafeAreaView style={styles.safe}>
			<ScrollView contentContainerStyle={styles.container}>
				<View style={styles.header}>
					<View style={styles.logoCircle}>
						<Text style={styles.logoIcon}>🚌</Text>
					</View>
					<Text style={styles.brand}>BusTrackNow</Text>
				</View>

				<Text style={styles.title}>Login</Text>
				<Text style={styles.subtitle}>Enter your phone number to continue</Text>

				<View style={styles.card}>
					<Text style={styles.label}>PHONE NUMBER</Text>
					<View style={styles.inputRow}>
						<Text style={styles.countryCode}>🇮🇳 +91</Text>
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

					<TouchableOpacity style={styles.primaryBtn} onPress={handleSendOtp}>
						<Text style={styles.primaryBtnText}>Send OTP</Text>
						<Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
					</TouchableOpacity>

					<Text style={styles.status}>{status}</Text>
				</View>

				<Text style={styles.terms}>
					By continuing, you agree to our <Text style={styles.link}>Terms</Text>{" "}
					& <Text style={styles.link}>Privacy</Text>.
				</Text>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	container: { padding: 20, gap: 16 },
	header: { alignItems: "center", marginBottom: 8 },
	logoCircle: {
		width: 72,
		height: 72,
		borderRadius: 20,
		backgroundColor: palette.primary,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: palette.shadow,
		shadowOpacity: 0.2,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 6 },
		elevation: 5,
	},
	logoIcon: { fontSize: 36, color: "#FFFFFF" },
	brand: {
		marginTop: 10,
		fontSize: 20,
		fontWeight: "800",
		color: palette.primaryDark,
	},
	title: { fontSize: 26, fontWeight: "700", color: palette.text },
	subtitle: { fontSize: 14, color: palette.subtext },
	card: {
		backgroundColor: palette.card,
		borderRadius: 16,
		padding: 16,
		gap: 12,
		shadowColor: palette.shadow,
		shadowOpacity: 0.12,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 6 },
		elevation: 4,
	},
	label: {
		fontSize: 12,
		fontWeight: "700",
		color: palette.subtext,
		letterSpacing: 0.4,
	},
	inputRow: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: palette.border,
		borderRadius: 12,
		paddingHorizontal: 12,
		height: 54,
		backgroundColor: "#F8FAFC",
	},
	countryCode: { fontSize: 16, fontWeight: "600", color: palette.text },
	divider: {
		width: 1,
		height: "60%",
		backgroundColor: palette.border,
		marginHorizontal: 10,
	},
	input: { flex: 1, fontSize: 16, color: palette.text },
	primaryBtn: {
		marginTop: 8,
		height: 54,
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
	primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
	status: { fontSize: 13, color: palette.subtext },
	terms: { fontSize: 12, color: palette.subtext, textAlign: "center" },
	link: { color: palette.primaryDark, fontWeight: "700" },
});
