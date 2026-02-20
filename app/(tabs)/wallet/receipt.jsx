import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../components/common/Button";
import { palette, radius, shadow, spacing } from "../../../design/tokens";

export default function RedemptionReceiptScreen() {
	const router = useRouter();
	const { redemptionId, amount, pointsUsed, upiId } = useLocalSearchParams();

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="dark-content" />
			<View style={styles.container}>
				<View style={styles.successIcon}>
					<Ionicons name="checkmark-circle" size={72} color="#10B981" />
				</View>

				<Text style={styles.title}>Redemption Submitted!</Text>
				<Text style={styles.subtitle}>
					Your request is being processed. You&apos;ll receive ₹{amount} within
					48 hours.
				</Text>

				<View style={styles.card}>
					<DetailRow label="Redemption ID" value={redemptionId || "N/A"} />
					<View style={styles.separator} />
					<DetailRow
						label="Points Used"
						value={Number(pointsUsed || 0).toLocaleString()}
					/>
					<View style={styles.separator} />
					<DetailRow label="Amount" value={`₹${amount}`} />
					<View style={styles.separator} />
					<DetailRow label="UPI ID" value={upiId || "N/A"} />
					<View style={styles.separator} />
					<DetailRow label="Status" value="Pending" valueColor="#F59E0B" />
				</View>

				<View style={styles.infoCard}>
					<Ionicons name="information-circle" size={16} color="#0369A1" />
					<Text style={styles.infoText}>
						You&apos;ll receive a notification once the payment is processed.
						Contact support if not received within 48 hours.
					</Text>
				</View>

				<Button
					label="Back to Wallet"
					onPress={() => router.replace("/wallet")}
				/>
			</View>
		</SafeAreaView>
	);
}

const DetailRow = ({ label, value, valueColor }) => (
	<View style={styles.detailRow}>
		<Text style={styles.detailLabel}>{label}</Text>
		<Text style={[styles.detailValue, valueColor && { color: valueColor }]}>
			{value}
		</Text>
	</View>
);

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	container: {
		flex: 1,
		padding: spacing.lg,
		gap: spacing.md,
		alignItems: "center",
	},
	successIcon: { marginTop: spacing.xl },
	title: {
		fontSize: 22,
		fontWeight: "800",
		color: palette.text,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 14,
		color: palette.subtext,
		textAlign: "center",
		lineHeight: 20,
		paddingHorizontal: spacing.lg,
	},
	card: {
		backgroundColor: palette.card,
		padding: spacing.lg,
		borderRadius: radius.xl,
		width: "100%",
		...shadow.card,
	},
	detailRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: spacing.xs,
	},
	detailLabel: { fontSize: 14, color: palette.subtext, fontWeight: "600" },
	detailValue: { fontSize: 14, color: palette.text, fontWeight: "700" },
	separator: { height: 1, backgroundColor: palette.border },
	infoCard: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		backgroundColor: "#E0F2FE",
		padding: spacing.md,
		borderRadius: radius.lg,
		width: "100%",
	},
	infoText: { flex: 1, color: "#0369A1", fontSize: 12, fontWeight: "600" },
});
