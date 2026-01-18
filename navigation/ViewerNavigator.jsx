import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomTabBar from "../components/common/CustomTabBar";
import ProfileScreen from "../screens/shared/ProfileScreen";
import HomeScreen from "../screens/viewer/HomeScreen";
import LiveTrackingScreen from "../screens/viewer/LiveTrackingScreen";
import RouteSearchScreen from "../screens/viewer/RouteSearchScreen";

const Tab = createBottomTabNavigator();

export default function ViewerNavigator() {
	return (
		<Tab.Navigator
			tabBar={(props) => <CustomTabBar {...props} />}
			screenOptions={{ headerShown: false }}
		>
			<Tab.Screen name="Home" component={HomeScreen} />
			<Tab.Screen name="Live" component={LiveTrackingScreen} />
			<Tab.Screen name="Search" component={RouteSearchScreen} />
			<Tab.Screen name="Profile" component={ProfileScreen} />
		</Tab.Navigator>
	);
}
