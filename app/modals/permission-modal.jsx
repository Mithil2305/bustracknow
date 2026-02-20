import { useRouter } from "expo-router";
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { palette, radius, shadow, spacing } from "../../design/tokens";

export default function PermissionModal() {
  const router = useRouter();

  const handleOpenSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
    router.back();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.icon}>📍</Text>
        <Text style={styles.title}>Location Permission Needed</Text>
        <Text style={styles.body}>
          BusTrackNow needs your location to show nearby buses and let you contribute live tracking
          data. Please enable location access in your device settings.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={handleOpenSettings}>
          <Text style={styles.btnText}>Open Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.dismiss}>Not Now</Text>
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
    marginBottom: spacing.sm,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  dismiss: { fontSize: 14, color: palette.muted, marginTop: spacing.xs },
});
