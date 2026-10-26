"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
	token: string | null;
	userId: string | null;
	isHydrated: boolean;
	login: (token: string, userId: string) => void;
	logout: () => void;
	clearAuth: () => void;
	setHydrated: (isHydrated: boolean) => void;
};

const emptyAuth = {
	token: null,
	userId: null,
} satisfies Pick<AuthState, "token" | "userId">;

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			...emptyAuth,
			isHydrated: false,
			login: (token, userId) => set({ token, userId }),
			logout: () => set(emptyAuth),
			clearAuth: () => set(emptyAuth),
			setHydrated: (isHydrated) => set({ isHydrated }),
		}),
		{
			name: "printar-auth",
			storage: createJSONStorage(() => localStorage),
			partialize: ({ token, userId }) => ({ token, userId }),
			onRehydrateStorage: () => (state) => {
				state?.setHydrated(true);
			},
		},
	),
);
