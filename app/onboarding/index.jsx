import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, palette, spacing } from "../../design/tokens";

export default function OnboardingIndex() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoWrap}>
          <Ionicons name="bus" size={56} color={palette.primary} />
        </View>

        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.brand}>BusTrackNow</Text>
        <Text style={styles.subtitle}>
          Track buses in real-time, earn rewards, and help your community commute smarter.
        </Text>

        {/* CTA */}
        <TouchableOpacity
          style={styles.btn}
          activeOpacity={0.85}
          onPress={() => router.push("/onboarding/slide1")}
        >
          <Text style={styles.btnText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/(auth)")}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  logoWrap: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: "#CCFBF1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.gray500,
    marginBottom: 4,
  },
  brand: {
    fontSize: 32,
    fontWeight: "800",
    color: palette.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 15,
    color: colors.gray500,
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.primary,
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 32,
    gap: 10,
    alignSelf: "stretch",
    marginBottom: spacing.lg,
  },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  skip: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray500,
  },
});
