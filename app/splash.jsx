import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const palette = {
	primary: "#0A84FF",
	primaryDark: "#0060DF",
	surface: "#0A84FF",
	textOnPrimary: "#FFFFFF",
	shadow: "rgba(0,0,0,0.2)",
};

export default function SplashScreen() {
	const router = useRouter();

	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.container}>
				<View style={styles.logoCircle}>
					<Text style={styles.logoIcon}>🚌</Text>
				</View>
				<Text style={styles.title}>BusTrackNow</Text>
				<Text style={styles.subtitle}>
					Real-time Bus Tracking. Crowdsourced.
				</Text>

				<TouchableOpacity
					style={styles.cta}
					onPress={() => router.push("/login")}
				>
					<Text style={styles.ctaText}>Get Started</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 32,
		gap: 24,
	},
	logoCircle: {
		width: 110,
		height: 110,
		borderRadius: 28,
		backgroundColor: "rgba(255,255,255,0.15)",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.25)",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: palette.shadow,
		shadowOpacity: 0.25,
		shadowRadius: 16,
		shadowOffset: { width: 0, height: 10 },
		elevation: 8,
	},
	logoIcon: { fontSize: 48, color: palette.textOnPrimary },
	title: {
		fontSize: 30,
		fontWeight: "800",
		color: palette.textOnPrimary,
		letterSpacing: 0.3,
	},
	subtitle: {
		fontSize: 16,
		color: "rgba(255,255,255,0.9)",
		textAlign: "center",
		lineHeight: 22,
	},
	cta: {
		marginTop: 8,
		backgroundColor: "#FFFFFF",
		paddingVertical: 14,
		paddingHorizontal: 32,
		borderRadius: 14,
		shadowColor: palette.shadow,
		shadowOpacity: 0.2,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 8 },
		elevation: 6,
	},
	ctaText: {
		color: palette.primaryDark,
		fontSize: 17,
		fontWeight: "700",
	},
});
