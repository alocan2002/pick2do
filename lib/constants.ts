import { Task, Preferences } from "@/types";

export const INITIAL_TASKS: Task[] = [];

export const KNOWN_SUBJECTS: string[] = [];
export const TIME_STEPS = [15, 30, 45, 60, 75, 90];

export const DEFAULT_PREFS: Preferences = {
  rules: [{ days: 0, score: 10 }, { days: 1, score: 6 }, { days: 2, score: 3 }, { days: 3, score: 2 }, { days: 4, score: 1 }],
  fallback: 0, focusMatch: 3, focusMismatch: -2, timeDoesntFit: -4,
  smallTaskBonus: 2, smallTaskThreshold: 15, maxTaskDuration: 90,
};
