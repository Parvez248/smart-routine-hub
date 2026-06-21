"use client";

import { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type ThemeContextValue = {
  dark: boolean;
  toggleDark: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useLocalStorage("srh.dark", false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return <ThemeContext.Provider value={{ dark, toggleDark: () => setDark((value) => !value) }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
