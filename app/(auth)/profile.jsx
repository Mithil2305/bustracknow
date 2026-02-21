import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { palette, radius, shadow, spacing } from "../../design/tokens";

export default function ProfileSetupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);

  const languages = ["English", "Tamil", "Hindi", "Telugu", "Kannada"];

  const handleComplete = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      router.replace("/(auth)/upi-info");
    } catch (_e) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={s.container}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={palette.text} />
        </TouchableOpacity>

        <View style={s.center}>
          {/* Avatar */}
          <TouchableOpacity style={s.avatarWrap}>
            <Ionicons name="person" size={40} color={palette.primary} />
            <View style={s.cameraIcon}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>

          <Text style={s.title}>Set up your profile</Text>
          <Text style={s.sub}>Tell us about yourself</Text>

          {/* Name */}
          <View style={s.field}>
            <Text style={s.label}>Display Name</Text>
            <View style={s.inputRow}>
              <Ionicons name="person-outline" size={18} color={palette.muted} />
              <TextInput
                style={s.input}
                placeholder="Your name"
                placeholderTextColor={palette.muted}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* Language */}
          <View style={s.field}>
            <Text style={s.label}>Preferred Language</Text>
            <View style={s.chipRow}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[s.chip, language === lang && s.chipActive]}
                  onPress={() => setLanguage(lang)}
                >
                  <Text style={[s.chipText, language === lang && s.chipTextActive]}>{lang}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Continue */}
          <TouchableOpacity
            style={[s.ctaBtn, !name.trim() && { opacity: 0.4 }]}
            onPress={handleComplete}
            disabled={!name.trim() || loading}
            activeOpacity={0.85}
          >
            <Text style={s.ctaText}>{loading ? "Saving..." : "Continue"}</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
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
  avatarWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: palette.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: palette.card,
  },
  title: { fontSize: 24, fontWeight: "800", color: palette.text },
  sub: { fontSize: 14, color: palette.muted },
  field: { width: "100%", gap: spacing.sm },
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
    backgroundColor: palette.card,
  },
  input: { flex: 1, fontSize: 15, color: palette.text },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  chipActive: { backgroundColor: palette.primaryLight, borderColor: palette.primary },
  chipText: { fontSize: 13, fontWeight: "600", color: palette.subtext },
  chipTextActive: { color: palette.primaryDark },
  ctaBtn: {
    flexDirection: "row",
    width: "100%",
    height: 52,
    borderRadius: radius.md,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.md,
    ...shadow.card,
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
