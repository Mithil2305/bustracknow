import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { palette, radius, shadow, spacing } from "../../design/tokens";

export default function PhoneAuthScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [countryCode] = useState("+91");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert("Invalid Number", "Please enter a valid 10-digit phone number.");
      return;
    }
    setLoading(true);
    try {
      const fullPhone = `${countryCode}${phone}`;
      router.push({ pathname: "/(auth)/otp", params: { phone: fullPhone } });
    } catch (_error) {
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.background} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={s.body}>
          <View style={s.logoWrap}>
            <View style={s.logoBg}>
              <Ionicons name="bus" size={44} color={palette.primary} />
            </View>
            <Text style={s.appName}>BusTrackNow</Text>
            <Text style={s.tagline}>Track buses in real-time and earn rewards</Text>
          </View>

          <View style={s.card}>
            <Text style={s.cardTitle}>Enter your phone number</Text>
            <Text style={s.cardSub}>We will send you a verification code</Text>

            <View style={s.phoneRow}>
              <TouchableOpacity style={s.countryPicker}>
                <Text style={{ fontSize: 18 }}>🇮🇳</Text>
                <Text style={s.codeText}>{countryCode}</Text>
                <Ionicons name="chevron-down" size={14} color={palette.muted} />
              </TouchableOpacity>
              <TextInput
                style={s.phoneInput}
                placeholder="Phone number"
                placeholderTextColor={palette.muted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            <TouchableOpacity
              style={[s.sendBtn, phone.length < 10 && { opacity: 0.4 }]}
              onPress={handleSendOTP}
              disabled={phone.length < 10 || loading}
              activeOpacity={0.85}
            >
              <Text style={s.sendBtnText}>{loading ? "Sending..." : "Send OTP"}</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={s.terms}>
            {"By continuing, you agree to our "}
            <Text style={s.termsLink}>Terms of Service</Text>
            {" and "}
            <Text style={s.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  body: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: "center", gap: spacing.xxl },
  logoWrap: { alignItems: "center", gap: spacing.sm },
  logoBg: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: palette.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  appName: { fontSize: 28, fontWeight: "800", color: palette.text, letterSpacing: -0.5 },
  tagline: { fontSize: 15, color: palette.subtext, textAlign: "center" },
  card: {
    backgroundColor: palette.card,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadow.card,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: palette.text },
  cardSub: { fontSize: 14, color: palette.muted },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: "hidden",
    marginTop: spacing.sm,
  },
  countryPicker: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    height: 52,
    gap: spacing.xs,
    borderRightWidth: 1,
    borderRightColor: palette.border,
  },
  codeText: { fontSize: 15, fontWeight: "600", color: palette.text },
  phoneInput: {
    flex: 1,
    height: 52,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: palette.text,
    letterSpacing: 0.5,
  },
  sendBtn: {
    flexDirection: "row",
    backgroundColor: palette.primary,
    borderRadius: radius.md,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
    ...shadow.card,
  },
  sendBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  terms: {
    fontSize: 13,
    color: palette.muted,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
  },
  termsLink: { color: palette.primary, fontWeight: "600" },
});
