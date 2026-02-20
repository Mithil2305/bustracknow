import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

/**
 * ModalStack wraps modal-style presentations (toasts, badges, permissions).
 * These are presented over the root navigator with transparent backgrounds.
 */
export default function ModalStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: "transparentModal",
        animation: "fade",
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      {/* Modal screens are registered here as needed */}
    </Stack.Navigator>
  );
}
