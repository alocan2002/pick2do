import React, { useState, useRef, useId } from "react";

export function SubjectAutocomplete({ value, onChange, allSubjects }: { value: string; onChange: (v: string) => void; allSubjects: string[] }) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = value.trim() === ""
    ? []
    : allSubjects.filter(s => s.toLowerCase().startsWith(value.toLowerCase()));

  const isOpen = open && suggestions.length > 0;

  const pick = (s: string) => { onChange(s); setOpen(false); setActiveIdx(-1); inputRef.current?.focus(); };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" || e.key === " ") { if (activeIdx >= 0) { e.preventDefault(); pick(suggestions[activeIdx]); } }
    else if (e.key === "Tab") { if (activeIdx >= 0) pick(suggestions[activeIdx]); else if (suggestions.length > 0) pick(suggestions[0]); setOpen(false); }
    else if (e.key === "Escape") { setOpen(false); setActiveIdx(-1); }
  };

  const inpStyle: React.CSSProperties = { width: "100%", padding: "8px 10px", fontSize: 13, border: "1px solid #ddd", borderRadius: 5, outline: "none", background: "#fff", color: "#000", boxSizing: "border-box" };

  return (
    <div style={{ position: "relative" }}>
      <input ref={inputRef} id="input-subject" type="text" placeholder="e.g. Work" value={value} autoComplete="off"
        role="combobox" aria-autocomplete="list" aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-activedescendant={isOpen && activeIdx >= 0 ? `${listId}-${activeIdx}` : undefined}
        onChange={e => { onChange(e.target.value); setOpen(true); setActiveIdx(-1); }}
        onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 200)}
        onKeyDown={handleKeyDown} style={inpStyle} />
      {isOpen && (
        <ul id={listId} role="listbox" style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, padding: 4, background: "#fff", border: "1px solid #ddd", borderRadius: 5, listStyle: "none", zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", maxHeight: 200, overflowY: "auto" }}>
          {suggestions.map((s, i) => (
            <li key={s} id={`${listId}-${i}`} role="option" aria-selected={i === activeIdx}
              onClick={() => pick(s)} onMouseEnter={() => setActiveIdx(i)}
              style={{ padding: "8px 10px", fontSize: 13, cursor: "pointer", background: i === activeIdx ? "#f0f0f0" : "transparent", borderRadius: 3, color: "#000" }}>
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
