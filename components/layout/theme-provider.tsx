"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((state) => state.theme);
  const fetchInitialData = useAppStore((state) => state.fetchInitialData);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return <>{children}</>;
}
