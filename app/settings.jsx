import { useState } from "react";
import { SafeAreaView, StyleSheet, Switch, Text, View } from "react-native";

export default function SettingsScreen() {
	const [notifications, setNotifications] = useState(true);
	const [darkMode, setDarkMode] = useState(false);
	const [analytics, setAnalytics] = useState(true);

	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.container}>
				<Text style={styles.title}>Settings</Text>

				<View style={styles.card}>
					<View style={styles.row}>
						<Text style={styles.label}>Push notifications</Text>
						<Switch value={notifications} onValueChange={setNotifications} />
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Dark mode</Text>
						<Switch value={darkMode} onValueChange={setDarkMode} />
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Share analytics</Text>
						<Switch value={analytics} onValueChange={setAnalytics} />
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: "#f7f9fc" },
	container: { flex: 1, padding: 16, gap: 12 },
	title: { fontSize: 26, fontWeight: "700" },
	card: {
		backgroundColor: "#fff",
		padding: 14,
		borderRadius: 12,
		gap: 16,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	label: { fontSize: 16, fontWeight: "600" },
});
