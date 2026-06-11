import { C, F } from "../theme.js";
import { SUBSECTORS } from "../data/reference.js";
import { SpecLabel, SectionHead, Card, RangeBar } from "../components/ui.jsx";

export default function MultiplesTab() {
  return (
    <div>
      <SectionHead no="04" title="EV/EBITDA by Subsector" sub="LMM private deals · $2–25M EBITDA · indicative bands" />
      <Card style={{ padding: 0 }}>
        <div style={{ display: "flex", padding: "10px 16px", borderBottom: `1px solid ${C.line}`, gap: 12 }}>
          <SpecLabel>Subsector</SpecLabel>
          <div style={{ flex: 1, textAlign: "center" }}>
            <SpecLabel>3x ——— scale ——— 11x</SpecLabel>
          </div>
          <SpecLabel>Range</SpecLabel>
        </div>
        {SUBSECTORS.map((s, i) => (
          <div
            key={s.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 16px",
              borderBottom: i < SUBSECTORS.length - 1 ? `1px solid ${C.line}` : "none",
              flexWrap: "wrap",
            }}
          >
            <div style={{ width: 260, minWidth: 200 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{s.name}</div>
              <div style={{ fontSize: 11.5, color: C.steel }}>{s.note}</div>
            </div>
            <RangeBar lo={s.lo} hi={s.hi} />
            <div style={{ fontFamily: F.mono, fontSize: 13, color: C.ink, width: 86, textAlign: "right" }}>
              {s.lo.toFixed(1)}–{s.hi.toFixed(1)}x
            </div>
          </div>
        ))}
      </Card>
      <p style={{ fontSize: 12, color: C.steel, marginTop: 12, lineHeight: 1.5 }}>
        Bands are indicative ranges synthesized from GF Data, Capstone Partners, and advisor-published LMM benchmarks. Position
        within a band is driven by size, growth, recurring revenue mix, customer concentration, management depth, and end-market
        quality — quality factors can move an effective multiple 1–3 turns in either direction. Verify against recent comps before
        quoting in an IOI.
      </p>
    </div>
  );
}
