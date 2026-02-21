import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProgressRing from "../../../components/ui/ProgressRing";
import { colors, palette, shadow, spacing } from "../../../design/tokens";

const { width: SCREEN_W } = Dimensions.get("window");
const CARD_GAP = spacing.sm;
const CARD_W = (SCREEN_W - spacing.lg * 2 - CARD_GAP) / 2;

export default function BadgesScreen() {
  const router = useRouter();

  const userStats = {
    level: 3,
    xp: 2500,
    xpToNextLevel: 5000,
    totalBadges: 8,
    unlockedBadges: 5,
  };

  const badges = [
    {
      id: "first_contribution",
      name: "First Timer",
      description: "First contribution",
      icon: "rocket-outline",
      color: palette.primary,
      unlocked: true,
      dateUnlocked: "Jan 15",
    },
    {
      id: "streak_3day",
      name: "Consistent Rider",
      description: "3-day streak",
      icon: "flame-outline",
      color: "#F59E0B",
      unlocked: true,
      dateUnlocked: "Jan 20",
    },
    {
      id: "streak_7day",
      name: "Week Warrior",
      description: "7-day streak",
      icon: "calendar-outline",
      color: palette.success,
      unlocked: true,
      dateUnlocked: "Jan 25",
    },
    {
      id: "streak_30day",
      name: "Month Master",
      description: "30-day streak",
      icon: "medal-outline",
      color: palette.secondary,
      unlocked: false,
      progress: 15,
      goal: 30,
    },
    {
      id: "points_1000",
      name: "Point Collector",
      description: "Earned 1,000 pts",
      icon: "star-outline",
      color: "#F59E0B",
      unlocked: true,
      dateUnlocked: "Feb 1",
    },
    {
      id: "points_5000",
      name: "Point Master",
      description: "Earned 5,000 pts",
      icon: "diamond-outline",
      color: palette.danger,
      unlocked: true,
      dateUnlocked: "Feb 10",
    },
    {
      id: "referral_5",
      name: "Social Butterfly",
      description: "Referred 5 friends",
      icon: "people-outline",
      color: palette.primary,
      unlocked: false,
      progress: 3,
      goal: 5,
    },
    {
      id: "alert_10",
      name: "Community Helper",
      description: "10 alerts reported",
      icon: "megaphone-outline",
      color: palette.success,
      unlocked: false,
      progress: 7,
      goal: 10,
    },
  ];

  const progressPercent = Math.round((userStats.xp / userStats.xpToNextLevel) * 100);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.gray900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Level Card */}
        <View style={styles.levelCard}>
          <View style={styles.levelRow}>
            <View style={styles.levelCircle}>
              <Text style={styles.levelNum}>{userStats.level}</Text>
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelLabel}>Level {userStats.level}</Text>
              <Text style={styles.xpText}>
                {userStats.xp.toLocaleString()} / {userStats.xpToNextLevel.toLocaleString()} XP
              </Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
              </View>
            </View>
          </View>

          <View style={styles.ringRow}>
            <ProgressRing
              current={userStats.xp}
              max={userStats.xpToNextLevel}
              size={120}
              label={`Next: Lvl ${userStats.level + 1}`}
            />
            <View style={styles.ringStats}>
              <View style={styles.ringStat}>
                <Ionicons name="ribbon" size={20} color={palette.primary} />
                <Text style={styles.ringStatVal}>{userStats.unlockedBadges}</Text>
                <Text style={styles.ringStatLabel}>Unlocked</Text>
              </View>
              <View style={styles.ringStat}>
                <Ionicons name="lock-closed" size={20} color={colors.gray400} />
                <Text style={styles.ringStatVal}>
                  {userStats.totalBadges - userStats.unlockedBadges}
                </Text>
                <Text style={styles.ringStatLabel}>Locked</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Badges Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Badges</Text>
          <Text style={styles.sectionCount}>
            {userStats.unlockedBadges}/{userStats.totalBadges}
          </Text>
        </View>

        <View style={styles.grid}>
          {badges.map((badge) => (
            <View
              key={badge.id}
              style={[styles.badgeCard, badge.unlocked ? styles.badgeUnlocked : styles.badgeLocked]}
            >
              <View
                style={[
                  styles.badgeIconWrap,
                  { backgroundColor: badge.unlocked ? badge.color + "18" : colors.gray100 },
                ]}
              >
                <Ionicons
                  name={badge.icon}
                  size={28}
                  color={badge.unlocked ? badge.color : colors.gray400}
                />
              </View>
              <Text
                style={[styles.badgeName, !badge.unlocked && { color: colors.gray400 }]}
                numberOfLines={1}
              >
                {badge.name}
              </Text>
              <Text
                style={[styles.badgeDesc, !badge.unlocked && { color: colors.gray300 }]}
                numberOfLines={1}
              >
                {badge.description}
              </Text>
              {badge.unlocked ? (
                <View style={styles.unlockedPill}>
                  <Ionicons name="checkmark-circle" size={12} color={palette.primary} />
                  <Text style={styles.unlockedText}>{badge.dateUnlocked}</Text>
                </View>
              ) : badge.progress != null ? (
                <View style={styles.progressWrap}>
                  <View style={styles.progressBg}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${(badge.progress / (badge.goal || 10)) * 100}%`,
                          backgroundColor: badge.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {badge.progress}/{badge.goal || 10}
                  </Text>
                </View>
              ) : (
                <Text style={styles.lockedLabel}>🔒 Locked</Text>
              )}
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

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
  headerTitle: { fontSize: 18, fontWeight: "700", color: colors.gray900 },

  /* Level Card */
  levelCard: {
    backgroundColor: palette.card,
    margin: spacing.lg,
    borderRadius: 20,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: palette.borderLight,
    ...shadow.card,
  },
  levelRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.lg },
  levelCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: palette.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.lg,
    ...shadow.card,
  },
  levelNum: { fontSize: 28, fontWeight: "800", color: "#fff" },
  levelInfo: { flex: 1 },
  levelLabel: { fontSize: 18, fontWeight: "700", color: colors.gray900, marginBottom: 2 },
  xpText: { fontSize: 13, color: colors.gray500, marginBottom: spacing.sm },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray200,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: palette.primary,
  },

  ringRow: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  ringStats: { marginLeft: spacing.xl },
  ringStat: { alignItems: "center", marginBottom: spacing.md },
  ringStatVal: { fontSize: 20, fontWeight: "800", color: colors.gray900, marginTop: 4 },
  ringStatLabel: { fontSize: 11, color: colors.gray500, marginTop: 2 },

  /* Section */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.gray900 },
  sectionCount: { fontSize: 14, fontWeight: "600", color: colors.gray500 },

  /* Grid */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.lg,
    gap: CARD_GAP,
  },
  badgeCard: {
    width: CARD_W,
    borderRadius: 18,
    padding: spacing.md,
    alignItems: "center",
  },
  badgeUnlocked: {
    backgroundColor: palette.card,
    borderWidth: 1.5,
    borderColor: "#CCFBF1",
    ...shadow.card,
  },
  badgeLocked: {
    backgroundColor: colors.gray50,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.gray200,
  },
  badgeIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  badgeName: { fontSize: 13, fontWeight: "700", color: colors.gray900, textAlign: "center" },
  badgeDesc: {
    fontSize: 11,
    color: colors.gray500,
    textAlign: "center",
    marginTop: 3,
    marginBottom: spacing.sm,
  },

  unlockedPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#CCFBF1",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  unlockedText: { fontSize: 10, fontWeight: "600", color: palette.primary },

  progressWrap: { width: "100%", alignItems: "center" },
  progressBg: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gray200,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 3 },
  progressText: { fontSize: 10, color: colors.gray500, marginTop: 4 },

  lockedLabel: { fontSize: 10, color: colors.gray400 },
});
