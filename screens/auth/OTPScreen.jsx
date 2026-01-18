import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { palette, radius, shadow, spacing } from "../../design/tokens";

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
		const val = text.replace(/[^0-9]/g, "").slice(-1);
		const next = [...otp];
		next[idx] = val;
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
					style={styles.primary}
					disabled={!filled}
					onPress={() => router.push("/profile")}
				>
					<Text style={styles.primaryText}>Verify & Continue</Text>
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
	container: { padding: spacing.lg, gap: spacing.md },
	header: { alignItems: "center", gap: spacing.xs },
	logo: { fontSize: 36 },
	brand: { fontSize: 18, fontWeight: "800", color: palette.primaryDark },
	title: {
		fontSize: 22,
		fontWeight: "800",
		color: palette.text,
		textAlign: "center",
	},
	subtitle: { fontSize: 14, color: palette.subtext, textAlign: "center" },
	otpRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: spacing.sm,
	},
	otpBox: {
		flex: 1,
		height: 60,
		borderRadius: radius.lg,
		borderWidth: 1,
		borderColor: palette.border,
		textAlign: "center",
		fontSize: 22,
		backgroundColor: palette.card,
		...shadow.card,
	},
	primary: {
		height: 54,
		borderRadius: radius.lg,
		backgroundColor: palette.primary,
		alignItems: "center",
		justifyContent: "center",
		...shadow.elevated,
	},
	primaryText: { color: "#fff", fontSize: 16, fontWeight: "700" },
	resend: { textAlign: "center", color: palette.subtext, fontSize: 13 },
});
