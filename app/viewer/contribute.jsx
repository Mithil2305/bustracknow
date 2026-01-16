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

export default function ContributionScreen() {
	const [message, setMessage] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const submit = () => {
		setSubmitted(true);
		setTimeout(() => setSubmitted(false), 1200);
	};

	return (
		<SafeAreaView style={styles.safe}>
			<ScrollView contentContainerStyle={styles.container}>
				<Text style={styles.title}>Contribute</Text>
				<Text style={styles.subtitle}>
					Send a crowd report (delay, crowding, hazard). This demo stores it in
					memory.
				</Text>

				<View style={styles.card}>
					<Text style={styles.label}>Report</Text>
					<TextInput
						style={[styles.input, { height: 120, textAlignVertical: "top" }]}
						placeholder="e.g., Bus 42 delayed near Central"
						value={message}
						onChangeText={setMessage}
						multiline
					/>

					<TouchableOpacity style={styles.primary} onPress={submit}>
						<Text style={styles.primaryText}>Submit</Text>
					</TouchableOpacity>

					{submitted ? (
						<Text style={styles.success}>Thanks! Report captured.</Text>
					) : null}
				</View>
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
		backgroundColor: "#fff",
		fontSize: 15,
	},
	primary: {
		marginTop: 4,
		backgroundColor: "#2563eb",
		padding: 14,
		borderRadius: 12,
		alignItems: "center",
	},
	primaryText: { color: "white", fontWeight: "700" },
	success: { color: "#16a34a", fontWeight: "700" },
});
