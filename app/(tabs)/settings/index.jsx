import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, palette, shadow, spacing } from "../../../design/tokens";
import { useAuthStore } from "../../../store/authStore";

export default function SettingsIndex() {
  const router = useRouter();
  const { userProfile, logout } = useAuthStore();

  const sections = [
    {
      label: "Badges & Levels",
      desc: "View your achievements",
      icon: "ribbon",
      iconBg: "#FEF3C7",
      iconColor: "#D97706",
      route: "/(tabs)/settings/badges",
    },
    {
      label: "Leaderboard",
      desc: "See top contributors",
      icon: "podium",
      iconBg: "#DBEAFE",
      iconColor: "#2563EB",
      route: "/(tabs)/settings/leaderboard",
    },
    {
      label: "Saved Routes",
      desc: "Your bookmarked routes",
      icon: "bookmark",
      iconBg: "#CCFBF1",
      iconColor: palette.primary,
      route: "/(tabs)/settings/saved",
    },
    {
      label: "Edit Profile",
      desc: "Update your info",
      icon: "person",
      iconBg: "#F3E8FF",
      iconColor: "#7C3AED",
      route: "/(auth)/profile",
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.screenTitle}>Settings</Text>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(userProfile?.displayName || "U")[0].toUpperCase()}
              </Text>
            </View>
            <View style={styles.onlineDot} />
          </View>
          <Text style={styles.name}>{userProfile?.displayName || "User"}</Text>
          <Text style={styles.phone}>{userProfile?.phone || "+91 XXXXX XXXXX"}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>320</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Lv 2</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.menuSection}>
          {sections.map((s) => (
            <TouchableOpacity
              key={s.label}
              style={styles.menuRow}
              onPress={() => router.push(s.route)}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: s.iconBg }]}>
                <Ionicons name={s.icon} size={18} color={s.iconColor} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{s.label}</Text>
                <Text style={styles.menuDesc}>{s.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.gray300} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color={palette.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>BusTrackNow v1.2.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  container: { padding: spacing.xl, paddingBottom: 40 },
  screenTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.gray900,
    marginBottom: spacing.xl,
  },
  profileCard: {
    backgroundColor: palette.card,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: "center",
    marginBottom: spacing.xl,
    ...shadow.card,
  },
  avatarWrap: {
    position: "relative",
    marginBottom: spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: palette.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: palette.success,
    borderWidth: 3,
    borderColor: palette.card,
  },
  name: {
    fontSize: 19,
    fontWeight: "700",
    color: colors.gray900,
  },
  phone: {
    fontSize: 13,
    color: colors.gray500,
    marginTop: 2,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.background,
    borderRadius: 14,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    width: "100%",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.gray900,
  },
  statLabel: {
    fontSize: 11,
    color: colors.gray500,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: palette.border,
  },
  menuSection: {
    backgroundColor: palette.card,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: spacing.xl,
    ...shadow.soft,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: palette.borderLight,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.gray800,
  },
  menuDesc: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: palette.danger,
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: colors.gray400,
    marginTop: spacing.sm,
  },
});
