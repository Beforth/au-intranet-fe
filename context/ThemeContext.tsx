
import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeColor = 'blue' | 'sky' | 'indigo' | 'emerald' | 'rose' | 'violet';
export type Density = 'compact' | 'default' | 'relaxed';

interface Theme {
  name: string;
  primary: string;
  muted: string;
  foreground: string;
}

export const THEMES: Record<ThemeColor, Theme> = {
  blue: { name: 'Royal Blue', primary: '#2563eb', muted: '#f1f5f9', foreground: '#ffffff' },
  sky: { name: 'Sky Blue', primary: '#0ea5e9', muted: '#f0f9ff', foreground: '#ffffff' },
  indigo: { name: 'Indigo', primary: '#4f46e5', muted: '#f5f3ff', foreground: '#ffffff' },
  emerald: { name: 'Emerald', primary: '#10b981', muted: '#f0fdf4', foreground: '#ffffff' },
  rose: { name: 'Rose', primary: '#f43f5e', muted: '#fff1f2', foreground: '#ffffff' },
  violet: { name: 'Violet', primary: '#8b5cf6', muted: '#f5f3ff', foreground: '#ffffff' },
};

interface ThemeContextType {
  color: ThemeColor;
  setColor: (color: ThemeColor) => void;
  density: Density;
  setDensity: (d: Density) => void;
  activeTheme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [color, setColor] = useState<ThemeColor>(() => (localStorage.getItem('ui-color') as ThemeColor) || 'blue');
  const [density, setDensity] = useState<Density>(() => (localStorage.getItem('ui-density') as Density) || 'default');

  useEffect(() => {
    const root = document.documentElement;
    const theme = THEMES[color];
    
    // Theme Colors
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--primary-muted', theme.muted);
    root.style.setProperty('--primary-foreground', theme.foreground);
    
    // Density Spacing - Slimmer values
    const paddingMap = { compact: '0.625rem', default: '1rem', relaxed: '1.5rem' };
    root.style.setProperty('--ui-padding', paddingMap[density]);

    // Force remove dark class if it existed
    root.classList.remove('dark');

    // Persist
    localStorage.setItem('ui-color', color);
    localStorage.setItem('ui-density', density);
  }, [color, density]);

  return (
    <ThemeContext.Provider value={{ color, setColor, density, setDensity, activeTheme: THEMES[color] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
