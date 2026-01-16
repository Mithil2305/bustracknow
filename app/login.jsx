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

export default function LoginScreen() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [status, setStatus] = useState("Ready to sign in");

	const handleLogin = () => {
		setStatus("Checking credentials...");
		setTimeout(() => {
			setStatus("Code sent. Proceed to OTP");
			router.push("/otp");
		}, 400);
	};

	return (
		<SafeAreaView style={styles.safe}>
			<ScrollView contentContainerStyle={styles.container}>
				<Text style={styles.title}>Welcome back</Text>
				<Text style={styles.subtitle}>
					Use a demo email/password to simulate authentication.
				</Text>

				<View style={styles.card}>
					<Text style={styles.label}>Email</Text>
					<TextInput
						value={email}
						onChangeText={setEmail}
						placeholder="admin@bustracknow.com"
						keyboardType="email-address"
						style={styles.input}
					/>

					<Text style={styles.label}>Password</Text>
					<TextInput
						value={password}
						onChangeText={setPassword}
						placeholder="••••••••"
						secureTextEntry
						style={styles.input}
					/>

					<TouchableOpacity style={styles.button} onPress={handleLogin}>
						<Text style={styles.buttonText}>Send OTP</Text>
					</TouchableOpacity>

					<Text style={styles.status}>{status}</Text>
				</View>

				<TouchableOpacity
					style={styles.linkButton}
					onPress={() => router.push("/viewer")}
				>
					<Text style={styles.linkText}>Skip to viewer mode</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.linkButton}
					onPress={() => router.push("/admin")}
				>
					<Text style={styles.linkText}>Skip to admin mode</Text>
				</TouchableOpacity>
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
	},
	button: {
		backgroundColor: "#2563eb",
		padding: 14,
		borderRadius: 12,
		alignItems: "center",
	},
	buttonText: { color: "white", fontWeight: "700", fontSize: 16 },
	status: { fontSize: 13, color: "#2563eb" },
	linkButton: { paddingVertical: 6 },
	linkText: { color: "#2563eb", fontWeight: "600", fontSize: 15 },
});
