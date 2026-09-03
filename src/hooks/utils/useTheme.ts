import { useEffect, useState } from "react";
import localStorageKeys from "@constants/localStorageKeys.ts";
import { constants } from "@constants/constants.ts";

type Theme = "light" | "dark";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>((): Theme => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(localStorageKeys.theme) as Theme;
      if (stored) return stored;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    return constants.defaultTheme as Theme;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem(localStorageKeys.theme, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
};
