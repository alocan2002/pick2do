import React, { useState, useEffect } from "react";
import { Task, Preferences } from "@/types";
import { tk } from "@/lib/utils";

export function SplitTaskScreen({ source, onBack, onSubmitAll, prefs }: { source: Omit<Task, "id" | "done">; onBack: () => void; onSubmitAll: (parts: Omit<Task, "id" | "done">[], sequential: boolean) => void; prefs: Preferences; }) {
  const t = tk(false);
  const [err, setErr] = useState("");
  const [seq, setSeq] = useState(true);
  const [parts, setParts] = useState<{ name: string, duration: number }[]>(() => {
    if (source.duration <= 1) {
      return [{ name: `${source.name}: Part 1`, duration: source.duration }];
    }
    const p = [];
    const chunks = Math.max(2, Math.ceil(source.duration / prefs.maxTaskDuration));
    const baseDur = Math.floor(source.duration / chunks);
    let rem = source.duration;
    for (let i = 1; i <= chunks; i++) {
      const take = i === chunks ? rem : baseDur;
      p.push({ name: `${source.name}: Part ${i}`, duration: take });
      rem -= take;
    }
    return p;
  });

  const inp: React.CSSProperties = { padding: "6px 8px", fontSize: 13, border: `1px solid ${t.bd}`, borderRadius: 4, outline: "none", background: t.bg, color: t.fg, boxSizing: "border-box" };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const sum = parts.reduce((acc, p) => acc + p.duration, 0);
    if (sum !== source.duration) {
      setErr(`Total must be exactly ${source.duration}m (currently ${sum}m)`);
      return;
    }
    if (parts.some(p => p.duration > prefs.maxTaskDuration)) {
      setErr(`No part can exceed ${prefs.maxTaskDuration}m`);
      return;
    }
    onSubmitAll(parts.map(p => ({ ...source, name: p.name, duration: p.duration })), seq);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onBack(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onBack]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Split task" style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseDown={onBack}>
      <div style={{ background: t.bg, color: t.fg, width: "100%", maxWidth: 360, margin: "0 16px", borderRadius: 6, border: `1px solid ${t.bd}`, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column" }} onMouseDown={e => e.stopPropagation()}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: `1px solid ${t.bd}`, background: "#fafafa" }}>
          <span style={{ fontWeight: 600, fontSize: 13 }}>Split task</span>
          <button onClick={onBack} title="Close [Esc]" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: t.mu, lineHeight: 1, padding: 0 }}>×</button>
        </header>
        <form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16, overflowY: "auto" }}>
          <div style={{ fontSize: 11, color: t.mu, marginBottom: 4 }}>Task <strong style={{ color: t.fg }}>{source.name}</strong> ({source.duration}m) will be split into:</div>
          {err && <div style={{ fontSize: 12, color: "#c00", padding: "4px 8px", background: "rgba(204,0,0,0.1)", borderRadius: 4 }}>{err}</div>}
          {parts.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 8 }}>
              <input value={p.name} onChange={e => setParts(prev => { const n = [...prev]; n[i].name = e.target.value; return n; })} style={{ ...inp, flex: 1 }} />
              <input type="number" value={p.duration} onChange={e => setParts(prev => { const n = [...prev]; n[i].duration = Number(e.target.value); return n; })} style={{ ...inp, width: 60 }} />
              {parts.length > 1 && <button type="button" onClick={() => setParts(prev => prev.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: t.mu, padding: "0 4px" }}>×</button>}
            </div>
          ))}
          <button type="button" onClick={() => setParts(prev => {
            const sum = prev.reduce((a, p) => a + p.duration, 0);
            const rem = Math.max(0, source.duration - sum);
            const dur = rem > 0 ? Math.min(rem, prefs.maxTaskDuration) : 10;
            return [...prev, { name: `${source.name}: Part ${prev.length + 1}`, duration: dur }];
          })} style={{ alignSelf: "flex-start", background: "none", border: `1px dashed ${t.bd}`, borderRadius: 4, padding: "4px 8px", fontSize: 11, cursor: "pointer", color: t.mu }}>+ Add part</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <input type="checkbox" id="seq" checked={seq} onChange={e => setSeq(e.target.checked)} />
            <label htmlFor="seq" style={{ fontSize: 12, color: t.fg, cursor: "pointer" }}>Sequential parts (hide next until previous is done)</label>
          </div>
          <button type="submit" style={{ marginTop: 4, width: "100%", padding: "8px 0", fontSize: 13, fontWeight: 600, background: "#000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Confirm Split</button>
        </form>
      </div>
    </div>
  );
}
