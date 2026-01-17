import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
	shadow: "rgba(0,0,0,0.08)",
};

export default function OTPScreen() {
	const router = useRouter();
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [timer, setTimer] = useState(30);

	useEffect(() => {
		if (timer <= 0) return;
		const id = setTimeout(() => setTimer((t) => t - 1), 1000);
		return () => clearTimeout(id);
	}, [timer]);

	const handleChange = (text, idx) => {
		const digits = text.replace(/[^0-9]/g, "").slice(-1);
		const next = [...otp];
		next[idx] = digits;
		setOtp(next);
	};

	const filled = otp.every((d) => d.length === 1);

	return (
		<SafeAreaView style={styles.safe}>
			<ScrollView contentContainerStyle={styles.container}>
				<View style={styles.header}>
					<Text style={styles.logo}>🚌</Text>
					<Text style={styles.brand}>BusTrackNow</Text>
				</View>

				<Text style={styles.title}>Enter the 6-digit code</Text>
				<Text style={styles.subtitle}>Sent to +1234567890</Text>

				<View style={styles.otpRow}>
					{otp.map((digit, idx) => (
						<TextInput
							key={idx}
							style={styles.otpBox}
							keyboardType="number-pad"
							maxLength={1}
							value={digit}
							onChangeText={(t) => handleChange(t, idx)}
						/>
					))}
				</View>

				<TouchableOpacity
					style={styles.primaryBtn}
					disabled={!filled}
					onPress={() => router.push("/profile")}
				>
					<Text style={styles.primaryBtnText}>Verify & Continue</Text>
				</TouchableOpacity>

				<Text style={styles.resend}>
					Resend in {timer.toString().padStart(2, "0")}s
				</Text>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	container: { padding: 20, gap: 20 },
	header: { alignItems: "center", gap: 8, marginBottom: 4 },
	logo: { fontSize: 36 },
	brand: { fontSize: 18, fontWeight: "800", color: palette.primaryDark },
	title: {
		fontSize: 22,
		fontWeight: "700",
		color: palette.text,
		textAlign: "center",
	},
	subtitle: { fontSize: 14, color: palette.subtext, textAlign: "center" },
	otpRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
	otpBox: {
		flex: 1,
		height: 60,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: palette.border,
		textAlign: "center",
		fontSize: 22,
		backgroundColor: palette.card,
		shadowColor: palette.shadow,
		shadowOpacity: 0.1,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 4 },
		elevation: 3,
	},
	primaryBtn: {
		height: 54,
		borderRadius: 14,
		backgroundColor: palette.primary,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: palette.shadow,
		shadowOpacity: 0.2,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 8 },
		elevation: 4,
	},
	primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
	resend: { textAlign: "center", color: palette.subtext, fontSize: 13 },
});
