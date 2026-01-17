import { create } from "zustand";

/**
 * store/adminStore.js
 * State management for Admin Dashboard and God Mode features.
 */
const useAdminStore = create((set, get) => ({
	activeTab: "overview", // 'overview', 'routes', 'users', 'stops'
	selectedRouteId: null,
	isEditing: false,

	// Admin-only global stats
	stats: {
		activeBuses: 0,
		totalRoutes: 0,
		totalUsers: 0,
	},

	// UI State for Modals
	modals: {
		addRoute: false,
		editStop: false,
	},

	// Actions
	setActiveTab: (tab) => set({ activeTab: tab }),

	setSelectedRouteId: (id) => set({ selectedRouteId: id }),

	toggleEditMode: () => set((state) => ({ isEditing: !state.isEditing })),

	updateStats: (newStats) =>
		set((state) => ({
			stats: { ...state.stats, ...newStats },
		})),

	setModalState: (modalName, isOpen) =>
		set((state) => ({
			modals: { ...state.modals, [modalName]: isOpen },
		})),

	resetAdminState: () =>
		set({
			selectedRouteId: null,
			isEditing: false,
			modals: { addRoute: false, editStop: false },
		}),
}));

export default useAdminStore;
