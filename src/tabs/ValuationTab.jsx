import { useState } from "react";
import { C, F, inputStyle } from "../theme.js";
import { SUBSECTORS } from "../data/reference.js";
import { qualityPosition } from "../lib/scoring.js";
import { SpecLabel, SectionHead, Card, RangeBar } from "../components/ui.jsx";
import ScorecardEditor from "../components/ScorecardEditor.jsx";

export default function ValuationTab() {
  const [subsectorName, setSubsectorName] = useState(SUBSECTORS[0].name);
  const [ebitda, setEbitda] = useState("");
  const [scorecard, setScorecard] = useState({});

  const sub = SUBSECTORS.find((s) => s.name === subsectorName) || SUBSECTORS[0];
  const q = qualityPosition(scorecard);
  const impliedMultiple = q !== null ? sub.lo + q * (sub.hi - sub.lo) : null;
  const e = parseFloat(ebitda);
  const hasEbitda = !isNaN(e) && e > 0;

  return (
    <div>
      <SectionHead no="05" title="Valuation Calculator" sub="Quality factors position you inside the subsector band" />

      <Card style={{ marginBottom: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <SpecLabel color={C.orange}>Inputs</SpecLabel>
        <select style={inputStyle(320)} value={subsectorName} onChange={(e2) => setSubsectorName(e2.target.value)}>
          {SUBSECTORS.map((s) => (
            <option key={s.name} value={s.name}>{s.name}</option>
          ))}
        </select>
        <input
          style={inputStyle(160)}
          type="number"
          min="0"
          placeholder="Adj. EBITDA ($M)"
          value={ebitda}
          onChange={(e2) => setEbitda(e2.target.value)}
        />
        <SpecLabel>Band {sub.lo.toFixed(1)}–{sub.hi.toFixed(1)}x · {sub.note}</SpecLabel>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <SpecLabel color={C.orange}>Quality assessment</SpecLabel>
        <div style={{ marginTop: 10 }}>
          <ScorecardEditor value={scorecard} onChange={setScorecard} />
        </div>
      </Card>

      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ width: 260, minWidth: 200 }}>
            <SpecLabel>Implied position in band</SpecLabel>
            <div style={{ fontFamily: F.display, fontSize: 38, fontWeight: 600, color: impliedMultiple !== null ? C.ink : C.steel, marginTop: 2 }}>
              {impliedMultiple !== null ? `${impliedMultiple.toFixed(2)}x` : "—"}
            </div>
            {q !== null && (
              <div style={{ fontSize: 12, color: C.steel }}>quality percentile {(q * 100).toFixed(0)} of band</div>
            )}
          </div>
          <RangeBar lo={sub.lo} hi={sub.hi} marker={impliedMultiple} />
          <div style={{ minWidth: 200 }}>
            <SpecLabel>Implied EV</SpecLabel>
            <div style={{ fontFamily: F.mono, fontSize: 15, color: C.ink, marginTop: 4 }}>
              {hasEbitda && impliedMultiple !== null ? (
                <>
                  <span style={{ color: C.orange, fontWeight: 600 }}>${(e * impliedMultiple).toFixed(1)}M</span>
                  <span style={{ color: C.steel }}> point</span>
                </>
              ) : (
                <span style={{ color: C.steel }}>enter EBITDA + assess quality</span>
              )}
            </div>
            {hasEbitda && (
              <div style={{ fontFamily: F.mono, fontSize: 12.5, color: C.steel, marginTop: 4 }}>
                band: ${(e * sub.lo).toFixed(1)}M – ${(e * sub.hi).toFixed(1)}M
              </div>
            )}
          </div>
        </div>
      </Card>

      <p style={{ fontSize: 12, color: C.steel, marginTop: 12, lineHeight: 1.5 }}>
        The calculator maps the weighted quality score linearly across the subsector band — the same model as the Scoring tab,
        so an A-grade target prices near the top of its band and a D-grade near the bottom. Exceptional assets (sole-source IP,
        40%+ aftermarket) can clear the band entirely; this is a sanity check for IOI framing, not a fairness opinion.
      </p>
    </div>
  );
}
