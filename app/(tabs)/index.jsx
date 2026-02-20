import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import LiveMap from "../../components/map/LiveMap";
import { palette, spacing } from "../../design/tokens";

export default function TabsHome() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>BusTrackNow</Text>
        <Text style={styles.subtitle}>Live bus tracking near you</Text>
      </View>
      <View style={styles.mapWrap}>
        <LiveMap />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  header: { padding: spacing.md, paddingBottom: spacing.xs },
  title: { fontSize: 22, fontWeight: "800", color: palette.primary },
  subtitle: { fontSize: 13, color: palette.muted, marginTop: 2 },
  mapWrap: { flex: 1 },
});
