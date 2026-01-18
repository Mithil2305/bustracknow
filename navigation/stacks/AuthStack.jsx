import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../../screens/auth/LoginScreen";
import OTPScreen from "../../screens/auth/OTPScreen";
import RegisterScreen from "../../screens/auth/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
	return (
		<Stack.Navigator
			screenOptions={{ headerShown: false, gestureEnabled: true }}
		>
			<Stack.Screen name="Login" component={LoginScreen} />
			<Stack.Screen name="Register" component={RegisterScreen} />
			<Stack.Screen name="OTP" component={OTPScreen} />
		</Stack.Navigator>
	);
}
