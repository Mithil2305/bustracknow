import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../services/firebase/firebaseConfig";
import { useAuthStore } from "../store/authStore";
import AdminNavigator from "./AdminNavigator";
import AuthStack from "./stacks/AuthStack";
import ViewerNavigator from "./ViewerNavigator";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
	const { user, role, isLoading, setUser, setLoading } = useAuthStore();

	useEffect(() => {
		setLoading(true);
		const unsub = onAuthStateChanged(auth, (u) => {
			setUser(u || null);
		});
		return unsub;
	}, [setLoading, setUser]);

	if (isLoading) return null;

	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			{!user ? (
				<Stack.Screen name="Auth" component={AuthStack} />
			) : role === "admin" ? (
				<Stack.Screen name="Admin" component={AdminNavigator} />
			) : (
				<Stack.Screen name="Viewer" component={ViewerNavigator} />
			)}
		</Stack.Navigator>
	);
}
