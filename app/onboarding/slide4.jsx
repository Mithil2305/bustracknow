import { useRouter } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Button from "../../components/common/Button";
import { palette, spacing } from "../../design/tokens";

export default function OnboardingSlide4() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>🚨</Text>
        </View>
        <Text style={styles.title}>Community Alerts</Text>
        <Text style={styles.body}>
          Report delays, breakdowns, or safety concerns. Upvote real alerts and build your trust
          score in the community.
        </Text>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>
        <Button title="Let's Go!" onPress={() => router.replace("/(auth)")} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.lg },
  iconWrap: { marginBottom: spacing.lg },
  icon: { fontSize: 64 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: palette.text,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: 14,
    color: palette.muted,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: spacing.xl,
  },
  dots: { flexDirection: "row", gap: 8, marginBottom: spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.border },
  dotActive: { backgroundColor: palette.primary, width: 24 },
});
