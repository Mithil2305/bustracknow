import { StyleSheet, Text, View } from "react-native";

export default function RootNavigator() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Root Navigator</Text>
			<Text style={styles.subtitle}>
				Add your navigation stacks or tabs here.
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
