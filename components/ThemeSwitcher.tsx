"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Switch } from "@headlessui/react";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEnabled(theme === "dark");
  }, [theme]);

  const toggleTheme = (value: boolean) => {
    setEnabled(value);
    setTheme(value ? "dark" : "light");
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={enabled}
        onChange={toggleTheme}
        className={`${
          enabled ? "bg-indigo-600" : "bg-gray-300"
        } relative inline-flex h-8 w-16 items-center rounded-full transition`}
      >
        <span
          className={`${
            enabled ? "translate-x-9" : "translate-x-1"
          } inline-block h-6 w-6 transform rounded-full bg-white transition`}
        />
      </Switch>
      {enabled ? <Moon size={20} /> : <Sun size={20} />}
    </div>
  );
}
