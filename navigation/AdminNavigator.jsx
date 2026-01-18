import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomTabBar from "../components/common/CustomTabBar";
import AdminDashboard from "../screens/admin/AdminDashboard";
import GodModeMap from "../screens/admin/GodModeMap";
import RouteManagement from "../screens/admin/RouteManagement";
import StopManagement from "../screens/admin/StopManagement";
import UserManagement from "../screens/admin/UserManagement";

const Tab = createBottomTabNavigator();

export default function AdminNavigator() {
	return (
		<Tab.Navigator
			tabBar={(props) => <CustomTabBar {...props} isAdmin />}
			screenOptions={{ headerShown: false }}
		>
			<Tab.Screen name="Dashboard" component={AdminDashboard} />
			<Tab.Screen name="Users" component={UserManagement} />
			<Tab.Screen name="Stops" component={StopManagement} />
			<Tab.Screen name="Routes" component={RouteManagement} />
			<Tab.Screen name="GodMode" component={GodModeMap} />
		</Tab.Navigator>
	);
}
