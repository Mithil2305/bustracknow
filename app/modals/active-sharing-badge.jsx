import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { palette, radius, shadow, spacing } from "../../design/tokens";

export default function ActiveSharingBadgeModal() {
  const router = useRouter();

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeIcon}>📡</Text>
        </View>
        <Text style={styles.title}>You&apos;re Sharing Live!</Text>
        <Text style={styles.body}>
          Your location is being broadcast to help other commuters. You&apos;re earning points every
          minute!
        </Text>
        <Text style={styles.info}>Points earned this session: +12</Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
          <Text style={styles.btnText}>Got it!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  card: {
    backgroundColor: palette.card,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: "center",
    width: "100%",
    ...shadow,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: palette.success + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  badgeIcon: { fontSize: 32 },
  title: { fontSize: 20, fontWeight: "700", color: palette.text, marginBottom: spacing.xs },
  body: {
    fontSize: 14,
    color: palette.muted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  info: { fontSize: 16, fontWeight: "700", color: palette.success, marginBottom: spacing.lg },
  btn: {
    backgroundColor: palette.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
