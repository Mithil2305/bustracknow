import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import {
	Alert,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../components/common/Button";
import { palette, radius, shadow, spacing } from "../../../design/tokens";
import { useAuth } from "../../../hooks/useAuth";
import { firestore } from "../../../services/firebase/firebaseConfig";

const ALERT_OPTIONS = [
	{
		type: "full",
		label: "Bus Full",
		icon: "people",
		description: "Bus is at full capacity",
	},
	{
		type: "late",
		label: "Running Late",
		icon: "time",
		description: "Bus is significantly delayed",
	},
	{
		type: "not-running",
		label: "Not Running",
		icon: "close-circle",
		description: "Bus not operating today",
	},
];

export default function ReportAlertScreen() {
	const router = useRouter();
	const { user } = useAuth();
	const [selectedType, setSelectedType] = useState(null);
	const [routeId, setRouteId] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async () => {
		if (!selectedType) {
			Alert.alert(
				"Select Alert Type",
				"Please select what you want to report.",
			);
			return;
		}
		if (!routeId.trim()) {
			Alert.alert("Enter Route", "Please enter the bus route number.");
			return;
		}

		setSubmitting(true);
		try {
			// Get current location for the alert
			const location = await new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(
					(pos) =>
						resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
					() => resolve({ lat: 0, lng: 0 }),
					{ enableHighAccuracy: true, timeout: 5000 },
				);
			});

			await addDoc(collection(firestore, "alerts"), {
				routeId: routeId.trim(),
				type: selectedType,
				contributorId: user.uid,
				location,
				timestamp: serverTimestamp(),
				upvotes: 0,
			});

			Alert.alert(
				"Alert Submitted",
				"Thank you for reporting! You earned points.",
				[{ text: "OK", onPress: () => router.back() }],
			);
		} catch (e) {
			console.error("Report alert error:", e);
			Alert.alert("Error", "Failed to submit alert. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="dark-content" />
			<View style={styles.container}>
				<Text style={styles.title}>Report an Issue</Text>
				<Text style={styles.subtitle}>
					Help the community by reporting bus issues.
				</Text>

				{/* Route Input */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Bus Route Number</Text>
					<View style={styles.inputWrap}>
						<Ionicons name="bus-outline" size={18} color={palette.subtext} />
						<TextInput
							style={styles.input}
							placeholder="e.g. 45A"
							value={routeId}
							onChangeText={setRouteId}
							placeholderTextColor={palette.subtext}
							autoCapitalize="characters"
						/>
					</View>
				</View>

				{/* Alert Type Selection */}
				<Text style={styles.label}>What&apos;s the issue?</Text>
				<View style={styles.optionsWrap}>
					{ALERT_OPTIONS.map((option) => (
						<TouchableOpacity
							key={option.type}
							style={[
								styles.optionCard,
								selectedType === option.type && styles.optionCardSelected,
							]}
							onPress={() => setSelectedType(option.type)}
							activeOpacity={0.8}
						>
							<Ionicons
								name={option.icon}
								size={28}
								color={
									selectedType === option.type
										? palette.primary
										: palette.subtext
								}
							/>
							<Text
								style={[
									styles.optionLabel,
									selectedType === option.type && styles.optionLabelSelected,
								]}
							>
								{option.label}
							</Text>
							<Text style={styles.optionDesc}>{option.description}</Text>
						</TouchableOpacity>
					))}
				</View>

				<Button
					label={submitting ? "Submitting..." : "Submit Report"}
					onPress={handleSubmit}
					loading={submitting}
					disabled={submitting || !selectedType || !routeId.trim()}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	container: { flex: 1, padding: spacing.lg, gap: spacing.md },
	title: { fontSize: 22, fontWeight: "800", color: palette.text },
	subtitle: { fontSize: 14, color: palette.subtext },
	inputGroup: { gap: spacing.xs },
	label: { fontSize: 13, fontWeight: "700", color: palette.subtext },
	inputWrap: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		borderWidth: 1,
		borderColor: palette.border,
		borderRadius: radius.lg,
		paddingHorizontal: spacing.md,
		backgroundColor: "#F8FAFC",
		...shadow.card,
		minHeight: 52,
	},
	input: {
		flex: 1,
		fontSize: 15,
		color: palette.text,
		paddingVertical: spacing.xs,
	},
	optionsWrap: { gap: spacing.sm },
	optionCard: {
		backgroundColor: palette.card,
		padding: spacing.md,
		borderRadius: radius.lg,
		alignItems: "center",
		gap: 4,
		borderWidth: 2,
		borderColor: "transparent",
		...shadow.card,
	},
	optionCardSelected: {
		borderColor: palette.primary,
		backgroundColor: "#F0FDFA",
	},
	optionLabel: { fontSize: 15, fontWeight: "700", color: palette.text },
	optionLabelSelected: { color: palette.primary },
	optionDesc: { fontSize: 12, color: palette.subtext, textAlign: "center" },
});
