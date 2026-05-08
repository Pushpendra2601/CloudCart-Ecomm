import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = window.localStorage.getItem("cloudcart-theme");
    return stored === "light" || stored === "dark" ? stored : "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("cloudcart-theme", theme);
  }, [theme]);

  return {
    theme,
    toggleTheme: () => setTheme(current => current === "dark" ? "light" : "dark")
  };
}
