import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from "../../../components/common/Loader";
import { palette, radius, shadow, spacing } from "../../../design/tokens";
import { useAuth } from "../../../hooks/useAuth";
import { firestore } from "../../../services/firebase/firebaseConfig";

const BADGES = [
	{
		id: "first_share",
		label: "First Share",
		desc: "Shared location for the first time",
		icon: "navigate",
		requirement: 1,
		field: "totalContributions",
	},
	{
		id: "route_master",
		label: "Route Master",
		desc: "Shared on 10 different routes",
		icon: "map",
		requirement: 10,
		field: "uniqueRoutes",
	},
	{
		id: "streak_3",
		label: "3-Day Streak",
		desc: "Contributed 3 days in a row",
		icon: "flame",
		requirement: 3,
		field: "longestStreak",
	},
	{
		id: "streak_7",
		label: "Weekly Warrior",
		desc: "Contributed 7 days in a row",
		icon: "flame",
		requirement: 7,
		field: "longestStreak",
	},
	{
		id: "streak_30",
		label: "Monthly Legend",
		desc: "Contributed 30 days in a row",
		icon: "flame",
		requirement: 30,
		field: "longestStreak",
	},
	{
		id: "alert_hero",
		label: "Alert Hero",
		desc: "Reported 5 verified alerts",
		icon: "megaphone",
		requirement: 5,
		field: "verifiedAlerts",
	},
	{
		id: "point_king",
		label: "Point King",
		desc: "Earned 10,000 total points",
		icon: "trophy",
		requirement: 10000,
		field: "totalPointsEarned",
	},
	{
		id: "referral_star",
		label: "Referral Star",
		desc: "Referred 3 friends",
		icon: "people",
		requirement: 3,
		field: "referrals",
	},
	{
		id: "top_contributor",
		label: "Top Contributor",
		desc: "Reached top 10 on leaderboard",
		icon: "podium",
		requirement: 1,
		field: "topTenCount",
	},
];

const LEVELS = [
	{ level: 1, name: "Newcomer", minPoints: 0, color: "#94A3B8" },
	{ level: 2, name: "Commuter", minPoints: 100, color: "#10B981" },
	{ level: 3, name: "Navigator", minPoints: 500, color: "#2563EB" },
	{ level: 4, name: "Guide", minPoints: 2000, color: "#8B5CF6" },
	{ level: 5, name: "Champion", minPoints: 5000, color: "#F59E0B" },
	{ level: 6, name: "Legend", minPoints: 10000, color: "#EF4444" },
];

export default function BadgesScreen() {
	const { user } = useAuth();
	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user?.uid) return;
		const fetchUser = async () => {
			try {
				const snap = await getDoc(doc(firestore, "users", user.uid));
				if (snap.exists()) setUserData(snap.data());
			} catch (e) {
				console.error("Badges fetch error:", e);
			} finally {
				setLoading(false);
			}
		};
		fetchUser();
	}, [user]);

	if (loading) return <Loader label="Loading badges..." />;

	const totalPoints = userData?.totalPointsEarned || userData?.points || 0;
	const currentLevel =
		[...LEVELS].reverse().find((l) => totalPoints >= l.minPoints) || LEVELS[0];
	const nextLevel = LEVELS.find((l) => l.minPoints > totalPoints);

	const renderBadge = ({ item }) => {
		const userValue = userData?.[item.field] || 0;
		const earned = userValue >= item.requirement;
		const progress = Math.min(userValue / item.requirement, 1);

		return (
			<View style={[styles.badgeCard, !earned && styles.badgeCardLocked]}>
				<View
					style={[
						styles.badgeIcon,
						{ backgroundColor: earned ? palette.primary + "20" : "#F1F5F9" },
					]}
				>
					<Ionicons
						name={item.icon}
						size={24}
						color={earned ? palette.primary : "#CBD5E1"}
					/>
				</View>
				<View style={styles.badgeContent}>
					<Text style={[styles.badgeLabel, !earned && styles.badgeLabelLocked]}>
						{item.label}
					</Text>
					<Text style={styles.badgeDesc}>{item.desc}</Text>
					{!earned && (
						<View style={styles.progressBar}>
							<View
								style={[styles.progressFill, { width: `${progress * 100}%` }]}
							/>
						</View>
					)}
				</View>
				{earned && (
					<Ionicons name="checkmark-circle" size={22} color="#10B981" />
				)}
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="dark-content" />
			<FlatList
				data={BADGES}
				keyExtractor={(item) => item.id}
				renderItem={renderBadge}
				contentContainerStyle={styles.list}
				ListHeaderComponent={
					<View style={styles.headerWrap}>
						<Text style={styles.title}>Badges &amp; Levels</Text>

						{/* Level Card */}
						<View
							style={[styles.levelCard, { borderColor: currentLevel.color }]}
						>
							<View
								style={[
									styles.levelBadge,
									{ backgroundColor: currentLevel.color },
								]}
							>
								<Text style={styles.levelNum}>Lv.{currentLevel.level}</Text>
							</View>
							<View style={styles.levelContent}>
								<Text style={styles.levelName}>{currentLevel.name}</Text>
								{nextLevel ? (
									<Text style={styles.levelProgress}>
										{totalPoints.toLocaleString()} /{" "}
										{nextLevel.minPoints.toLocaleString()} pts to{" "}
										{nextLevel.name}
									</Text>
								) : (
									<Text style={styles.levelProgress}>Max level reached!</Text>
								)}
							</View>
						</View>

						<Text style={styles.sectionTitle}>Your Badges</Text>
					</View>
				}
				ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: palette.surface },
	list: { padding: spacing.lg },
	headerWrap: { gap: spacing.md, marginBottom: spacing.md },
	title: { fontSize: 22, fontWeight: "800", color: palette.text },
	levelCard: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
		backgroundColor: palette.card,
		padding: spacing.lg,
		borderRadius: radius.xl,
		borderWidth: 2,
		...shadow.card,
	},
	levelBadge: {
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: "center",
		alignItems: "center",
	},
	levelNum: { color: "#fff", fontSize: 14, fontWeight: "900" },
	levelContent: { flex: 1 },
	levelName: { fontSize: 18, fontWeight: "800", color: palette.text },
	levelProgress: { fontSize: 13, color: palette.subtext, marginTop: 2 },
	sectionTitle: { fontSize: 16, fontWeight: "800", color: palette.text },
	badgeCard: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		backgroundColor: palette.card,
		padding: spacing.md,
		borderRadius: radius.lg,
		...shadow.card,
	},
	badgeCardLocked: { opacity: 0.7 },
	badgeIcon: {
		width: 44,
		height: 44,
		borderRadius: 22,
		justifyContent: "center",
		alignItems: "center",
	},
	badgeContent: { flex: 1 },
	badgeLabel: { fontSize: 15, fontWeight: "700", color: palette.text },
	badgeLabelLocked: { color: palette.subtext },
	badgeDesc: { fontSize: 12, color: palette.subtext, marginTop: 2 },
	progressBar: {
		height: 4,
		backgroundColor: "#E2E8F0",
		borderRadius: 2,
		marginTop: 6,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: palette.primary,
		borderRadius: 2,
	},
});
