import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { palette, radius, shadow, spacing } from "../../design/tokens";

const OTP_LENGTH = 6;

export default function OTPScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) return;
    setLoading(true);
    try {
      router.replace("/(auth)/profile");
    } catch (_e) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => setTimer(30);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={s.container}>
        {/* Back */}
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={palette.text} />
        </TouchableOpacity>

        <View style={s.center}>
          <View style={s.iconBg}>
            <Ionicons name="chatbox-ellipses-outline" size={36} color={palette.primary} />
          </View>
          <Text style={s.title}>Verify your number</Text>
          <Text style={s.subtitle}>Enter the 6-digit code sent to {phone || "your phone"}</Text>

          <View style={s.otpRow}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={(ref) => {
                  inputRefs.current[i] = ref;
                }}
                style={[s.otpBox, digit && s.otpBoxFilled]}
                value={digit}
                onChangeText={(text) => handleChange(text, i)}
                onKeyPress={(e) => handleKeyPress(e, i)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          <TouchableOpacity
            style={[s.verifyBtn, otp.join("").length < OTP_LENGTH && { opacity: 0.4 }]}
            onPress={handleVerify}
            disabled={otp.join("").length < OTP_LENGTH || loading}
            activeOpacity={0.85}
          >
            <Text style={s.verifyText}>{loading ? "Verifying..." : "Verify & Continue"}</Text>
          </TouchableOpacity>

          <View style={s.resendRow}>
            {timer > 0 ? (
              <Text style={s.timerText}>Resend code in {timer}s</Text>
            ) : (
              <TouchableOpacity onPress={handleResend}>
                <Text style={s.resendText}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
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
  subtitle: {
    fontSize: 14,
    color: palette.muted,
    textAlign: "center",
    lineHeight: 21,
    paddingHorizontal: spacing.lg,
  },
  otpRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: palette.border,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    color: palette.text,
    backgroundColor: palette.card,
  },
  otpBoxFilled: { borderColor: palette.primary, backgroundColor: palette.primaryLight },
  verifyBtn: {
    width: "100%",
    height: 52,
    borderRadius: radius.md,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
    ...shadow.card,
  },
  verifyText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  resendRow: { marginTop: spacing.md },
  timerText: { fontSize: 14, color: palette.muted, fontWeight: "500" },
  resendText: { fontSize: 14, color: palette.primary, fontWeight: "700" },
});
