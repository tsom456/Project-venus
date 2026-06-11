import { useMemo, useState } from "react";
import { C, F, btnStyle, inputStyle } from "../theme.js";
import { STATUSES, STATUS_COLOR_KEYS } from "../data/reference.js";
import { fitCheck, scoreTarget } from "../lib/scoring.js";
import { toCsv, downloadCsv } from "../lib/csv.js";
import { SpecLabel, SectionHead, Card, FitBadge, GradeChip } from "../components/ui.jsx";

const blankTarget = { name: "", subsector: "", location: "", revenue: "", ebitda: "", multiple: "", status: "Identified", notes: "" };

const EXPORT_COLUMNS = [
  { label: "Company", value: (t) => t.name },
  { label: "Subsector", value: (t) => t.subsector },
  { label: "Location", value: (t) => t.location },
  { label: "Revenue ($M)", value: (t) => t.revenue },
  { label: "EBITDA ($M)", value: (t) => t.ebitda },
  { label: "Est. Multiple (x)", value: (t) => t.multiple },
  {
    label: "Implied EV ($M)",
    value: (t) => {
      const e = parseFloat(t.ebitda), m = parseFloat(t.multiple);
      return !isNaN(e) && !isNaN(m) ? (e * m).toFixed(1) : "";
    },
  },
  { label: "Status", value: (t) => t.status },
  { label: "Mandate Fit", value: (t) => fitCheck(t).label },
  { label: "Score", value: (t) => { const r = scoreTarget(t); return r.scored ? r.score : ""; } },
  { label: "Grade", value: (t) => { const r = scoreTarget(t); return r.scored ? r.grade : ""; } },
  { label: "Red Flags", value: (t) => scoreTarget(t).flags.join("; ") },
  { label: "Notes", value: (t) => t.notes },
];

export default function PipelineTab({ targets, setTargets, persist, addons }) {
  const [draft, setDraft] = useState(blankTarget);
  const [msg, setMsg] = useState("");
  const [filters, setFilters] = useState({ q: "", subsector: "", location: "", status: "All", fitOnly: false });

  const visible = useMemo(() => {
    return targets.filter((t) => {
      if (filters.status !== "All" && t.status !== filters.status) return false;
      if (filters.subsector && !(t.subsector || "").toLowerCase().includes(filters.subsector.toLowerCase())) return false;
      if (filters.location && !(t.location || "").toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.q && !(t.name || "").toLowerCase().includes(filters.q.toLowerCase())) return false;
      if (filters.fitOnly && fitCheck(t).state === "miss") return false;
      return true;
    });
  }, [targets, filters]);

  const set = (k) => (e) => setDraft({ ...draft, [k]: e.target.value });

  const addTarget = async () => {
    if (!draft.name.trim()) {
      setMsg("Company name is required");
      return;
    }
    const next = [...targets, { ...draft, id: Date.now() }];
    setTargets(next);
    setDraft(blankTarget);
    const ok = await persist(next);
    setMsg(ok ? "Target added and saved" : "Added (saved in session only)");
    setTimeout(() => setMsg(""), 2500);
  };

  const updateTarget = async (id, key, val) => {
    const next = targets.map((t) => (t.id === id ? { ...t, [key]: val } : t));
    setTargets(next);
    await persist(next);
  };

  const removeTarget = async (id) => {
    const next = targets.filter((t) => t.id !== id);
    setTargets(next);
    await persist(next);
  };

  const exportCsv = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`pipeline-${stamp}.csv`, toCsv(visible, EXPORT_COLUMNS));
  };

  const totals = useMemo(() => {
    let ev = 0, ebitda = 0;
    targets.forEach((t) => {
      const e = parseFloat(t.ebitda), m = parseFloat(t.multiple);
      if (!isNaN(e)) ebitda += e;
      if (!isNaN(e) && !isNaN(m)) ev += e * m;
    });
    return { ev, ebitda, active: targets.filter((t) => t.status !== "Passed" && t.status !== "Closed").length };
  }, [targets]);

  const addonCount = (id) => addons.filter((a) => a.platformId === id).length;

  return (
    <div>
      <SectionHead no="07" title="Platform Target Pipeline" sub="Persists across sessions" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
        <Card><SpecLabel>Active targets</SpecLabel><div style={pipeStat}>{totals.active}</div></Card>
        <Card><SpecLabel>Pipeline EBITDA</SpecLabel><div style={pipeStat}>${totals.ebitda.toFixed(1)}M</div></Card>
        <Card><SpecLabel>Implied pipeline EV</SpecLabel><div style={pipeStat}>${totals.ev.toFixed(1)}M</div></Card>
      </div>

      <Card style={{ marginBottom: 14, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <SpecLabel color={C.orange}>Filter</SpecLabel>
        <input style={inputStyle(170)} placeholder="Company name" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <input style={inputStyle(170)} placeholder="Subsector" value={filters.subsector} onChange={(e) => setFilters({ ...filters, subsector: e.target.value })} />
        <input style={inputStyle(170)} placeholder="Geography (state, region)" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
        <select style={inputStyle(140)} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option>All</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button
          onClick={() => setFilters({ ...filters, fitOnly: !filters.fitOnly })}
          style={btnStyle(filters.fitOnly)}
        >
          {filters.fitOnly ? "In-mandate only ✓" : "In-mandate only"}
        </button>
        <SpecLabel>{visible.length} / {targets.length} shown</SpecLabel>
        <button onClick={exportCsv} style={btnStyle(false)} disabled={visible.length === 0}>
          Export CSV ({visible.length})
        </button>
      </Card>

      <Card style={{ marginBottom: 20 }}>
        <SpecLabel color={C.orange}>Add target</SpecLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginTop: 10 }}>
          <input style={inputStyle()} placeholder="Company name *" value={draft.name} onChange={set("name")} />
          <input style={inputStyle()} placeholder="Subsector" value={draft.subsector} onChange={set("subsector")} />
          <input style={inputStyle()} placeholder="Location" value={draft.location} onChange={set("location")} />
          <input style={inputStyle()} placeholder="Revenue ($M)" value={draft.revenue} onChange={set("revenue")} />
          <input style={inputStyle()} placeholder="EBITDA ($M)" value={draft.ebitda} onChange={set("ebitda")} />
          <input style={inputStyle()} placeholder="Est. multiple (x)" value={draft.multiple} onChange={set("multiple")} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
          <input style={{ ...inputStyle(), flex: 1, minWidth: 220 }} placeholder="Notes (owner situation, banker, angle...)" value={draft.notes} onChange={set("notes")} />
          <select style={inputStyle(150)} value={draft.status} onChange={set("status")}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button onClick={addTarget} style={btnStyle(true)}>Add to pipeline</button>
        </div>
        {msg && <div style={{ marginTop: 8 }}><SpecLabel color={C.green}>{msg}</SpecLabel></div>}
      </Card>

      {targets.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 32 }}>
          <SpecLabel>No targets yet — add your first platform candidate above</SpecLabel>
        </Card>
      ) : visible.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 32 }}>
          <SpecLabel>No targets match the current filters — clear a filter to see the full pipeline</SpecLabel>
        </Card>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {visible.map((t) => {
            const e = parseFloat(t.ebitda), m = parseFloat(t.multiple);
            const ev = !isNaN(e) && !isNaN(m) ? (e * m).toFixed(1) : null;
            const nAddons = addonCount(t.id);
            return (
              <Card key={t.id} style={{ borderLeft: `4px solid ${C[STATUS_COLOR_KEYS[t.status]] || C.steel}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <div style={{ fontFamily: F.display, fontSize: 19, fontWeight: 600, color: C.ink, textTransform: "uppercase" }}>{t.name}</div>
                      <FitBadge fit={fitCheck(t)} />
                      <GradeChip result={scoreTarget(t)} />
                      {nAddons > 0 && <SpecLabel color={C.orange}>{nAddons} add-on{nAddons > 1 ? "s" : ""}</SpecLabel>}
                    </div>
                    <div style={{ fontSize: 12.5, color: C.steel }}>
                      {[t.subsector, t.location].filter(Boolean).join(" · ") || "—"}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ fontFamily: F.mono, fontSize: 12.5, color: C.ink }}>
                      {t.revenue && <span>REV ${t.revenue}M&nbsp;&nbsp;</span>}
                      {t.ebitda && <span>EBITDA ${t.ebitda}M&nbsp;&nbsp;</span>}
                      {ev && <span style={{ color: C.orange }}>EV ~${ev}M @ {m}x</span>}
                    </div>
                    <select
                      value={t.status}
                      onChange={(ev2) => updateTarget(t.id, "status", ev2.target.value)}
                      style={{ ...inputStyle(130), fontFamily: F.mono, fontSize: 11.5 }}
                    >
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <button onClick={() => removeTarget(t.id)} style={btnStyle(false)}>Remove</button>
                  </div>
                </div>
                {t.notes && <div style={{ fontSize: 13, color: "#3B4452", marginTop: 8, borderTop: `1px dashed ${C.line}`, paddingTop: 8 }}>{t.notes}</div>}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

const pipeStat = { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 30, fontWeight: 600, color: "#18222E", marginTop: 4 };
