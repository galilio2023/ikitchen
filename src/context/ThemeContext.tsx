'use client';

import * as React from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  isDarkMode: boolean;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ 
  children, 
  initialTheme = 'dark' 
}: { 
  children: React.ReactNode;
  initialTheme?: 'light' | 'dark' | 'system'; 
}) {
  const [theme, setThemeState] = React.useState<'light' | 'dark' | 'system'>(initialTheme);
  const [isDarkMode, setIsDarkMode] = React.useState(initialTheme === 'dark');

  React.useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setIsDarkMode(e.matches);
      }
    };

    // Set initial state based on current preference and theme
    const updateTheme = () => {
      let darkMode = false;
      
      if (theme === 'dark') {
        darkMode = true;
      } else if (theme === 'light') {
        darkMode = false;
      } else if (theme === 'system') {
        darkMode = mediaQuery.matches;
      }
      
      setIsDarkMode(darkMode);
      
      // Update document class for CSS selectors
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme); // Save user preference
    
    // Update immediately based on new theme
    if (newTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else if (newTheme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemPrefersDark);
      if (systemPrefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Initialize theme from localStorage or system preference
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}