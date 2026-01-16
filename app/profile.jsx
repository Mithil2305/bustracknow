import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.container}>
				<Text style={styles.title}>Profile</Text>
				<View style={styles.card}>
					<Text style={styles.label}>Name</Text>
					<Text style={styles.value}>Alex Rider</Text>
					<Text style={styles.label}>Role</Text>
					<Text style={styles.value}>Viewer</Text>
					<Text style={styles.label}>Email</Text>
					<Text style={styles.value}>alex@bustracknow.com</Text>
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
		gap: 8,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	label: { fontSize: 13, color: "#4b5563" },
	value: { fontSize: 16, fontWeight: "700" },
});
