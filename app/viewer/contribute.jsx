import { useState } from "react";
import {
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { palette, radius, shadow, spacing } from "../design/tokens";

export default function ContributionScreen() {
	const [route, setRoute] = useState("");
	const [note, setNote] = useState("");

	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.container}>
				<Text style={styles.title}>Contribute</Text>
				<Text style={styles.subtitle}>
					Report delays, crowding, or route updates.
				</Text>

				<View style={styles.card}>
					<Text style={styles.label}>Route / Bus</Text>
					<TextInput
						style={styles.input}
						placeholder="e.g. 45A"
						value={route}
						onChangeText={setRoute}
						placeholderTextColor={palette.subtext}
					/>

					<Text style={styles.label}>Details</Text>
					<TextInput
						style={[styles.input, { height: 110, textAlignVertical: "top" }]}
						placeholder="Describe the issue..."
						value={note}
						onChangeText={setNote}
						multiline
						placeholderTextColor={palette.subtext}
					/>

					<TouchableOpacity style={styles.primary}>
						<Text style={styles.primaryText}>Submit report</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	container: { flex: 1, padding: spacing.lg, gap: spacing.md },
	title: { fontSize: 24, fontWeight: "800", color: palette.text },
	subtitle: { fontSize: 14, color: palette.subtext },
	card: {
		backgroundColor: palette.card,
		borderRadius: radius.lg,
		padding: spacing.md,
		gap: spacing.sm,
		borderWidth: 1,
		borderColor: palette.border,
		...shadow.card,
	},
	label: { fontSize: 13, fontWeight: "700", color: palette.subtext },
	input: {
		borderWidth: 1,
		borderColor: palette.border,
		borderRadius: radius.lg,
		padding: spacing.md,
		backgroundColor: "#F8FAFC",
		color: palette.text,
	},
	primary: {
		marginTop: spacing.sm,
		height: 52,
		borderRadius: radius.lg,
		backgroundColor: palette.primary,
		alignItems: "center",
		justifyContent: "center",
		...shadow.elevated,
	},
	primaryText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
});
