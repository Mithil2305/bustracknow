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

export default function OTPScreen() {
	const router = useRouter();
	const [otp, setOtp] = useState("");
	const [status, setStatus] = useState("Waiting for code");

	const verify = () => {
		setStatus("Verifying...");
		setTimeout(() => {
			setStatus("Verified. Choose a role to explore.");
		}, 400);
	};

	return (
		<SafeAreaView style={styles.safe}>
			<ScrollView contentContainerStyle={styles.container}>
				<Text style={styles.title}>Enter OTP</Text>
				<Text style={styles.subtitle}>
					We sent a demo code to your email. Use any 6 digits.
				</Text>

				<View style={styles.card}>
					<Text style={styles.label}>One-Time Password</Text>
					<TextInput
						value={otp}
						onChangeText={setOtp}
						placeholder="123456"
						keyboardType="number-pad"
						style={styles.input}
						maxLength={6}
					/>

					<TouchableOpacity style={styles.button} onPress={verify}>
						<Text style={styles.buttonText}>Verify</Text>
					</TouchableOpacity>

					<Text style={styles.status}>{status}</Text>
				</View>

				<View style={styles.row}>
					<TouchableOpacity
						style={[styles.roleButton, { backgroundColor: "#2563eb" }]}
						onPress={() => router.push("/viewer")}
					>
						<Text style={styles.roleText}>Enter as Viewer</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.roleButton, { backgroundColor: "#16a34a" }]}
						onPress={() => router.push("/admin")}
					>
						<Text style={styles.roleText}>Enter as Admin</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: "#f7f9fc" },
	container: { padding: 16, gap: 12 },
	title: { fontSize: 26, fontWeight: "700" },
	subtitle: { fontSize: 14, color: "#4b5563" },
	card: {
		backgroundColor: "#fff",
		padding: 14,
		borderRadius: 12,
		gap: 10,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	label: { fontSize: 14, fontWeight: "600" },
	input: {
		borderWidth: 1,
		borderColor: "#e5e7eb",
		borderRadius: 10,
		padding: 12,
		fontSize: 15,
		backgroundColor: "#f9fafb",
		letterSpacing: 4,
		textAlign: "center",
	},
	button: {
		backgroundColor: "#2563eb",
		padding: 14,
		borderRadius: 12,
		alignItems: "center",
	},
	buttonText: { color: "white", fontWeight: "700", fontSize: 16 },
	status: { fontSize: 13, color: "#2563eb" },
	row: { flexDirection: "row", gap: 10 },
	roleButton: {
		flex: 1,
		padding: 14,
		borderRadius: 12,
		alignItems: "center",
	},
	roleText: { color: "white", fontWeight: "700" },
});
