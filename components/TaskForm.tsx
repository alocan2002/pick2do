import React, { useState, useRef, useEffect } from "react";
import { Task, Preferences } from "@/types";
import { tk, ddmmToDate } from "@/lib/utils";
import { SubjectAutocomplete } from "./SubjectAutocomplete";

export function TaskForm({ initial, onBack, onSubmit, onSplit, submitLabel, prefs, allSubjects }: {
  initial: Partial<Task>; onBack: () => void; onSubmit: (d: Omit<Task, "id" | "done">) => void; onSplit: (d: Omit<Task, "id" | "done">) => void; submitLabel: string; prefs: Preferences; allSubjects: string[];
}) {
  const t = tk(false);
  const [subject, setSubject] = useState(initial.subject ?? "");
  const [name, setName] = useState(initial.name ?? "");
  const [day, setDay] = useState(() => initial.deadline ? initial.deadline.split("-")[0] : "");
  const [month, setMonth] = useState(() => initial.deadline ? initial.deadline.split("-")[1] : "");
  const [duration, setDuration] = useState(initial.duration?.toString() ?? "");
  const [cognitive, setCognitive] = useState<"shallow" | "deep" | null>(initial.cognitive ?? null);
  const [err, setErr] = useState("");

  const focusRef = useRef<HTMLInputElement>(null);
  useEffect(() => { focusRef.current?.focus(); }, []);

  const inp: React.CSSProperties = { width: "100%", padding: "6px 8px", fontSize: 13, border: `1px solid ${t.bd}`, borderRadius: 4, outline: "none", background: t.bg, color: t.fg, boxSizing: "border-box" };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) { setErr("Subject required"); return; }
    if (!name) { setErr("Name required"); return; }
    let dl = "";
    if (day || month) {
      if (!day || !month) { setErr("Enter both day and month for due date"); return; }
      dl = `${day.padStart(2, "0")}-${month.padStart(2, "0")}`;
      if (!ddmmToDate(dl)) { setErr("Invalid date"); return; }
    }
    if (!duration || Number(duration) < 1) { setErr("Duration required"); return; }
    if (!cognitive) { setErr("Focus required"); return; }
    onSubmit({ subject, name, deadline: dl, duration: Number(duration), cognitive, parentId: initial.parentId });
  };

  const handleSplit = () => {
    if (!subject) { setErr("Subject required"); return; }
    if (!name) { setErr("Name required"); return; }
    let dl = "";
    if (day || month) {
      if (!day || !month) { setErr("Enter both day and month for due date"); return; }
      dl = `${day.padStart(2, "0")}-${month.padStart(2, "0")}`;
      if (!ddmmToDate(dl)) { setErr("Invalid date"); return; }
    }
    if (!duration || Number(duration) < 1) { setErr("Duration required"); return; }
    if (!cognitive) { setErr("Focus required"); return; }
    onSplit({ subject, name, deadline: dl, duration: Number(duration), cognitive, parentId: initial.parentId });
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onBack(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onBack]);

  return (
    <div role="dialog" aria-modal="true" aria-label={submitLabel} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseDown={onBack}>
      <div style={{ background: t.bg, color: t.fg, width: "100%", maxWidth: 360, margin: "0 16px", borderRadius: 6, border: `1px solid ${t.bd}`, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", overflow: "hidden" }} onMouseDown={e => e.stopPropagation()}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: `1px solid ${t.bd}`, background: "#fafafa" }}>
          <span style={{ fontWeight: 600, fontSize: 13 }}>{submitLabel}</span>
          <button onClick={onBack} title="Close [Esc]" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: t.mu, lineHeight: 1, padding: 0 }}>×</button>
        </header>
        <form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16 }}>
          {err && <div style={{ fontSize: 12, color: "#c00", padding: "4px 8px", background: "rgba(204,0,0,0.1)", borderRadius: 4 }}>{err}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 500, color: t.mu, textTransform: "uppercase", letterSpacing: "0.05em" }}>Task Name</label>
            <input ref={focusRef} type="text" placeholder="What needs to be done?" value={name} onChange={e => setName(e.target.value)} style={inp} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 500, color: t.mu, textTransform: "uppercase", letterSpacing: "0.05em" }}>Subject</label>
              <SubjectAutocomplete value={subject} onChange={setSubject} allSubjects={allSubjects} />
            </div>
            <div style={{ width: 80, display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 500, color: t.mu, textTransform: "uppercase", letterSpacing: "0.05em" }}>Due (D/M)</label>
              <div style={{ display: "flex", gap: 4 }}>
                <input type="number" placeholder="DD" value={day} onChange={e => setDay(e.target.value)} style={{ ...inp, textAlign: "center", padding: "6px 2px" }} min={1} max={31} />
                <input type="number" placeholder="MM" value={month} onChange={e => setMonth(e.target.value)} style={{ ...inp, textAlign: "center", padding: "6px 2px" }} min={1} max={12} />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ width: 80, display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 500, color: t.mu, textTransform: "uppercase", letterSpacing: "0.05em" }}>Min</label>
              <input type="number" min={1} placeholder="30" value={duration} onChange={e => setDuration(e.target.value)} style={inp} />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 500, color: t.mu, textTransform: "uppercase", letterSpacing: "0.05em" }}>Focus</label>
              <div style={{ display: "flex", gap: 4 }}>
                <button type="button" onClick={() => setCognitive(c => c === "shallow" ? "deep" : "shallow")} style={{ flex: 1, padding: "6px", fontSize: 13, borderRadius: 4, background: cognitive === "shallow" ? "#000" : "transparent", color: cognitive === "shallow" ? "#fff" : t.fg, border: `1px solid ${cognitive === "shallow" ? "#000" : t.bd}`, cursor: "pointer", textAlign: "center", outline: "none" }}>Shallow</button>
                <button type="button" onClick={() => setCognitive(c => c === "deep" ? "shallow" : "deep")} style={{ flex: 1, padding: "6px", fontSize: 13, borderRadius: 4, background: cognitive === "deep" ? "#000" : "transparent", color: cognitive === "deep" ? "#fff" : t.fg, border: `1px solid ${cognitive === "deep" ? "#000" : t.bd}`, cursor: "pointer", textAlign: "center", outline: "none" }}>Deep</button>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button type="submit" style={{ flex: 2, padding: "8px 0", fontSize: 13, fontWeight: 600, background: "#000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>{submitLabel}</button>
            <button type="button" onClick={handleSplit} style={{ flex: 1, padding: "8px 0", fontSize: 13, fontWeight: 600, background: "none", color: "#000", border: `1px solid ${t.bd}`, borderRadius: 4, cursor: "pointer" }}>Split</button>
          </div>
        </form>
      </div>
    </div>
  );
}
