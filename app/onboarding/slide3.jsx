import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, palette, spacing } from "../../design/tokens";

export default function OnboardingSlide3() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Ionicons name="trophy" size={64} color="#F59E0B" />
        </View>

        <Text style={styles.title}>Earn Points & Rewards</Text>
        <Text style={styles.body}>
          Every ride you share earns points. Maintain streaks for bonuses. Redeem points directly to
          your UPI wallet.
        </Text>

        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>

        <TouchableOpacity
          style={styles.btn}
          activeOpacity={0.85}
          onPress={() => router.push("/onboarding/slide4")}
        >
          <Text style={styles.btnText}>Next</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  container: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 },
  iconCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.gray900,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: 15,
    color: colors.gray500,
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  dots: { flexDirection: "row", gap: 8, marginBottom: 32 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gray200 },
  dotActive: { backgroundColor: palette.primary, width: 24 },
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
  },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});
