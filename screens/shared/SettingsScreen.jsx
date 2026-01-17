import { useState } from "react";
import { SafeAreaView, StyleSheet, Switch, Text, View } from "react-native";
import { palette, radius, shadow, spacing } from "../../app/design/tokens";

const Row = ({ label, value, onChange }) => (
	<View style={styles.row}>
		<Text style={styles.label}>{label}</Text>
		<Switch value={value} onValueChange={onChange} />
	</View>
);

export default function SettingsScreen() {
	const [notifications, setNotifications] = useState(true);
	const [darkMode, setDarkMode] = useState(false);
	const [dataSaver, setDataSaver] = useState(false);

	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.container}>
				<Text style={styles.title}>Settings</Text>
				<View style={styles.card}>
					<Row
						label="Push notifications"
						value={notifications}
						onChange={setNotifications}
					/>
					<Row label="Dark mode" value={darkMode} onChange={setDarkMode} />
					<Row label="Data saver" value={dataSaver} onChange={setDataSaver} />
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	container: { flex: 1, padding: spacing.lg, gap: spacing.md },
	title: { fontSize: 26, fontWeight: "800", color: palette.text },
	card: {
		backgroundColor: palette.card,
		padding: spacing.md,
		borderRadius: radius.lg,
		gap: spacing.md,
		...shadow.card,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	label: { fontSize: 16, fontWeight: "600", color: palette.text },
});
