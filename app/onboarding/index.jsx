import { useRouter } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Button from "../../components/common/Button";
import { palette, spacing } from "../../design/tokens";

export default function OnboardingIndex() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to BusTrackNow</Text>
        <Text style={styles.subtitle}>
          Track buses in real-time, earn points, and help your community commute smarter.
        </Text>
        <Button title="Get Started" onPress={() => router.push("/onboarding/slide1")} />
        <Text style={styles.skip} onPress={() => router.replace("/(auth)")}>
          Skip
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.lg },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: palette.primary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    color: palette.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  skip: { fontSize: 14, color: palette.muted, marginTop: spacing.md },
});
