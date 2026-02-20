import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { palette } from "../../design/tokens";

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: palette.primary,
				tabBarInactiveTintColor: palette.subtext,
				tabBarStyle: {
					backgroundColor: palette.card,
					borderTopColor: palette.border,
					paddingBottom: 4,
					height: 56,
				},
				tabBarLabelStyle: {
					fontSize: 11,
					fontWeight: "700",
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="map" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="routes"
				options={{
					title: "Routes",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="git-branch" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="wallet"
				options={{
					title: "Wallet",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="wallet" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="alerts"
				options={{
					title: "Alerts",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="megaphone" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Settings",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="settings" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
