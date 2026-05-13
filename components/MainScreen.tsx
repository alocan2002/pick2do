import React, { useState, useEffect } from "react";
import { Task, Cog, Preferences } from "@/types";
import { scoreTask, useTheme, tk } from "@/lib/utils";

export function MainScreen({ availableMinutes, cogState, onAddTask, onEditTask, onLogoClick, onOpenPrefs, onOpenSplit, tasks, onToggleDone, onDelete, prefs }: {
  availableMinutes: number; cogState: Cog; onAddTask: () => void; onEditTask: (t: Task) => void;
  onLogoClick: () => void; onOpenPrefs: () => void; onOpenSplit: (t: Task) => void;
  tasks: Task[]; onToggleDone: (id: number) => void; onDelete: (id: number) => void; prefs: Preferences;
}) {
  const dark = useTheme(prefs); const t = tk(dark);
  const [showAll, setShowAll] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const isMax = availableMinutes >= 90;

  const sorted = [...tasks].sort((a, b) => scoreTask(b, availableMinutes, cogState, prefs) - scoreTask(a, availableMinutes, cogState, prefs));
  const active = sorted.filter(x => {
    if (x.done) return false;
    if (x.dependsOn) {
      const dep = tasks.find(t => t.id === x.dependsOn);
      if (dep && !dep.done) return false;
    }
    return true;
  });
  const done = sorted.filter(x => x.done);
  const shown = showAll ? active : active.slice(0, 2);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "n" || e.key === "N") { e.preventDefault(); onAddTask(); }
      if (e.key === "s" || e.key === "S") { e.preventDefault(); onOpenPrefs(); }
      if (e.key === "r" || e.key === "R") { e.preventDefault(); onLogoClick(); }
      if (e.key === "a" || e.key === "A") { e.preventDefault(); setShowAll(v => !v); }
      if (e.key === "c" || e.key === "C") { e.preventDefault(); setShowDone(v => !v); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onAddTask, onOpenPrefs, onLogoClick]);

  const td = (extra?: React.CSSProperties): React.CSSProperties => ({ padding: "8px", borderBottom: `1px solid ${t.bd}`, verticalAlign: "middle", ...extra });
  
  const renderRow = (task: Task) => {
    const sc = scoreTask(task, availableMinutes, cogState, prefs);
    const over = task.duration > prefs.maxTaskDuration;
    return (
      <tr key={task.id} style={{ opacity: task.done ? 0.4 : 1 }}>
        <td style={td()}>
          <div style={{ fontSize: 11, color: t.sub, marginBottom: 2 }}>{task.subject}</div>
          <button className="task-row-name" onClick={() => onToggleDone(task.id)} style={{ background: "none", border: "none", padding: 0, margin: 0, fontSize: 13, fontWeight: 500, color: t.fg, textDecoration: task.done ? "line-through" : "none", textAlign: "left", display: "block", width: "100%", fontFamily: "inherit" }}>{task.name}</button>
          {over && !task.done && <div style={{ fontSize: 11, color: "#c00", marginTop: 2 }}>
            Exceeds {prefs.maxTaskDuration} min
          </div>}
        </td>
        <td style={td({ fontSize: 12, color: t.mu, textAlign: "center" })}>{task.deadline || "—"}</td>
        <td style={td({ fontSize: 12, color: t.mu, textAlign: "center" })}>{task.duration ? `${task.duration}m` : "—"}</td>
        <td style={td({ fontSize: 11, color: t.mu, textAlign: "center", textTransform: "capitalize" })}>{task.cognitive}</td>
        <td style={td({ fontSize: 11, textAlign: "center", color: task.done ? t.mu : over ? "#bbb" : sc > 0 ? "#060" : sc < 0 ? "#c00" : t.mu })}>
          {!task.done && !over ? (sc > 0 ? `+${sc}` : `${sc}`) : ""}
        </td>
        <td style={td({ whiteSpace: "nowrap" })}>
          <button onClick={() => onEditTask(task)} style={{ background: "none", border: `1px solid ${t.bd}`, borderRadius: 3, padding: "2px 7px", fontSize: 11, cursor: "pointer", color: t.fg }}>Edit</button>{" "}
          <button onClick={() => onOpenSplit(task)} style={{ background: "none", border: `1px solid ${t.bd}`, borderRadius: 3, padding: "2px 7px", fontSize: 11, cursor: "pointer", color: t.fg }}>Split</button>{" "}
          <button onClick={() => onDelete(task.id)} style={{ background: "none", border: `1px solid ${t.bd}`, borderRadius: 3, padding: "2px 7px", fontSize: 11, cursor: "pointer", color: t.mu }}>Del</button>
        </td>
      </tr>
    );
  };

  const thS: React.CSSProperties = { fontSize: 10, fontWeight: 600, color: t.mu, textTransform: "uppercase", letterSpacing: "0.06em", padding: "4px 8px", borderBottom: `1px solid ${t.bd}`, textAlign: "center" };
  
  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.fg }}>
      <style>{`.task-row-name { cursor: pointer; transition: opacity 0.1s; } .task-row-name:hover { text-decoration: line-through !important; opacity: 0.7; } .task-row-name:focus-visible { outline: 2px solid ${t.fg}; border-radius: 2px; }`}</style>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 20px", borderBottom: `1px solid ${t.bd}`, position: "relative" }}>
        <div style={{ position: "absolute", left: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setInfoOpen(v => !v)} aria-expanded={infoOpen} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: t.mu, padding: 0 }} title="Session info">
            {isMax ? "90+" : availableMinutes}m · {cogState}
          </button>
          {infoOpen && <button id="btn-prefs" onClick={onOpenPrefs} title="Settings [S]" style={{ background: "#000", color: "#fff", border: "none", borderRadius: 4, padding: "2px 8px", fontSize: 11, cursor: "pointer" }}>Settings</button>}
        </div>
        <button id="btn-logo" onClick={onLogoClick} title="New session [R]" style={{ fontWeight: 700, fontSize: 15, background: "none", border: "none", cursor: "pointer", padding: 0, color: t.fg }}>pick2do</button>
      </header>
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "16px 20px 80px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }} aria-label="Tasks">
          <thead><tr>
            <th style={{ ...thS, textAlign: "left" }}>Task</th>
            <th style={thS}>Due</th>
            <th style={thS}>Min</th>
            <th style={thS}>Focus</th>
            <th style={thS}>Priority</th>
            <th style={thS}></th>
          </tr></thead>
          <tbody>{shown.map(renderRow)}</tbody>
        </table>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          <button onClick={() => setShowAll(v => !v)} title="[A]" style={{ background: "none", border: `1px solid ${t.bd}`, borderRadius: 4, padding: "4px 10px", fontSize: 12, cursor: "pointer", color: t.mu }}>
            {showAll ? "Show less" : `Show all (${active.length})`}
          </button>
          <button onClick={() => setShowDone(v => !v)} title="[C]" style={{ background: "none", border: `1px solid ${t.bd}`, borderRadius: 4, padding: "4px 10px", fontSize: 12, cursor: "pointer", color: t.mu }}>
            {showDone ? "Hide done" : `Show done (${done.length})`}
          </button>
        </div>
        {showDone && done.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 16 }}>
            <tbody>{done.map(renderRow)}</tbody>
          </table>
        )}
      </main>
      <button id="btn-add-task" onClick={onAddTask} title="Add task [N]" style={{ position: "fixed", bottom: 20, right: 20, background: "#000", color: "#fff", border: "none", borderRadius: 5, padding: "10px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>+ Add task</button>
    </div>
  );
}
