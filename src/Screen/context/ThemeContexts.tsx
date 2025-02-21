import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance } from "react-native";

interface ThemeContextProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// 💡 Verificamos si el contexto está bien definido
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(Appearance.getColorScheme() === "dark");

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === "dark");
    });

    return () => subscription.remove();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ✅ Verificamos que el contexto no sea `undefined` antes de usarlo
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de ThemeProvider");
  }
  return context;
};
