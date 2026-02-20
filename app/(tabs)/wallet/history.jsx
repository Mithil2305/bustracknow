import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../../components/common/EmptyState";
import Loader from "../../../components/common/Loader";
import { palette, spacing } from "../../../design/tokens";
import { useAuth } from "../../../hooks/useAuth";
import { firestore } from "../../../services/firebase/firebaseConfig";

const TYPE_LABELS = {
	location_share: {
		label: "Location Shared",
		icon: "navigate",
		color: "#0D9488",
	},
	stop_confirm: { label: "Stop Confirmed", icon: "flag", color: "#2563EB" },
	alert_full: { label: "Reported Full", icon: "megaphone", color: "#F59E0B" },
	alert_late: { label: "Reported Late", icon: "megaphone", color: "#F97316" },
	alert_not_running: {
		label: "Reported Not Running",
		icon: "megaphone",
		color: "#EF4444",
	},
	first_contribution: {
		label: "First Contribution",
		icon: "star",
		color: "#8B5CF6",
	},
	streak_3day: { label: "3-Day Streak Bonus", icon: "flame", color: "#F59E0B" },
	streak_7day: { label: "7-Day Streak Bonus", icon: "flame", color: "#F97316" },
	streak_30day: {
		label: "30-Day Streak Bonus",
		icon: "flame",
		color: "#EF4444",
	},
	referral: { label: "Referral Bonus", icon: "people", color: "#10B981" },
};

export default function PointsHistoryScreen() {
	const { user } = useAuth();
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user?.uid) return;
		const fetchHistory = async () => {
			try {
				const q = query(
					collection(firestore, "points_transactions"),
					where("userId", "==", user.uid),
					orderBy("createdAt", "desc"),
				);
				const snap = await getDocs(q);
				setTransactions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
			} catch (e) {
				console.error("History fetch error:", e);
			} finally {
				setLoading(false);
			}
		};
		fetchHistory();
	}, [user]);

	if (loading) return <Loader label="Loading history..." />;

	const renderItem = ({ item }) => {
		const meta = TYPE_LABELS[item.type] || {
			label: item.type,
			icon: "ellipse",
			color: palette.subtext,
		};
		const dateStr = item.createdAt?.toDate
			? item.createdAt.toDate().toLocaleDateString("en-IN", {
					day: "numeric",
					month: "short",
					year: "numeric",
				})
			: "";

		return (
			<View style={styles.row}>
				<View style={[styles.iconWrap, { backgroundColor: meta.color + "20" }]}>
					<Ionicons name={meta.icon} size={18} color={meta.color} />
				</View>
				<View style={styles.rowContent}>
					<Text style={styles.rowLabel}>{meta.label}</Text>
					<Text style={styles.rowDate}>{dateStr}</Text>
				</View>
				<Text
					style={[
						styles.rowPoints,
						{ color: item.points > 0 ? "#10B981" : "#EF4444" },
					]}
				>
					{item.points > 0 ? "+" : ""}
					{item.points}
				</Text>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="dark-content" />
			<View style={styles.header}>
				<Text style={styles.title}>Points History</Text>
			</View>
			{transactions.length === 0 ? (
				<EmptyState
					title="No transactions yet"
					description="Start contributing to earn points!"
				/>
			) : (
				<FlatList
					data={transactions}
					keyExtractor={(item) => item.id}
					renderItem={renderItem}
					contentContainerStyle={styles.list}
					ItemSeparatorComponent={() => <View style={styles.separator} />}
				/>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	header: { padding: spacing.lg, paddingBottom: spacing.sm },
	title: { fontSize: 22, fontWeight: "800", color: palette.text },
	list: { paddingHorizontal: spacing.lg },
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		paddingVertical: spacing.sm,
	},
	iconWrap: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	rowContent: { flex: 1 },
	rowLabel: { fontSize: 15, fontWeight: "700", color: palette.text },
	rowDate: { fontSize: 12, color: palette.subtext, marginTop: 2 },
	rowPoints: { fontSize: 16, fontWeight: "800" },
	separator: { height: 1, backgroundColor: palette.border },
});
