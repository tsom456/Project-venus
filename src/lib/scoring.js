import { FIRM } from "../data/reference.js";

/* ---------------- Mandate fit ---------------- */

export function fitCheck(t) {
  const e = parseFloat(t.ebitda);
  const r = parseFloat(t.revenue);
  const issues = [];
  if (!isNaN(e)) {
    if (e < FIRM.ebitdaMin) issues.push("EBITDA below mandate");
    if (e > FIRM.ebitdaMax) issues.push("EBITDA above mandate");
  }
  if (!isNaN(r) && r > FIRM.revMax) issues.push("Revenue above mandate");
  if (isNaN(e) && isNaN(r)) return { state: "unknown", label: "FIT: TBD" };
  return issues.length === 0
    ? { state: "fit", label: "IN MANDATE" }
    : { state: "miss", label: issues.join(" · ").toUpperCase() };
}

/* ---------------- Deal scorecard ----------------
   Weighted quality model built from the playbook screening criteria.
   Each criterion scores 0–1; weights sum to 100. Targets carry a
   `scorecard` object: { certs, aftermarketPct, topCustomerPct,
   management, endMarket, specIn }. Unset criteria are excluded and
   the score is reweighted over what's filled in. */

export const SCORE_CRITERIA = [
  {
    key: "certs",
    label: "Certifications",
    weight: 15,
    kind: "select",
    options: [
      { value: "none", label: "None", score: 0 },
      { value: "inProgress", label: "ISO 9001 / in progress", score: 0.5 },
      { value: "certified", label: "AS9100 / ISO 13485 / NADCAP", score: 1 },
    ],
    hint: "Certification barriers keep commodity competitors out of the bid set.",
  },
  {
    key: "aftermarketPct",
    label: "Aftermarket / recurring mix",
    weight: 20,
    kind: "percent",
    score: (pct) => clamp(pct / 40, 0, 1),
    hint: ">20% is the quality marker; 40%+ scores full credit.",
  },
  {
    key: "topCustomerPct",
    label: "Top-customer concentration",
    weight: 20,
    kind: "percent",
    score: (pct) => clamp((50 - pct) / 40, 0, 1),
    redFlag: (pct) => (pct > 25 ? "Top customer >25% of revenue" : null),
    hint: "<25% top customer is the screen; >50% scores zero.",
  },
  {
    key: "management",
    label: "Management depth",
    weight: 15,
    kind: "select",
    options: [
      { value: "founderOnly", label: "Founder only", score: 0 },
      { value: "partialBench", label: "Partial bench", score: 0.5 },
      { value: "fullTeam", label: "Full team below owner", score: 1 },
    ],
    redFlag: (v) => (v === "founderOnly" ? "No management bench below the founder" : null),
    hint: "Key-person risk is the most common LMM discount after concentration.",
  },
  {
    key: "endMarket",
    label: "End-market quality",
    weight: 15,
    kind: "select",
    options: [
      { value: "commodity", label: "Commodity / cyclical", score: 0 },
      { value: "mixed", label: "Mixed", score: 0.5 },
      { value: "durable", label: "Defense / medical / infra / electrification", score: 1 },
    ],
    redFlag: (v) => (v === "commodity" ? "Commodity pass-through exposure" : null),
    hint: "Durable demand with policy tailwinds tops the band.",
  },
  {
    key: "specIn",
    label: "Spec-in / sole-source position",
    weight: 15,
    kind: "select",
    options: [
      { value: "no", label: "Competitive bid work", score: 0 },
      { value: "partial", label: "Some spec-in positions", score: 0.5 },
      { value: "soleSource", label: "Sole-source / engineered-in", score: 1 },
    ],
    hint: "Engineered-in positions are the moat buyers underwrite.",
  },
];

function clamp(x, lo, hi) {
  return Math.min(hi, Math.max(lo, x));
}

function criterionScore(crit, raw) {
  if (raw === undefined || raw === null || raw === "") return null;
  if (crit.kind === "percent") {
    const pct = parseFloat(raw);
    return isNaN(pct) ? null : crit.score(pct);
  }
  const opt = crit.options.find((o) => o.value === raw);
  return opt ? opt.score : null;
}

export function scoreTarget(target) {
  const sc = target.scorecard || {};
  let weighted = 0;
  let weightUsed = 0;
  const flags = [];
  SCORE_CRITERIA.forEach((crit) => {
    const raw = sc[crit.key];
    const s = criterionScore(crit, raw);
    if (s === null) return;
    weighted += s * crit.weight;
    weightUsed += crit.weight;
    if (crit.redFlag) {
      const f = crit.redFlag(crit.kind === "percent" ? parseFloat(raw) : raw);
      if (f) flags.push(f);
    }
  });
  if (weightUsed === 0) return { scored: false, score: null, grade: null, flags, coverage: 0 };
  const score = Math.round((weighted / weightUsed) * 100);
  return { scored: true, score, grade: gradeOf(score), flags, coverage: weightUsed };
}

export function gradeOf(score) {
  if (score >= 75) return "A";
  if (score >= 55) return "B";
  if (score >= 35) return "C";
  return "D";
}

/* Quality position 0–1 within a subsector band, from the same criteria.
   Used by the valuation calculator: multiple = lo + q * (hi - lo). */
export function qualityPosition(scorecard) {
  const r = scoreTarget({ scorecard });
  return r.scored ? r.score / 100 : null;
}
