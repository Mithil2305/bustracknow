import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { palette, radius, shadow, spacing } from "../../design/tokens";

export default function UPIInfoScreen() {
  const router = useRouter();
  const [upiId, setUpiId] = useState("");
  const UPI_REGEX = /^[\w.-]+@[\w]+$/;

  const handleSubmit = () => {
    if (!UPI_REGEX.test(upiId.trim())) {
      Alert.alert("Invalid UPI ID", "Please enter a valid UPI ID (e.g. name@upi)");
      return;
    }
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={s.container}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={palette.text} />
          </TouchableOpacity>

          <View style={s.center}>
            <View style={s.iconBg}>
              <Ionicons name="wallet-outline" size={36} color={palette.primary} />
            </View>
            <Text style={s.title}>Link your UPI</Text>
            <Text style={s.sub}>Add your UPI ID to receive point redemption payouts directly</Text>

            <View style={s.card}>
              <Text style={s.label}>UPI ID</Text>
              <View style={s.inputRow}>
                <Ionicons name="card-outline" size={18} color={palette.muted} />
                <TextInput
                  style={s.input}
                  placeholder="yourname@upi"
                  placeholderTextColor={palette.muted}
                  value={upiId}
                  onChangeText={setUpiId}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {UPI_REGEX.test(upiId) && (
                  <Ionicons name="checkmark-circle" size={20} color={palette.success} />
                )}
              </View>

              <View style={s.infoRow}>
                <Ionicons name="shield-checkmark-outline" size={16} color={palette.primary} />
                <Text style={s.infoText}>Your UPI ID is encrypted and stored securely</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[s.ctaBtn, !UPI_REGEX.test(upiId) && { opacity: 0.4 }]}
              onPress={handleSubmit}
              disabled={!UPI_REGEX.test(upiId)}
              activeOpacity={0.85}
            >
              <Text style={s.ctaText}>Save & Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
              <Text style={s.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  container: { flex: 1, paddingHorizontal: spacing.xl },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.card,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
    ...shadow.soft,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.lg },
  iconBg: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: palette.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 24, fontWeight: "800", color: palette.text },
  sub: {
    fontSize: 14,
    color: palette.muted,
    textAlign: "center",
    lineHeight: 21,
    paddingHorizontal: spacing.md,
  },
  card: {
    width: "100%",
    backgroundColor: palette.card,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadow.card,
  },
  label: { fontSize: 13, fontWeight: "700", color: palette.subtext },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: spacing.md,
    backgroundColor: palette.surface,
  },
  input: { flex: 1, fontSize: 15, color: palette.text },
  infoRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingTop: spacing.xs },
  infoText: { fontSize: 12, color: palette.muted },
  ctaBtn: {
    width: "100%",
    height: 52,
    borderRadius: radius.md,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  skipText: { fontSize: 14, color: palette.primary, fontWeight: "600" },
});
