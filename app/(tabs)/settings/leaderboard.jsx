import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from "../../../components/common/Loader";
import { palette, radius, shadow, spacing } from "../../../design/tokens";
import { useAuth } from "../../../hooks/useAuth";
import { firestore } from "../../../services/firebase/firebaseConfig";

const RANK_COLORS = ["#F59E0B", "#94A3B8", "#CD7F32"]; // Gold, Silver, Bronze

export default function LeaderboardScreen() {
	const { user } = useAuth();
	const [leaders, setLeaders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchLeaderboard = async () => {
			try {
				const q = query(
					collection(firestore, "users"),
					orderBy("points", "desc"),
					limit(50),
				);
				const snap = await getDocs(q);
				setLeaders(
					snap.docs.map((d, i) => ({ id: d.id, rank: i + 1, ...d.data() })),
				);
			} catch (e) {
				console.error("Leaderboard fetch error:", e);
			} finally {
				setLoading(false);
			}
		};
		fetchLeaderboard();
	}, []);

	if (loading) return <Loader label="Loading leaderboard..." />;

	const userRank = leaders.findIndex((l) => l.id === user?.uid) + 1;

	const renderLeader = ({ item }) => {
		const isCurrentUser = item.id === user?.uid;
		const isTop3 = item.rank <= 3;

		return (
			<View style={[styles.row, isCurrentUser && styles.rowHighlighted]}>
				<View
					style={[
						styles.rankBadge,
						isTop3 && { backgroundColor: RANK_COLORS[item.rank - 1] },
					]}
				>
					{isTop3 ? (
						<Ionicons name="trophy" size={14} color="#fff" />
					) : (
						<Text style={styles.rankText}>{item.rank}</Text>
					)}
				</View>
				<View style={styles.userInfo}>
					<Text
						style={[
							styles.userName,
							isCurrentUser && styles.userNameHighlighted,
						]}
					>
						{item.displayName || "Anonymous"}
						{isCurrentUser ? " (You)" : ""}
					</Text>
					<Text style={styles.userMeta}>
						Level {getLevelForPoints(item.points || 0)} •{" "}
						{(item.totalContributions || 0).toLocaleString()} contributions
					</Text>
				</View>
				<Text
					style={[
						styles.points,
						isTop3 && { color: RANK_COLORS[item.rank - 1] },
					]}
				>
					{(item.points || 0).toLocaleString()}
				</Text>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="dark-content" />
			<FlatList
				data={leaders}
				keyExtractor={(item) => item.id}
				renderItem={renderLeader}
				contentContainerStyle={styles.list}
				ListHeaderComponent={
					<View style={styles.headerWrap}>
						<Text style={styles.title}>Leaderboard</Text>
						{userRank > 0 && (
							<View style={styles.yourRankCard}>
								<Ionicons name="podium" size={22} color={palette.primary} />
								<Text style={styles.yourRankText}>Your Rank: #{userRank}</Text>
							</View>
						)}
					</View>
				}
				ItemSeparatorComponent={() => <View style={styles.separator} />}
			/>
		</SafeAreaView>
	);
}

const getLevelForPoints = (points) => {
	if (points >= 10000) return 6;
	if (points >= 5000) return 5;
	if (points >= 2000) return 4;
	if (points >= 500) return 3;
	if (points >= 100) return 2;
	return 1;
};

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	list: { padding: spacing.lg },
	headerWrap: { gap: spacing.md, marginBottom: spacing.md },
	title: { fontSize: 22, fontWeight: "800", color: palette.text },
	yourRankCard: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		backgroundColor: palette.card,
		padding: spacing.md,
		borderRadius: radius.lg,
		...shadow.card,
	},
	yourRankText: { fontSize: 16, fontWeight: "800", color: palette.primary },
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		paddingVertical: spacing.sm,
	},
	rowHighlighted: {
		backgroundColor: "#F0FDFA",
		marginHorizontal: -spacing.sm,
		paddingHorizontal: spacing.sm,
		borderRadius: radius.md,
	},
	rankBadge: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "#E2E8F0",
		justifyContent: "center",
		alignItems: "center",
	},
	rankText: { fontSize: 13, fontWeight: "800", color: palette.subtext },
	userInfo: { flex: 1 },
	userName: { fontSize: 15, fontWeight: "700", color: palette.text },
	userNameHighlighted: { color: palette.primary },
	userMeta: { fontSize: 12, color: palette.subtext, marginTop: 1 },
	points: { fontSize: 16, fontWeight: "800", color: palette.text },
	separator: { height: 1, backgroundColor: palette.border },
});
