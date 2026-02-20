import { Stack } from "expo-router";
import { palette } from "../../design/tokens";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: palette.background },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="upi-verify" />
      <Stack.Screen name="upi-info" />
    </Stack>
  );
}
