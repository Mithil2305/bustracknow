import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../components/common/Button";
import Loader from "../../../components/common/Loader";
import { palette, radius, shadow, spacing } from "../../../design/tokens";
import { useAuth } from "../../../hooks/useAuth";
import { firestore } from "../../../services/firebase/firebaseConfig";

const ALERT_TYPES = {
	full: { label: "Bus Full", icon: "people", color: "#F59E0B", bg: "#FEF3C7" },
	late: {
		label: "Running Late",
		icon: "time",
		color: "#F97316",
		bg: "#FFF7ED",
	},
	"not-running": {
		label: "Not Running",
		icon: "close-circle",
		color: "#EF4444",
		bg: "#FEE2E2",
	},
};

export default function AlertDetailScreen() {
	const { id } = useLocalSearchParams();
	const router = useRouter();
	const { user } = useAuth();
	const [alert, setAlert] = useState(null);
	const [loading, setLoading] = useState(true);
	const [upvoting, setUpvoting] = useState(false);

	useEffect(() => {
		if (!id) return;
		const fetchAlert = async () => {
			try {
				const snap = await getDoc(doc(firestore, "alerts", id));
				if (snap.exists()) {
					setAlert({ id: snap.id, ...snap.data() });
				}
			} catch (e) {
				console.error("Alert detail fetch error:", e);
			} finally {
				setLoading(false);
			}
		};
		fetchAlert();
	}, [id]);

	const handleUpvote = async () => {
		if (!alert || upvoting) return;
		setUpvoting(true);
		try {
			await updateDoc(doc(firestore, "alerts", alert.id), {
				upvotes: increment(1),
			});
			setAlert((prev) => ({ ...prev, upvotes: (prev.upvotes || 0) + 1 }));
		} catch (e) {
			console.error("Upvote error:", e);
			Alert.alert("Error", "Failed to upvote. Try again.");
		} finally {
			setUpvoting(false);
		}
	};

	if (loading) return <Loader label="Loading alert..." />;
	if (!alert) {
		return (
			<SafeAreaView style={styles.safe}>
				<View style={styles.container}>
					<Text style={styles.title}>Alert not found</Text>
					<Button label="Go Back" onPress={() => router.back()} />
				</View>
			</SafeAreaView>
		);
	}

	const meta = ALERT_TYPES[alert.type] || ALERT_TYPES.full;
	const timeStr = alert.timestamp?.toDate
		? alert.timestamp.toDate().toLocaleString("en-IN")
		: "Unknown";

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="dark-content" />
			<View style={styles.container}>
				<View style={[styles.typeCard, { backgroundColor: meta.bg }]}>
					<Ionicons name={meta.icon} size={36} color={meta.color} />
					<Text style={[styles.typeLabel, { color: meta.color }]}>
						{meta.label}
					</Text>
				</View>

				<View style={styles.detailCard}>
					<DetailRow label="Route" value={alert.routeId} />
					<View style={styles.separator} />
					<DetailRow label="Reported at" value={timeStr} />
					<View style={styles.separator} />
					<DetailRow label="Upvotes" value={String(alert.upvotes || 0)} />
					{alert.location && (
						<>
							<View style={styles.separator} />
							<DetailRow
								label="Location"
								value={`${alert.location.lat?.toFixed(4)}, ${alert.location.lng?.toFixed(4)}`}
							/>
						</>
					)}
				</View>

				<Button
					label={
						upvoting
							? "Upvoting..."
							: `Confirm This Alert (${alert.upvotes || 0})`
					}
					onPress={handleUpvote}
					loading={upvoting}
					disabled={upvoting || alert.contributorId === user?.uid}
					icon={<Ionicons name="arrow-up" size={18} color="#fff" />}
				/>

				{alert.contributorId === user?.uid && (
					<View style={styles.infoCard}>
						<Ionicons name="information-circle" size={16} color="#0369A1" />
						<Text style={styles.infoText}>
							You reported this alert. You cannot upvote your own report.
						</Text>
					</View>
				)}
			</View>
		</SafeAreaView>
	);
}

const DetailRow = ({ label, value }) => (
	<View style={styles.detailRow}>
		<Text style={styles.detailLabel}>{label}</Text>
		<Text style={styles.detailValue}>{value}</Text>
	</View>
);

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	container: { flex: 1, padding: spacing.lg, gap: spacing.md },
	title: { fontSize: 22, fontWeight: "800", color: palette.text },
	typeCard: {
		padding: spacing.xl,
		borderRadius: radius.xl,
		alignItems: "center",
		gap: spacing.xs,
	},
	typeLabel: { fontSize: 20, fontWeight: "800" },
	detailCard: {
		backgroundColor: palette.card,
		padding: spacing.lg,
		borderRadius: radius.xl,
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
	},
	infoText: { flex: 1, color: "#0369A1", fontSize: 12, fontWeight: "600" },
});
