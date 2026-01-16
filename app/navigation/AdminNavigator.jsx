import { StyleSheet, Text, View } from "react-native";

export default function AdminNavigator() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Admin Area</Text>
			<Text style={styles.subtitle}>
				Wire up admin-specific screens and flows here.
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
		backgroundColor: "#ffffff",
	},
	title: {
		fontSize: 20,
		fontWeight: "600",
		marginBottom: 6,
	},
	subtitle: {
		fontSize: 14,
		textAlign: "center",
		color: "#555",
	},
});
