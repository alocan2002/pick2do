import React, { useState, useEffect, useRef, useCallback } from "react";
import { Cog } from "@/types";
import { TIME_STEPS } from "@/lib/constants";

export function OnboardingPopup({ onDone }: { onDone: (mins: number, cog: Cog) => void }) {
  const [step, setStep] = useState(0);
  const [ti, setTi] = useState(1);
  const [cog, setCog] = useState<Cog>(null);
  const mins = TIME_STEPS[ti];
  const isMax = ti === TIME_STEPS.length - 1;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { ref.current?.focus(); }, [step]);
  const onKey = useCallback((e: React.KeyboardEvent) => {
    if (step === 0) {
      if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); setTi(i => Math.min(i + 1, TIME_STEPS.length - 1)); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); setTi(i => Math.max(i - 1, 0)); }
      else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setStep(1); }
    } else {
      if (e.key === "ArrowLeft") { e.preventDefault(); setCog("shallow"); }
      else if (e.key === "ArrowRight") { e.preventDefault(); setCog("deep"); }
      else if (e.key === "Enter" || e.key === " ") {
        if (cog !== null) { e.preventDefault(); onDone(mins, cog); }
      }
    }
  }, [step, cog, onDone, mins]);

  const sBtn = (active: boolean): React.CSSProperties => ({
    background: active ? "#000" : "#f0f0f0", color: active ? "#fff" : "#ccc", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", cursor: active ? "pointer" : "not-allowed", transition: "all 0.2s"
  });

  return (
    <div role="dialog" aria-modal="true" aria-label="Session setup" style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div ref={ref} tabIndex={-1} onKeyDown={onKey} style={{ background: "#fff", color: "#000", width: "100%", maxWidth: 360, margin: "0 16px", padding: "32px 28px", borderRadius: 6, display: "flex", flexDirection: "column", gap: 20, border: "1px solid #ddd", outline: "none" }}>
        <div style={{ display: "flex", gap: 5 }}>
          {[0, 1].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: step === i ? "#000" : "#ddd", display: "inline-block" }} />)}
        </div>
        {step === 0 && <>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#000" }}>How much time do you have?</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 4 }}>
              <button aria-label="Decrease" onClick={() => setTi(i => Math.max(i - 1, 0))} style={sBtn(ti > 0)}>−</button>
              <p style={{ margin: 0, fontSize: 44, fontWeight: 700, lineHeight: 1, flex: 1, textAlign: "center", color: "#000" }} aria-live="polite">
                {isMax ? "90+" : mins}<span style={{ fontSize: 18, fontWeight: 400, color: "#999" }}> min</span>
              </p>
              <button aria-label="Increase" onClick={() => setTi(i => Math.min(i + 1, TIME_STEPS.length - 1))} style={sBtn(!isMax)}>+</button>
            </div>
          </div>
          <div style={{ height: 2, background: "#eee", borderRadius: 2 }}>
            <div style={{ height: 2, background: "#000", borderRadius: 2, width: `${(ti / (TIME_STEPS.length - 1)) * 100}%` }} />
          </div>
          <button onClick={() => setStep(1)} style={{ width: "100%", padding: "10px 0", fontSize: 13, fontWeight: 600, background: "#000", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            Next <span style={{ fontSize: 10, background: "rgba(255,255,255,0.25)", padding: "1px 5px", borderRadius: 3, color: "#fff" }}>Enter</span>
          </button>
        </>}
        {step === 1 && <>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#000" }}>What is your focus level?</h2>
            <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
              {(["shallow", "deep"] as const).map(c => (
                <button key={c} onClick={() => setCog(c)}
                  style={{ flex: 1, padding: "16px 10px", background: cog === c ? "#000" : "#f9f9f9", color: cog === c ? "#fff" : "#000", border: `2px solid ${cog === c ? "#000" : "#eee"}`, borderRadius: 6, cursor: "pointer", display: "flex", flexDirection: "column", gap: 4, alignItems: "center", transition: "all 0.2s" }}>
                  <span style={{ fontSize: 14, fontWeight: 600, textTransform: "capitalize" }}>{c} Work</span>
                  <span style={{ fontSize: 11, color: cog === c ? "#aaa" : "#777" }}>{c === "shallow" ? "Emails, admin" : "Coding, writing"}</span>
                </button>
              ))}
            </div>
          </div>
          <button disabled={cog === null} onClick={() => onDone(mins, cog!)} style={{ width: "100%", padding: "10px 0", fontSize: 13, fontWeight: 600, background: cog ? "#000" : "#f0f0f0", color: cog ? "#fff" : "#aaa", border: "none", borderRadius: 5, cursor: cog ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "background 0.2s" }}>
            Let's go <span style={{ fontSize: 10, background: cog ? "rgba(255,255,255,0.25)" : "transparent", padding: "1px 5px", borderRadius: 3, color: cog ? "#fff" : "transparent" }}>Enter</span>
          </button>
        </>}
      </div>
    </div>
  );
}
