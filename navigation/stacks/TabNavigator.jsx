import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { TAB_ICONS } from "../../config/navigation";
import { palette } from "../../design/tokens";

import ProfileScreen from "../../screens/shared/ProfileScreen";
import ContributionScreen from "../../screens/viewer/ContributionScreen";
import HomeScreen from "../../screens/viewer/HomeScreen";
import RouteSearchScreen from "../../screens/viewer/RouteSearchScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.muted,
        tabBarIcon: () => <Text style={{ fontSize: 20 }}>{TAB_ICONS[route.name] || "📌"}</Text>,
        tabBarStyle: {
          backgroundColor: palette.card,
          borderTopColor: palette.border,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Routes" component={RouteSearchScreen} />
      <Tab.Screen name="Wallet" component={ContributionScreen} />
      <Tab.Screen name="Settings" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
