import { useMemo } from "react";
import { useAuthStore } from "../store/authStore";

/**
 * User role helper hook.
 * Expected user shape: { role: "admin" | "viewer" | "contributor" | ... }
 */
export function useUserRole() {
	const user = useAuthStore((s) => s.user);
	const role = user?.role || "guest";

	const flags = useMemo(
		() => ({
			role,
			isAdmin: role === "admin",
			isViewer: role === "viewer",
			isContributor: role === "contributor",
			isGuest: role === "guest",
		}),
		[role],
	);

	return flags;
}

export default useUserRole;
