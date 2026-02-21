import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, palette, shadow, spacing } from "../../../design/tokens";

export default function WalletScreen() {
  const [activeTab, setActiveTab] = useState("history");

  const userData = {
    balance: "38.00",
    moreToRedeem: "62",
    minRedeem: "100",
    todayPoints: "60",
    streakMultiplier: "3x",
    recentTransactions: [
      { id: "1", title: "Badge Bonus: First Share", date: "Feb 20, 9:48 PM", points: "+50" },
      { id: "2", title: "Shared location - Bus 12B", date: "Feb 20, 9:48 PM", points: "+10" },
      { id: "3", title: "Daily Check-in", date: "Feb 19, 8:00 AM", points: "+5" },
    ],
  };

  const renderHistory = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {userData.recentTransactions.map((tx) => (
        <View key={tx.id} style={styles.txCard}>
          <View style={styles.txIconBg}>
            <Ionicons name="arrow-down-circle" size={18} color={palette.success} />
          </View>
          <View style={styles.txDetails}>
            <Text style={styles.txTitle}>{tx.title}</Text>
            <Text style={styles.txDate}>{tx.date}</Text>
          </View>
          <View style={styles.txPointsContainer}>
            <Text style={styles.txPoints}>{tx.points}</Text>
            <Text style={styles.txStatus}>CREDITED</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderRedeem = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Request Payout</Text>
      <Text style={styles.sectionSubtitle}>Convert your points to cash via UPI.</Text>

      <View style={styles.redeemCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Conversion Rate</Text>
          <Text style={styles.infoValue}>100 Pts = ₹10</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Minimum Payout</Text>
          <Text style={styles.infoValue}>₹100</Text>
        </View>

        <View style={styles.warningAlert}>
          <Ionicons name="alert-circle-outline" size={18} color={palette.warningDark} />
          <Text style={styles.warningText}>Add UPI ID in Profile to redeem</Text>
        </View>

        <TouchableOpacity style={styles.requestButton} activeOpacity={0.85}>
          <Text style={styles.requestButtonText}>Request Payout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Wallet</Text>
            <Text style={styles.headerSubtitle}>Manage your earnings</Text>
          </View>
          <View style={styles.levelBadge}>
            <Ionicons name="star" size={12} color={palette.warningDark} />
            <Text style={styles.levelText}>Level 2</Text>
          </View>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₹{userData.balance}</Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: "38%" }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressTextLeft}>
                Earn ₹{userData.moreToRedeem} more to redeem
              </Text>
              <Text style={styles.progressTextRight}>₹{userData.minRedeem} min</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Today</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>+{userData.todayPoints}</Text>
              <Text style={styles.statCoin}>🪙</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Streak</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>{userData.streakMultiplier}</Text>
              <Text style={styles.statSub}>Bonus</Text>
            </View>
          </View>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <View style={styles.tabWrapper}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "history" && styles.tabButtonActive]}
              onPress={() => setActiveTab("history")}
              activeOpacity={1}
            >
              <Text style={[styles.tabText, activeTab === "history" && styles.tabTextActive]}>
                History
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "redeem" && styles.tabButtonActive]}
              onPress={() => setActiveTab("redeem")}
              activeOpacity={1}
            >
              <Text style={[styles.tabText, activeTab === "redeem" && styles.tabTextActive]}>
                Redeem
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Content */}
        {activeTab === "history" ? renderHistory() : renderRedeem()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.xl,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.gray900,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.gray500,
    marginTop: 2,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.warningLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.warningBorder,
    gap: 4,
  },
  levelText: {
    color: palette.warningDark,
    fontSize: 12,
    fontWeight: "700",
  },
  balanceCard: {
    backgroundColor: palette.dark,
    borderRadius: 20,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadow.elevated,
  },
  balanceLabel: {
    color: colors.gray400,
    fontSize: 13,
    fontWeight: "500",
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: spacing.xl,
  },
  progressContainer: {},
  progressTrack: {
    height: 6,
    backgroundColor: palette.darkMuted,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: palette.primary,
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  progressTextLeft: {
    color: colors.gray400,
    fontSize: 11,
  },
  progressTextRight: {
    color: colors.gray500,
    fontSize: 11,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.card,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.borderLight,
    ...shadow.soft,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray500,
    fontWeight: "500",
    marginBottom: 6,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.gray900,
  },
  statCoin: {
    fontSize: 16,
    marginLeft: 6,
  },
  statSub: {
    fontSize: 13,
    color: colors.gray400,
    marginLeft: 6,
    fontWeight: "500",
  },
  tabContainer: {
    marginBottom: spacing.xl,
  },
  tabWrapper: {
    flexDirection: "row",
    backgroundColor: palette.surface,
    borderRadius: 14,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: palette.card,
    ...shadow.soft,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray500,
  },
  tabTextActive: {
    color: colors.gray900,
  },
  tabContent: {},
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.gray500,
    marginBottom: spacing.lg,
    marginTop: -6,
  },
  txCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.card,
    padding: spacing.lg,
    borderRadius: 14,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: palette.borderLight,
    ...shadow.soft,
  },
  txIconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: palette.successLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  txDetails: {
    flex: 1,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray800,
    marginBottom: 3,
  },
  txDate: {
    fontSize: 11,
    color: colors.gray400,
  },
  txPointsContainer: {
    alignItems: "flex-end",
  },
  txPoints: {
    fontSize: 15,
    fontWeight: "800",
    color: palette.success,
  },
  txStatus: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.gray400,
    marginTop: 2,
  },
  redeemCard: {
    backgroundColor: palette.card,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.borderLight,
    ...shadow.soft,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: palette.background,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.gray500,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.gray900,
  },
  warningAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.warningLight,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.warningBorder,
    marginVertical: spacing.lg,
    gap: 8,
  },
  warningText: {
    color: "#B45309",
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  requestButton: {
    backgroundColor: palette.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  requestButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
