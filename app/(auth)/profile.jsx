import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { palette, spacing } from "../../design/tokens";

export default function ProfileSetupScreen() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);

	const handleComplete = async () => {
		if (!name.trim()) return;

		setLoading(true);
		try {
			// In production: save profile to Firestore
			router.replace("/");
		} catch (e) {
			console.error("Profile setup error:", e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="dark-content" />
			<View style={styles.container}>
				<View style={styles.header}>
					<Ionicons name="person-circle" size={64} color={palette.primary} />
					<Text style={styles.title}>Set Up Profile</Text>
					<Text style={styles.subtitle}>
						Tell us your name to personalize your experience
					</Text>
				</View>

				<View style={styles.form}>
					<Input
						label="Display Name"
						placeholder="Your name"
						value={name}
						onChangeText={setName}
						leftIcon={
							<Ionicons
								name="person-outline"
								size={18}
								color={palette.subtext}
							/>
						}
					/>

					<Button
						label={loading ? "Saving..." : "Complete Setup"}
						onPress={handleComplete}
						loading={loading}
						disabled={!name.trim() || loading}
					/>
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
		gap: spacing.xl,
	},
	header: { alignItems: "center", gap: spacing.xs },
	title: { fontSize: 24, fontWeight: "800", color: palette.text },
	subtitle: {
		fontSize: 14,
		color: palette.subtext,
		textAlign: "center",
		lineHeight: 20,
	},
	form: { gap: spacing.md },
});
