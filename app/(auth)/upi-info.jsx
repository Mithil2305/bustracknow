import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Button from "../../components/common/Button";
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
    // Navigate forward after capturing UPI info
    router.replace("/(tabs)");
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>Add UPI ID</Text>
        <Text style={styles.subtitle}>
          Link your UPI ID to redeem earned points directly to your account. You can always add it
          later in Settings.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>UPI ID</Text>
          <TextInput
            style={styles.input}
            placeholder="yourname@upi"
            placeholderTextColor={palette.muted}
            value={upiId}
            onChangeText={setUpiId}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.actions}>
          <Button title="Save & Continue" onPress={handleSubmit} />
          <Text style={styles.skip} onPress={handleSkip}>
            Skip for now
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  container: { flex: 1, padding: spacing.lg, justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "700", color: palette.text, marginBottom: spacing.xs },
  subtitle: { fontSize: 14, color: palette.muted, lineHeight: 20, marginBottom: spacing.xl },
  card: {
    backgroundColor: palette.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow,
    marginBottom: spacing.xl,
  },
  label: { fontSize: 13, fontWeight: "600", color: palette.text, marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    fontSize: 16,
    color: palette.text,
  },
  actions: { alignItems: "center", gap: spacing.md },
  skip: { fontSize: 14, color: palette.primary, fontWeight: "600", marginTop: spacing.sm },
});
