import React, { useState } from "react";
import { Preferences } from "@/types";
import { useTheme, tk } from "@/lib/utils";

export function PreferencesScreen({ prefs, onSave, onBack }: { prefs: Preferences; onSave: (p: Preferences) => void; onBack: () => void; }) {
  const dark = useTheme(prefs); const t = tk(dark);
  const [f, setF] = useState<Preferences>(prefs);
  const setNum = (k: keyof Preferences) => (e: React.ChangeEvent<HTMLInputElement>) => setF(p => ({ ...p, [k]: Number(e.target.value) }));
  const inp: React.CSSProperties = { width: 60, padding: "5px 8px", fontSize: 13, border: `1px solid ${t.bd}`, borderRadius: 4, textAlign: "right", outline: "none", background: t.bg, color: t.fg };
  const row = (label: string, key: keyof Preferences, note?: string) => (
    <div key={String(key)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${t.bd}` }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: t.fg }}>{label}</div>
        {note && <div style={{ fontSize: 11, color: t.mu, marginTop: 2 }}>{note}</div>}
      </div>
      <input type="number" value={f[key] as number} onChange={setNum(key)} style={inp} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.fg }}>
      <header style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 20px", borderBottom: `1px solid ${t.bd}` }}>
        <button onClick={onBack} title="Back [Esc]" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: t.mu, lineHeight: 1, padding: 0 }}>←</button>
        <h1 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Algorithm Settings</h1>
      </header>
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 11, fontWeight: 600, color: t.mu, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Task Limits</h2>
          <div style={{ background: t.sf, border: `1px solid ${t.bd}`, borderRadius: 8, padding: "0 16px" }}>
            {row("Max Task Duration (min)", "maxTaskDuration", "Tasks longer than this will force you to split them into parts.")}
          </div>
        </div>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 11, fontWeight: 600, color: t.mu, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Focus Matching</h2>
          <div style={{ background: t.sf, border: `1px solid ${t.bd}`, borderRadius: 8, padding: "0 16px" }}>
            {row("Focus Match Bonus", "focusMatch")}
            {row("Focus Mismatch Penalty", "focusMismatch")}
          </div>
        </div>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 11, fontWeight: 600, color: t.mu, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Time Constraints</h2>
          <div style={{ background: t.sf, border: `1px solid ${t.bd}`, borderRadius: 8, padding: "0 16px" }}>
            {row("Overtime Penalty", "timeDoesntFit", "Penalty if task duration exceeds session time")}
            {row("Small Task Bonus", "smallTaskBonus", "Bonus points for quick tasks")}
            {row("Small Task Threshold (min)", "smallTaskThreshold")}
          </div>
        </div>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 11, fontWeight: 600, color: t.mu, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Deadline Urgency</h2>
          <div style={{ background: t.sf, border: `1px solid ${t.bd}`, borderRadius: 8, padding: "0 16px" }}>
            {f.rules.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < f.rules.length - 1 ? `1px solid ${t.bd}` : "none" }}>
                <div style={{ flex: 1, fontSize: 12, color: t.fg }}>{r.days === 0 ? "Due today" : `Due in ${r.days} days`}</div>
                <input type="number" value={r.score} onChange={e => setF(p => { const nr = [...p.rules]; nr[i].score = Number(e.target.value); return { ...p, rules: nr }; })} style={inp} />
              </div>
            ))}
            {row("Fallback Score", "fallback", "For tasks further out or without deadlines")}
          </div>
        </div>
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: 16, background: t.bg, borderTop: `1px solid ${t.bd}`, display: "flex", justifyContent: "center" }}>
          <button onClick={() => { onSave(f); onBack(); }} style={{ width: "100%", maxWidth: 600, padding: "10px 0", fontSize: 13, fontWeight: 600, background: "#000", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer" }}>Save Preferences</button>
        </div>
      </main>
    </div>
  );
}
