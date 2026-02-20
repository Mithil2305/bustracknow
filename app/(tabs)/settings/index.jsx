import { useRouter } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { palette, radius, shadow, spacing } from "../../../design/tokens";
import { useAuthStore } from "../../../store/authStore";

export default function SettingsIndex() {
  const router = useRouter();
  const { userProfile, logout } = useAuthStore();

  const sections = [
    { label: "Badges & Levels", icon: "🏅", route: "/(tabs)/settings/badges" },
    { label: "Leaderboard", icon: "🏆", route: "/(tabs)/settings/leaderboard" },
    { label: "Saved Routes", icon: "💾", route: "/(tabs)/settings/saved" },
    { label: "Profile", icon: "👤", route: "/profile" },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(userProfile?.displayName || "U")[0].toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{userProfile?.displayName || "User"}</Text>
          <Text style={styles.phone}>{userProfile?.phone || ""}</Text>
        </View>

        {sections.map((s) => (
          <TouchableOpacity key={s.label} style={styles.row} onPress={() => router.push(s.route)}>
            <Text style={styles.rowIcon}>{s.icon}</Text>
            <Text style={styles.rowLabel}>{s.label}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  container: { padding: spacing.md },
  profileCard: {
    backgroundColor: palette.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.lg,
    ...shadow,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: palette.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  avatarText: { fontSize: 26, fontWeight: "700", color: "#fff" },
  name: { fontSize: 18, fontWeight: "700", color: palette.text },
  phone: { fontSize: 13, color: palette.muted, marginTop: 2 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow,
  },
  rowIcon: { fontSize: 20, marginRight: spacing.sm },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: "500", color: palette.text },
  arrow: { fontSize: 22, color: palette.muted },
  logoutBtn: {
    marginTop: spacing.lg,
    alignItems: "center",
    padding: spacing.md,
  },
  logoutText: { fontSize: 15, fontWeight: "600", color: palette.danger },
});
