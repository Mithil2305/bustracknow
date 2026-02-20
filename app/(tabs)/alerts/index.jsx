import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
	collection,
	getDocs,
	orderBy,
	query,
	Timestamp,
	where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
	FlatList,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../../components/common/EmptyState";
import Loader from "../../../components/common/Loader";
import { palette, radius, shadow, spacing } from "../../../design/tokens";
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

export default function AlertsScreen() {
	const router = useRouter();
	const [alerts, setAlerts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAlerts = async () => {
			try {
				// Fetch alerts from the last 24 hours
				const yesterday = Timestamp.fromDate(
					new Date(Date.now() - 24 * 60 * 60 * 1000),
				);
				const q = query(
					collection(firestore, "alerts"),
					where("timestamp", ">=", yesterday),
					orderBy("timestamp", "desc"),
				);
				const snap = await getDocs(q);
				setAlerts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
			} catch (e) {
				console.error("Alerts fetch error:", e);
			} finally {
				setLoading(false);
			}
		};
		fetchAlerts();
	}, []);

	if (loading) return <Loader label="Loading alerts..." />;

	const renderAlert = ({ item }) => {
		const meta = ALERT_TYPES[item.type] || ALERT_TYPES.full;
		const timeAgo = getTimeAgo(item.timestamp);

		return (
			<TouchableOpacity
				style={styles.alertCard}
				onPress={() =>
					router.push({
						pathname: `/alerts/${item.id}`,
						params: { alertId: item.id },
					})
				}
				activeOpacity={0.8}
			>
				<View style={[styles.alertIcon, { backgroundColor: meta.bg }]}>
					<Ionicons name={meta.icon} size={20} color={meta.color} />
				</View>
				<View style={styles.alertContent}>
					<Text style={styles.alertType}>{meta.label}</Text>
					<Text style={styles.alertRoute}>Route: {item.routeId}</Text>
					<Text style={styles.alertTime}>{timeAgo}</Text>
				</View>
				<View style={styles.upvoteWrap}>
					<Ionicons name="arrow-up" size={16} color={palette.primary} />
					<Text style={styles.upvoteCount}>{item.upvotes || 0}</Text>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="dark-content" />
			<View style={styles.header}>
				<Text style={styles.title}>Community Alerts</Text>
				<TouchableOpacity
					style={styles.reportBtn}
					onPress={() => router.push("/alerts/report")}
				>
					<Ionicons name="add-circle" size={20} color="#fff" />
					<Text style={styles.reportBtnText}>Report</Text>
				</TouchableOpacity>
			</View>

			{alerts.length === 0 ? (
				<EmptyState
					title="No active alerts"
					description="All clear! No issues reported in the last 24 hours."
					ctaLabel="Report an issue"
					onCtaPress={() => router.push("/alerts/report")}
				/>
			) : (
				<FlatList
					data={alerts}
					keyExtractor={(item) => item.id}
					renderItem={renderAlert}
					contentContainerStyle={styles.list}
					ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
				/>
			)}
		</SafeAreaView>
	);
}

const getTimeAgo = (timestamp) => {
	if (!timestamp) return "";
	const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
	const diffMs = Date.now() - date.getTime();
	const mins = Math.floor(diffMs / 60000);
	if (mins < 1) return "Just now";
	if (mins < 60) return `${mins}m ago`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `${hours}h ago`;
	return `${Math.floor(hours / 24)}d ago`;
};

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: spacing.lg,
		paddingBottom: spacing.sm,
	},
	title: { fontSize: 22, fontWeight: "800", color: palette.text },
	reportBtn: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		backgroundColor: palette.primary,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs,
		borderRadius: radius.lg,
	},
	reportBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
	list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
	alertCard: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		backgroundColor: palette.card,
		padding: spacing.md,
		borderRadius: radius.lg,
		...shadow.card,
	},
	alertIcon: {
		width: 44,
		height: 44,
		borderRadius: 22,
		justifyContent: "center",
		alignItems: "center",
	},
	alertContent: { flex: 1 },
	alertType: { fontSize: 15, fontWeight: "700", color: palette.text },
	alertRoute: { fontSize: 13, color: palette.subtext, marginTop: 2 },
	alertTime: { fontSize: 12, color: palette.subtext, marginTop: 2 },
	upvoteWrap: { alignItems: "center", gap: 2 },
	upvoteCount: { fontSize: 13, fontWeight: "700", color: palette.primary },
});
