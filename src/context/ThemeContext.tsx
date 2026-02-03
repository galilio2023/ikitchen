"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from "next-themes";

/**
 * Enhanced Theme Provider
 * Wraps next-themes to ensure Tailwind v4 compatibility
 * and provides a simple 'isDarkMode' helper.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

/**
 * Enhanced useTheme hook
 * Consolidates next-themes with a boolean helper
 */
export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();

  return {
    theme: theme as "light" | "dark" | "system",
    setTheme,
    // resolvedTheme handles 'system' logic for you automatically
    isDarkMode: resolvedTheme === "dark",
  };
}
