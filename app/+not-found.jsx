import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/common/Button";
import { palette, shadow, spacing } from "../design/tokens";

export default function NotFoundScreen() {
	const router = useRouter();

	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.container}>
				<View style={styles.iconWrap}>
					<Ionicons
						name="alert-circle-outline"
						size={64}
						color={palette.subtext}
					/>
				</View>
				<Text style={styles.title}>Page Not Found</Text>
				<Text style={styles.description}>
					The page you&apos;re looking for doesn&apos;t exist or has been moved.
				</Text>
				<Button
					label="Go Home"
					onPress={() => router.replace("/")}
					icon={<Ionicons name="home" size={18} color="#fff" />}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: spacing.xl,
		gap: spacing.md,
	},
	iconWrap: {
		backgroundColor: palette.card,
		width: 100,
		height: 100,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
		...shadow.card,
	},
	title: { fontSize: 24, fontWeight: "800", color: palette.text },
	description: {
		fontSize: 14,
		color: palette.subtext,
		textAlign: "center",
		lineHeight: 20,
	},
});
