export type Cog = "shallow" | "deep" | null;
export type Screen = "main" | "addTask" | "editTask" | "preferences" | "splitTask";
export type Theme = "light" | "dark" | "system";

export interface Task {
  id: number;
  name: string;
  subject: string;
  deadline: string;
  duration: number;
  cognitive: "shallow" | "deep";
  done: boolean;
  parentId?: number;
  dependsOn?: number;
}

export interface DRule {
  days: number;
  score: number;
}

export interface Preferences {
  rules: DRule[];
  fallback: number;
  focusMatch: number;
  focusMismatch: number;
  timeDoesntFit: number;
  smallTaskBonus: number;
  smallTaskThreshold: number;
  maxTaskDuration: number;
}
