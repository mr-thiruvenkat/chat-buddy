import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { storage } from "@/services/storage";

type ProfileState = {
  username: string;
  avatarUri: string | null;
  themeMode: "light" | "dark";
  notificationsEnabled: boolean;
  hasHydrated: boolean;
  setProfile: (profile: { username: string; avatarUri: string | null }) => void;
  resetProfile: () => void;
  setThemeMode: (mode: "light" | "dark") => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setHasHydrated: (value: boolean) => void;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      username: "",
      avatarUri: null,
      themeMode: "light",
      notificationsEnabled: false,
      hasHydrated: false,
      setProfile: (profile) => set(profile),
      resetProfile: () =>
        set({
          username: "",
          avatarUri: null,
          themeMode: "light",
          notificationsEnabled: false,
        }),
      setThemeMode: (themeMode) => set({ themeMode }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "chat-buddy-profile",
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        username: state.username,
        avatarUri: state.avatarUri,
        themeMode: state.themeMode,
        notificationsEnabled: state.notificationsEnabled,
      }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
