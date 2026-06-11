import { C, F } from "../theme.js";

export function SpecLabel({ children, color }) {
  return (
    <span
      style={{
        fontFamily: F.mono,
        fontSize: 10,
        letterSpacing: "0.12em",
        color: color || C.steel,
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

export function SectionHead({ no, title, sub }) {
  return (
    <div style={{ borderBottom: `2px solid ${C.ink}`, paddingBottom: 8, marginBottom: 18, display: "flex", alignItems: "baseline", gap: 14 }}>
      <span style={{ fontFamily: F.mono, fontSize: 11, color: C.orange, letterSpacing: "0.1em" }}>{no}</span>
      <h2 style={{ fontFamily: F.display, fontWeight: 600, fontSize: 26, margin: 0, color: C.ink, textTransform: "uppercase", letterSpacing: "0.02em" }}>
        {title}
      </h2>
      {sub && <SpecLabel>{sub}</SpecLabel>}
    </div>
  );
}

export function Card({ children, style }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, padding: 16, ...style }}>{children}</div>
  );
}

export function DirMark({ dir }) {
  const map = { up: ["▲", C.green], down: ["▼", C.red], flat: ["▶", C.steel] };
  const [g, col] = map[dir] || map.flat;
  return <span style={{ color: col, fontSize: 11, marginRight: 8 }}>{g}</span>;
}

/* Range bar on fixed 3x–11x machined scale */
export function RangeBar({ lo, hi, marker }) {
  const MIN = 3, MAX = 11;
  const left = ((lo - MIN) / (MAX - MIN)) * 100;
  const width = ((hi - lo) / (MAX - MIN)) * 100;
  const ticks = [3, 4, 5, 6, 7, 8, 9, 10, 11];
  return (
    <div style={{ position: "relative", height: 26, flex: 1, minWidth: 160 }}>
      <div style={{ position: "absolute", top: 12, left: 0, right: 0, height: 1, background: C.line }} />
      {ticks.map((t) => (
        <div key={t} style={{ position: "absolute", top: 9, left: `${((t - MIN) / (MAX - MIN)) * 100}%`, width: 1, height: 7, background: C.line }} />
      ))}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: `${left}%`,
          width: `${width}%`,
          height: 9,
          background: C.orange,
          opacity: 0.9,
        }}
      />
      {marker !== undefined && marker !== null && marker >= MIN && marker <= MAX && (
        <div
          style={{
            position: "absolute",
            top: 4,
            left: `${((marker - MIN) / (MAX - MIN)) * 100}%`,
            width: 2,
            height: 17,
            background: C.ink,
          }}
        />
      )}
    </div>
  );
}

export function FitBadge({ fit }) {
  const col = fit.state === "fit" ? C.green : fit.state === "miss" ? C.red : C.steel;
  return (
    <span style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: "0.08em", color: col, border: `1px solid ${col}`, padding: "2px 6px" }}>
      {fit.label}
    </span>
  );
}

export function GradeChip({ result }) {
  if (!result.scored) {
    return (
      <span style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: "0.08em", color: C.steel, border: `1px dashed ${C.steel}`, padding: "2px 6px" }}>
        NOT SCORED
      </span>
    );
  }
  const col = result.grade === "A" ? C.green : result.grade === "B" ? C.amber : result.grade === "C" ? C.orange : C.red;
  return (
    <span style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: "0.08em", color: "#fff", background: col, padding: "2px 8px" }}>
      {result.grade} · {result.score}
    </span>
  );
}
