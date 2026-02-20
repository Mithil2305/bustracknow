import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/common/Button";
import { palette, radius, spacing } from "../../design/tokens";

const OTP_LENGTH = 6;

export default function OTPScreen() {
	const router = useRouter();
	const { phone } = useLocalSearchParams();
	const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
	const [loading, setLoading] = useState(false);
	const [timer, setTimer] = useState(30);
	const inputRefs = useRef([]);

	useEffect(() => {
		if (timer > 0) {
			const interval = setInterval(() => setTimer((t) => t - 1), 1000);
			return () => clearInterval(interval);
		}
	}, [timer]);

	const handleChange = (text, index) => {
		const newOtp = [...otp];
		newOtp[index] = text;
		setOtp(newOtp);

		// Auto-focus next input
		if (text && index < OTP_LENGTH - 1) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyPress = (e, index) => {
		if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handleVerify = async () => {
		const code = otp.join("");
		if (code.length !== OTP_LENGTH) return;

		setLoading(true);
		try {
			// In production: verify OTP with Firebase
			router.replace("/(auth)/profile");
		} catch (e) {
			console.error("OTP verify error:", e);
		} finally {
			setLoading(false);
		}
	};

	const handleResend = () => {
		setTimer(30);
		// In production: re-trigger OTP send
	};

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="dark-content" />
			<View style={styles.container}>
				<Text style={styles.title}>Verify OTP</Text>
				<Text style={styles.subtitle}>
					Enter the 6-digit code sent to {phone || "your phone"}
				</Text>

				<View style={styles.otpRow}>
					{otp.map((digit, index) => (
						<TextInput
							key={index}
							ref={(ref) => {
								inputRefs.current[index] = ref;
							}}
							style={[styles.otpInput, digit && styles.otpInputFilled]}
							value={digit}
							onChangeText={(text) => handleChange(text, index)}
							onKeyPress={(e) => handleKeyPress(e, index)}
							keyboardType="number-pad"
							maxLength={1}
							selectTextOnFocus
						/>
					))}
				</View>

				<Button
					label={loading ? "Verifying..." : "Verify"}
					onPress={handleVerify}
					loading={loading}
					disabled={otp.join("").length !== OTP_LENGTH || loading}
				/>

				<View style={styles.resendRow}>
					{timer > 0 ? (
						<Text style={styles.timerText}>Resend in {timer}s</Text>
					) : (
						<Text style={styles.resendText} onPress={handleResend}>
							Resend OTP
						</Text>
					)}
				</View>
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
	title: {
		fontSize: 24,
		fontWeight: "800",
		color: palette.text,
		textAlign: "center",
	},
	subtitle: { fontSize: 14, color: palette.subtext, textAlign: "center" },
	otpRow: { flexDirection: "row", justifyContent: "center", gap: spacing.sm },
	otpInput: {
		width: 48,
		height: 56,
		borderRadius: radius.lg,
		borderWidth: 2,
		borderColor: palette.border,
		textAlign: "center",
		fontSize: 22,
		fontWeight: "800",
		color: palette.text,
		backgroundColor: "#F8FAFC",
	},
	otpInputFilled: { borderColor: palette.primary, backgroundColor: "#F0FDFA" },
	resendRow: { alignItems: "center" },
	timerText: { fontSize: 14, color: palette.subtext, fontWeight: "600" },
	resendText: { fontSize: 14, color: palette.primary, fontWeight: "700" },
});
