import { Task, Preferences, Cog } from "@/types";
import { useState, useEffect } from "react";

export function ddmmToDate(s: string): Date | null {
  const m = s.match(/^(\d{1,2})-(\d{1,2})$/);
  if (!m) return null;
  const d = parseInt(m[1]), mo = parseInt(m[2]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const now = new Date(); now.setHours(0, 0, 0, 0);
  let dt = new Date(now.getFullYear(), mo - 1, d); dt.setHours(0, 0, 0, 0);
  if (dt < now) dt = new Date(now.getFullYear() + 1, mo - 1, d);
  return dt;
}

export function daysUntil(s: string): number {
  const d = ddmmToDate(s); if (!d) return 999;
  const n = new Date(); n.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - n.getTime()) / 86400000);
}

export function scoreTask(task: Task, sessionMin: number, focus: Cog, p: Preferences): number {
  if (task.done) return -9999;
  let sc = 0;
  if (task.deadline) {
    const d = daysUntil(task.deadline);
    const r = p.rules.find(x => x.days === d);
    sc += r ? r.score : p.fallback;
  } else {
    sc += p.fallback;
  }
  if (focus) sc += task.cognitive === focus ? p.focusMatch : p.focusMismatch;
  if (task.duration > sessionMin) sc += p.timeDoesntFit;
  if (task.duration <= p.smallTaskThreshold) sc += p.smallTaskBonus;
  return sc;
}

export function useTheme(prefs: Preferences) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const mm = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mm.matches);
    const h = (e: MediaQueryListEvent) => setDark(e.matches);
    mm.addEventListener("change", h);
    return () => mm.removeEventListener("change", h);
  }, []);
  return false; // Theme forced to light mode right now
}

export function tk(dark: boolean) {
  return { bg: dark ? "#111" : "#fff", fg: dark ? "#eee" : "#000", bd: dark ? "#2a2a2a" : "#e5e5e5", mu: dark ? "#777" : "#999", sf: dark ? "#1c1c1c" : "#f9f9f9", sub: dark ? "#bbb" : "#555" };
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
