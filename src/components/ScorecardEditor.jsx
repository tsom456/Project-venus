import { C, inputStyle } from "../theme.js";
import { SCORE_CRITERIA } from "../lib/scoring.js";
import { SpecLabel } from "./ui.jsx";

/* Edits a scorecard object { certs, aftermarketPct, topCustomerPct,
   management, endMarket, specIn }. Used by the Scoring tab (per target)
   and the Valuation tab (ad hoc). */
export default function ScorecardEditor({ value, onChange }) {
  const sc = value || {};
  const set = (key, v) => onChange({ ...sc, [key]: v });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
      {SCORE_CRITERIA.map((crit) => (
        <div key={crit.key}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <SpecLabel color={C.orange}>{crit.label}</SpecLabel>
            <SpecLabel>w{crit.weight}</SpecLabel>
          </div>
          <div style={{ marginTop: 4 }}>
            {crit.kind === "percent" ? (
              <input
                style={inputStyle()}
                type="number"
                min="0"
                max="100"
                placeholder="% of revenue"
                value={sc[crit.key] ?? ""}
                onChange={(e) => set(crit.key, e.target.value)}
              />
            ) : (
              <select style={inputStyle()} value={sc[crit.key] || ""} onChange={(e) => set(crit.key, e.target.value)}>
                <option value="">— not assessed —</option>
                {crit.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            )}
          </div>
          <div style={{ fontSize: 11, color: C.steel, marginTop: 3, lineHeight: 1.4 }}>{crit.hint}</div>
        </div>
      ))}
    </div>
  );
}
