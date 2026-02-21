import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from "../../../components/common/Loader";
import { colors, palette, shadow, spacing } from "../../../design/tokens";
import { useAuth } from "../../../hooks/useAuth";
import { firestore } from "../../../services/firebase/firebaseConfig";

const RANK_COLORS = ["#F59E0B", "#94A3B8", "#CD7F32"];

export default function LeaderboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(firestore, "users"), orderBy("points", "desc"), limit(50));
        const snap = await getDocs(q);
        setLeaders(snap.docs.map((d, i) => ({ id: d.id, rank: i + 1, ...d.data() })));
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
        <View style={[styles.rankBadge, isTop3 && { backgroundColor: RANK_COLORS[item.rank - 1] }]}>
          {isTop3 ? (
            <Ionicons name="trophy" size={14} color="#FFFFFF" />
          ) : (
            <Text style={styles.rankText}>{item.rank}</Text>
          )}
        </View>

        <View style={styles.userAvatar}>
          <Text style={styles.userInitial}>
            {(item.displayName || "A").charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={[styles.userName, isCurrentUser && styles.userNameHighlighted]}>
            {item.displayName || "Anonymous"}
            {isCurrentUser ? " (You)" : ""}
          </Text>
          <Text style={styles.userMeta}>
            Level {getLevelForPoints(item.points || 0)} ·{" "}
            {(item.totalContributions || 0).toLocaleString()} rides
          </Text>
        </View>

        <View style={styles.pointsWrap}>
          <Text style={[styles.points, isTop3 && { color: RANK_COLORS[item.rank - 1] }]}>
            {(item.points || 0).toLocaleString()}
          </Text>
          <Text style={styles.ptsLabel}>pts</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.gray900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Your Rank Card */}
      {userRank > 0 && (
        <View style={styles.yourRankCard}>
          <View style={styles.yourRankIcon}>
            <Ionicons name="podium" size={20} color={palette.primary} />
          </View>
          <Text style={styles.yourRankText}>Your Rank</Text>
          <Text style={styles.yourRankNum}>#{userRank}</Text>
        </View>
      )}

      <FlatList
        data={leaders}
        keyExtractor={(item) => item.id}
        renderItem={renderLeader}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
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
  safe: { flex: 1, backgroundColor: palette.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: palette.card,
    borderBottomWidth: 1,
    borderBottomColor: palette.borderLight,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.gray900,
  },
  yourRankCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.card,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: 16,
    ...shadow.card,
  },
  yourRankIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#CCFBF1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  yourRankText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.gray700,
  },
  yourRankNum: {
    fontSize: 20,
    fontWeight: "800",
    color: palette.primary,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  rowHighlighted: {
    backgroundColor: "#F0FDFA",
    marginHorizontal: -spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 14,
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: palette.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  rankText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.gray500,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  userInitial: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.gray600,
  },
  userInfo: { flex: 1 },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray800,
  },
  userNameHighlighted: { color: palette.primary },
  userMeta: {
    fontSize: 11,
    color: colors.gray500,
    marginTop: 1,
  },
  pointsWrap: {
    alignItems: "flex-end",
  },
  points: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.gray900,
  },
  ptsLabel: {
    fontSize: 10,
    color: colors.gray400,
  },
  separator: {
    height: 1,
    backgroundColor: palette.borderLight,
  },
});
