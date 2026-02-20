import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { palette, radius, shadow, spacing } from "../../../design/tokens";

export default function StopDetail() {
  const { stopId, stopName } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>🚏</Text>
          </View>
          <Text style={styles.name}>{stopName || "Bus Stop"}</Text>
          <Text style={styles.id}>ID: {stopId || "—"}</Text>
        </View>
        <Text style={styles.sectionTitle}>Upcoming Buses</Text>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Real-time arrival predictions will appear here</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  container: { padding: spacing.md },
  card: {
    backgroundColor: palette.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.lg,
    ...shadow,
  },
  iconWrap: { marginBottom: spacing.sm },
  icon: { fontSize: 48 },
  name: { fontSize: 20, fontWeight: "700", color: palette.text },
  id: { fontSize: 12, color: palette.muted, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: palette.text, marginBottom: spacing.sm },
  placeholder: {
    backgroundColor: palette.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
    ...shadow,
  },
  placeholderText: { fontSize: 13, color: palette.muted },
});
