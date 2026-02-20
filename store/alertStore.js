import { create } from "zustand";

export const useAlertStore = create((set) => ({
  alerts: [],
  myAlerts: [],
  loading: false,
  error: null,

  setAlerts: (alerts) => set({ alerts }),
  setMyAlerts: (myAlerts) => set({ myAlerts }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts],
      myAlerts: alert.isMine ? [alert, ...state.myAlerts] : state.myAlerts,
    })),

  updateAlert: (alertId, updates) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, ...updates } : a)),
      myAlerts: state.myAlerts.map((a) => (a.id === alertId ? { ...a, ...updates } : a)),
    })),

  removeAlert: (alertId) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== alertId),
      myAlerts: state.myAlerts.filter((a) => a.id !== alertId),
    })),

  reset: () =>
    set({
      alerts: [],
      myAlerts: [],
      loading: false,
      error: null,
    }),
}));
