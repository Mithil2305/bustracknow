import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { palette, radius, shadow, spacing } from "../../design/tokens";

export default function OfflineBannerModal() {
  const router = useRouter();

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.icon}>📶</Text>
        <Text style={styles.title}>You&apos;re Offline</Text>
        <Text style={styles.body}>
          Some features are limited while offline. Cached routes and recent data are still
          available. We&apos;ll reconnect automatically.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
          <Text style={styles.btnText}>Dismiss</Text>
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
  icon: { fontSize: 48, marginBottom: spacing.md },
  title: { fontSize: 20, fontWeight: "700", color: palette.text, marginBottom: spacing.xs },
  body: {
    fontSize: 14,
    color: palette.muted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  btn: {
    backgroundColor: palette.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
