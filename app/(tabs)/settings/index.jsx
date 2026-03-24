import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, palette, spacing } from "../../../design/tokens";
import { useAuthStore } from "../../../store/authStore";

export default function SettingsIndex() {
  const router = useRouter();
  const { userProfile, logout } = useAuthStore();

  const [rewardsEnabled, setRewardsEnabled] = useState(true);
  const [busAlerts, setBusAlerts] = useState(true);
  const [rewardAlerts, setRewardAlerts] = useState(true);

  const displayName = userProfile?.displayName || "Rajesh Kumar";
  const phone = userProfile?.phone || "+91 98765 43210";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12} activeOpacity={0.6}>
            <Ionicons name="arrow-back" size={24} color={colors.gray900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile Row */}
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profilePhone}>{phone}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/(auth)/profile")} activeOpacity={0.6}>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Rewards & Payouts */}
        <Text style={styles.sectionTitle}>
          <Text style={{ color: "#D97706" }}>✦ </Text>
          Rewards & Payouts
        </Text>

        {/* Enable Rewards */}
        <View style={styles.settingRow}>
          <View style={styles.settingIconWrap}>
            <Ionicons name="gift-outline" size={20} color="#D97706" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Enable Rewards</Text>
            <Text style={styles.settingDesc}>Earn points for contributions</Text>
          </View>
          <Switch
            value={rewardsEnabled}
            onValueChange={setRewardsEnabled}
            trackColor={{ false: "#E2E8F0", true: palette.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* UPI ID */}
        <View style={styles.settingRow}>
          <View style={styles.settingIconWrap}>
            <Ionicons name="card-outline" size={20} color="#D97706" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>UPI ID</Text>
            <Text style={styles.settingDesc}>Not set</Text>
          </View>
          <TouchableOpacity style={styles.changeBtn} activeOpacity={0.7}>
            <Text style={styles.changeBtnText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Badges & Leaderboard cards */}
        <TouchableOpacity
          style={styles.linkCard}
          onPress={() => router.push("/(tabs)/settings/badges")}
          activeOpacity={0.7}
        >
          <Text style={styles.linkCardText}>View Badges & Levels</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkCard}
          onPress={() => router.push("/(tabs)/settings/leaderboard")}
          activeOpacity={0.7}
        >
          <Text style={styles.linkCardText}>Leaderboard</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
        </TouchableOpacity>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>Preferences</Text>

        <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
          <View style={styles.settingIconWrap}>
            <Ionicons name="globe-outline" size={20} color={colors.gray600} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Language</Text>
            <Text style={styles.settingDesc}>English</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
        </TouchableOpacity>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingIconWrap}>
            <Ionicons name="notifications-outline" size={20} color={colors.gray600} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Bus Arrival Alerts</Text>
            <Text style={styles.settingDesc}>Get notified when bus is near</Text>
          </View>
          <Switch
            value={busAlerts}
            onValueChange={setBusAlerts}
            trackColor={{ false: "#E2E8F0", true: palette.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingIconWrap}>
            <Ionicons name="gift-outline" size={20} color={colors.gray600} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Reward Alerts</Text>
            <Text style={styles.settingDesc}>Points credited & payouts</Text>
          </View>
          <Switch
            value={rewardAlerts}
            onValueChange={setRewardAlerts}
            trackColor={{ false: "#E2E8F0", true: palette.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Privacy & Data */}
        <Text style={styles.sectionTitle}>Privacy & Data</Text>

        <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
          <View style={styles.settingIconWrap}>
            <Ionicons name="shield-outline" size={20} color={colors.gray600} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
          <View style={styles.settingIconWrap}>
            <Ionicons name="server-outline" size={20} color={colors.gray600} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Data Usage</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
        </TouchableOpacity>

        {/* Log Out */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color={palette.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  container: { paddingBottom: 40 },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: colors.gray900,
    marginLeft: spacing.md,
  },

  /* Profile Row */
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: palette.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  profileName: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.gray900,
  },
  profilePhone: {
    fontSize: 13,
    color: colors.gray500,
    marginTop: 2,
  },
  editLink: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.primary,
  },

  /* Section Title */
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.gray900,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },

  /* Setting Row */
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    backgroundColor: palette.card,
    borderBottomWidth: 1,
    borderBottomColor: palette.borderLight,
  },
  settingIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.gray800,
  },
  settingDesc: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },

  /* Change Button */
  changeBtn: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  changeBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.gray800,
  },

  /* Link Cards (Badges & Leaderboard) */
  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 16,
    backgroundColor: "#FFF9EB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FEEAAE",
  },
  linkCardText: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.primary,
  },

  /* Log Out */
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: spacing.xl,
    marginTop: spacing.xxxl,
    paddingVertical: 16,
    backgroundColor: palette.background,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: palette.danger,
  },
});
