import { useState } from "react";
import { C, F } from "../theme.js";
import { scoreTarget } from "../lib/scoring.js";
import { SpecLabel, SectionHead, Card, GradeChip } from "../components/ui.jsx";
import ScorecardEditor from "../components/ScorecardEditor.jsx";

export default function ScoringTab({ targets, updateTarget }) {
  const [openId, setOpenId] = useState(null);

  const ranked = [...targets].sort((a, b) => {
    const ra = scoreTarget(a), rb = scoreTarget(b);
    if (ra.scored && rb.scored) return rb.score - ra.score;
    if (ra.scored) return -1;
    if (rb.scored) return 1;
    return 0;
  });

  return (
    <div>
      <SectionHead no="07" title="Deal Scoring" sub="Weighted screen from the playbook criteria · ranked" />
      {targets.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 32 }}>
          <SpecLabel>No targets to score — add platform candidates in the Pipeline tab first</SpecLabel>
        </Card>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {ranked.map((t, idx) => {
            const result = scoreTarget(t);
            const open = openId === t.id;
            return (
              <Card key={t.id} style={{ borderLeft: `4px solid ${result.scored ? (result.score >= 75 ? C.green : result.score >= 55 ? C.amber : C.orange) : C.steel}` }}>
                <div
                  onClick={() => setOpenId(open ? null : t.id)}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, cursor: "pointer" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: F.mono, fontSize: 12, color: C.steel, width: 28 }}>{result.scored ? `#${idx + 1}` : "—"}</span>
                    <div style={{ fontFamily: F.display, fontSize: 19, fontWeight: 600, color: C.ink, textTransform: "uppercase" }}>{t.name}</div>
                    <GradeChip result={result} />
                    {result.scored && result.coverage < 100 && (
                      <SpecLabel>partial · {result.coverage}/100 weights assessed</SpecLabel>
                    )}
                  </div>
                  <SpecLabel color={C.orange}>{open ? "Close ▲" : "Score ▼"}</SpecLabel>
                </div>

                {result.flags.length > 0 && (
                  <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {result.flags.map((f) => (
                      <span key={f} style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: "0.06em", color: C.red, border: `1px solid ${C.red}`, padding: "2px 6px", textTransform: "uppercase" }}>
                        ⚑ {f}
                      </span>
                    ))}
                  </div>
                )}

                {open && (
                  <div style={{ marginTop: 14, borderTop: `1px dashed ${C.line}`, paddingTop: 14 }}>
                    <ScorecardEditor
                      value={t.scorecard}
                      onChange={(sc) => updateTarget(t.id, "scorecard", sc)}
                    />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
      <p style={{ fontSize: 12, color: C.steel, marginTop: 12, lineHeight: 1.5 }}>
        Scores reweight over the criteria you've assessed, so a partially screened target isn't penalized for unknowns — but
        treat partial scores as provisional. Red flags mirror the playbook screen (concentration &gt;25%, founder-only bench,
        commodity exposure) and surface regardless of total score.
      </p>
    </div>
  );
}
