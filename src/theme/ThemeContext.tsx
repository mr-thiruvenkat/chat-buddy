import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";

import { useProfileStore } from "@/store/profile-store";
import { colors } from "@/theme/tokens";

type ThemeContextValue = {
  mode: "light" | "dark";
  isDark: boolean;
  colors: typeof colors;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const selectedMode = useProfileStore((state: any) => state.themeMode);
  const hasHydrated = useProfileStore((state: any) => state.hasHydrated);
  const mode = hasHydrated ? selectedMode : systemScheme === "dark" ? "dark" : "light";

  const value = useMemo(() => ({ mode, isDark: mode === "dark", colors }), [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
