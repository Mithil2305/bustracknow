import { create } from "zustand";

/**
 * store/authStore.js
 * Manages user authentication state and role.
 */
export const useAuthStore = create((set) => ({
	user: null,
	userProfile: null, // Additional data from Firestore (role, name, etc.)
	isLoading: true,
	isAuthenticated: false,
	error: null,

	// Actions
	setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

	setUserProfile: (profile) => set({ userProfile: profile }),

	setLoading: (loading) => set({ isLoading: loading }),

	setError: (error) => set({ error }),

	logout: () =>
		set({
			user: null,
			role: null,
			token: null,
		}),
}));

export default useAuthStore;
