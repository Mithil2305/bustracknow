import { create } from "zustand";

export const usePointsStore = create((set) => ({
  balance: 0,
  lifetime: 0,
  streak: 0,
  transactions: [],
  loading: false,

  setBalance: (balance) => set({ balance }),
  setLifetime: (lifetime) => set({ lifetime }),
  setStreak: (streak) => set({ streak }),
  setTransactions: (transactions) => set({ transactions }),
  setLoading: (loading) => set({ loading }),

  addTransaction: (tx) =>
    set((state) => ({
      transactions: [tx, ...state.transactions],
      balance: state.balance + (tx.amount || 0),
      lifetime: tx.amount > 0 ? state.lifetime + tx.amount : state.lifetime,
    })),

  deductPoints: (amount) =>
    set((state) => ({
      balance: Math.max(0, state.balance - amount),
    })),

  reset: () =>
    set({
      balance: 0,
      lifetime: 0,
      streak: 0,
      transactions: [],
      loading: false,
    }),
}));
