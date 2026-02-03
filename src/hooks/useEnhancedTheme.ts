import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface EnhancedTheme {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  resolvedTheme: string | undefined;
  toggleTheme: () => void;
  isDarkMode: boolean;
  isLightMode: boolean;
  systemTheme: string | undefined;
}

export function useEnhancedTheme(): EnhancedTheme {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLightMode, setIsLightMode] = useState(true);

  useEffect(() => {
    setIsDarkMode(resolvedTheme === 'dark');
    setIsLightMode(resolvedTheme === 'light');
  }, [resolvedTheme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return {
    theme,
    setTheme,
    resolvedTheme,
    toggleTheme,
    isDarkMode,
    isLightMode,
    systemTheme,
  };
}