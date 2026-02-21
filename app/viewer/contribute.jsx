import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, palette, shadow, spacing } from "../../design/tokens";

export default function ContributionScreen() {
  const router = useRouter();
  const [route, setRoute] = useState("");
  const [note, setNote] = useState("");

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.gray900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Issue</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.container}>
        <Text style={styles.subtitle}>
          Help your community by reporting delays, crowding, or route changes.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Route / Bus Number</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="bus-outline" size={18} color={colors.gray400} />
            <TextInput
              style={styles.input}
              placeholder="e.g. 45A"
              value={route}
              onChangeText={setRoute}
              placeholderTextColor={colors.gray400}
            />
          </View>

          <Text style={styles.label}>Details</Text>
          <TextInput
            style={[styles.textArea]}
            placeholder="Describe the issue..."
            value={note}
            onChangeText={setNote}
            multiline
            placeholderTextColor={colors.gray400}
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.submitBtn} activeOpacity={0.85}>
            <Ionicons name="send" size={18} color="#fff" />
            <Text style={styles.submitText}>Submit Report</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: palette.card,
    borderBottomWidth: 1,
    borderBottomColor: palette.borderLight,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: colors.gray900 },
  container: { flex: 1, padding: spacing.lg },
  subtitle: { fontSize: 14, color: colors.gray500, marginBottom: spacing.lg, lineHeight: 21 },
  card: {
    backgroundColor: palette.card,
    borderRadius: 20,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: palette.borderLight,
    ...shadow.card,
  },
  label: { fontSize: 13, fontWeight: "700", color: colors.gray600, marginBottom: spacing.xs },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.gray50,
    height: 52,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  input: { flex: 1, color: colors.gray900, fontSize: 15 },
  textArea: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 14,
    padding: spacing.md,
    backgroundColor: colors.gray50,
    color: colors.gray900,
    fontSize: 15,
    height: 120,
    marginBottom: spacing.lg,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: 14,
    backgroundColor: palette.primary,
    gap: 10,
    ...shadow.elevated,
  },
  submitText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
});
