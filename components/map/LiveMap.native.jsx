import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { palette, radius, shadow, spacing } from "../../design/tokens";

/**
 * LiveMap stub – fallback when WebView is unavailable.
 * The real LiveMap uses OpenStreetMap via a WebView + Leaflet.
 * This placeholder renders a styled card so the rest of the app can
 * load and function while you iterate on the UI.
 */
export default function LiveMap({ style, children }) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.placeholder}>
        <View style={styles.iconWrap}>
          <Ionicons name="map-outline" size={40} color={palette.primary} />
        </View>
        <Text style={styles.title}>Map Preview</Text>
        <Text style={styles.subtitle}>OpenStreetMap loading...</Text>
        <Text style={styles.hint}>Ensure react-native-webview is installed.</Text>
      </View>
      {children ? <View style={styles.overlay}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    overflow: "hidden",
    backgroundColor: "#E8F4F8",
    minHeight: 320,
    ...shadow.card,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    minHeight: 320,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: palette.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: palette.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: palette.subtext,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  hint: {
    fontSize: 12,
    color: palette.muted,
    textAlign: "center",
    fontStyle: "italic",
  },
  overlay: {
    position: "absolute",
    top: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
  },
});
