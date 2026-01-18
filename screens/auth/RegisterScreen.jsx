// app/screens/auth/RegisterScreen.jsx
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
	Alert,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { registerWithEmail } from "../../services/firebase/authService";

export default function RegisterScreen() {
	const nav = useNavigation();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleRegister() {
		setLoading(true);
		try {
			await registerWithEmail(email.trim(), password);
		} catch (err) {
			console.error(err);
			Alert.alert("Register failed", err.message || "Could not register");
		} finally {
			setLoading(false);
		}
	}

	return (
		<View style={styles.wrap}>
			<Text style={styles.title}>Register</Text>
			<TextInput
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				style={styles.input}
			/>
			<TextInput
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				style={styles.input}
			/>
			<TouchableOpacity onPress={handleRegister} style={styles.button}>
				<Text style={styles.btnText}>
					{loading ? "Creating..." : "Sign up"}
				</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => nav.goBack()}>
				<Text style={styles.link}>Back to login</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: { flex: 1, justifyContent: "center", padding: 20 },
	title: { fontSize: 26, marginBottom: 20, textAlign: "center" },
	input: { borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 12 },
	button: {
		padding: 12,
		backgroundColor: "#00a86b",
		borderRadius: 8,
		alignItems: "center",
	},
	btnText: { color: "#fff", fontWeight: "700" },
	link: { textAlign: "center", marginTop: 12, color: "#0066ff" },
});
