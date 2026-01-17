import { useCallback } from "react";
import { useAuthStore } from "../store/authStore";

/**
 * Auth convenience hook.
 * Expected store shape (adjust if different):
 * - state: { user, loading, error, token }
 * - actions: login(phone, otp), logout(), refresh()
 */
export function useAuth() {
	const user = useAuthStore((s) => s.user);
	const loading = useAuthStore((s) => s.loading);
	const error = useAuthStore((s) => s.error);
	const token = useAuthStore((s) => s.token);

	const login = useAuthStore((s) => s.login);
	const logout = useAuthStore((s) => s.logout);
	const refresh = useAuthStore((s) => s.refresh);

	const isAuthenticated = !!user?.id || !!token;

	const loginWithPhoneOtp = useCallback(
		async (phone, otp) => {
			if (!login) return;
			return login(phone, otp);
		},
		[login],
	);

	return {
		user,
		token,
		loading,
		error,
		isAuthenticated,
		login: loginWithPhoneOtp,
		refresh,
		logout,
	};
}

export default useAuth;
