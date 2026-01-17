import { create } from "zustand";

/**
 * store/busStore.js
 * Manages Real-time bus locations and socket/stream data.
 */
const useBusStore = create((set, get) => ({
	liveBuses: {}, // Map of busId -> { lat, lng, speed, occupancy, lastUpdated }
	userLocation: null,
	followingBusId: null, // If user is 'locking' camera to a bus
	connectionStatus: "disconnected", // 'connected', 'connecting', 'disconnected'

	// Actions
	updateBusLocation: (busId, data) =>
		set((state) => ({
			liveBuses: {
				...state.liveBuses,
				[busId]: {
					...state.liveBuses[busId],
					...data,
					lastUpdated: Date.now(),
				},
			},
		})),

	// Bulk update (e.g., initial snapshot)
	setLiveBuses: (busesArray) => {
		const busMap = {};
		busesArray.forEach((bus) => {
			busMap[bus.id] = bus;
		});
		set({ liveBuses: busMap });
	},

	removeBus: (busId) =>
		set((state) => {
			const newBuses = { ...state.liveBuses };
			delete newBuses[busId];
			return { liveBuses: newBuses };
		}),

	setUserLocation: (location) => set({ userLocation: location }),

	setFollowingBus: (busId) => set({ followingBusId: busId }),

	setConnectionStatus: (status) => set({ connectionStatus: status }),

	clearAll: () => set({ liveBuses: {}, followingBusId: null }),
}));

export default useBusStore;
