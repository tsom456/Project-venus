import { useState, useEffect } from "react";
import { C, F } from "./theme.js";
import { loadKey, saveKey } from "./lib/storage.js";
import { SpecLabel } from "./components/ui.jsx";
import OverviewTab from "./tabs/OverviewTab.jsx";
import MultiplesTab from "./tabs/MultiplesTab.jsx";
import CompsTab from "./tabs/CompsTab.jsx";
import ValuationTab from "./tabs/ValuationTab.jsx";
import PipelineTab from "./tabs/PipelineTab.jsx";
import ScoringTab from "./tabs/ScoringTab.jsx";
import AddOnsTab from "./tabs/AddOnsTab.jsx";
import PlaybookTab from "./tabs/PlaybookTab.jsx";

const TABS = ["Overview", "Multiples", "Public Comps", "Valuation", "Pipeline", "Scoring", "Add-Ons", "Playbook"];

export default function SourcingHub() {
  const [tab, setTab] = useState("Overview");
  const [targets, setTargets] = useState([]);
  const [addons, setAddons] = useState([]);
  const [comps, setComps] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [compsMsg, setCompsMsg] = useState("");

  useEffect(() => {
    (async () => {
      const [t, a, c] = await Promise.all([
        loadKey("pipeline-targets", []),
        loadKey("pipeline-addons", []),
        loadKey("comps-multiples", {}),
      ]);
      setTargets(t);
      setAddons(a);
      setComps(c);
      setLoaded(true);
    })();
  }, []);

  const persistTargets = (next) => saveKey("pipeline-targets", next);
  const persistAddons = (next) => saveKey("pipeline-addons", next);
  const saveComps = async () => {
    const ok = await saveKey("comps-multiples", comps);
    setCompsMsg(ok ? "Saved" : "Could not save — session only");
    setTimeout(() => setCompsMsg(""), 2500);
  };

  /* Shared by Pipeline and Scoring tabs */
  const updateTarget = async (id, key, val) => {
    const next = targets.map((t) => (t.id === id ? { ...t, [key]: val } : t));
    setTargets(next);
    await persistTargets(next);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.paper, fontFamily: F.body, color: C.ink }}>
      {/* Title block — engineering drawing header */}
      <div style={{ background: C.ink, color: "#E8EBEE", borderBottom: `4px solid ${C.orange}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "22px 20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <SpecLabel color="#9AA5B1">DWG NO. IND-LMM-26 · REV B</SpecLabel>
            <SpecLabel color="#9AA5B1">MANDATE: $0.5–10M EBITDA · REV ≤ $250M · US/CANADA</SpecLabel>
          </div>
          <h1 style={{ fontFamily: F.display, fontWeight: 600, fontSize: 44, textTransform: "uppercase", letterSpacing: "0.02em", margin: "8px 0 2px", lineHeight: 1 }}>
            Industrials Sourcing Hub
          </h1>
          <div style={{ fontFamily: F.mono, fontSize: 12, color: C.orange, letterSpacing: "0.1em", marginBottom: 16 }}>
            PLATFORM ACQUISITION INTELLIGENCE · LOWER MIDDLE MARKET · MFG &amp; INDUSTRIALS
          </div>
          <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  fontFamily: F.mono,
                  fontSize: 11.5,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "10px 18px",
                  background: tab === t ? C.paper : "transparent",
                  color: tab === t ? C.ink : "#9AA5B1",
                  border: "none",
                  borderTop: tab === t ? `2px solid ${C.orange}` : "2px solid transparent",
                  cursor: "pointer",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 60px" }}>
        {!loaded ? (
          <SpecLabel>Loading saved data…</SpecLabel>
        ) : (
          <>
            {tab === "Overview" && <OverviewTab />}
            {tab === "Multiples" && <MultiplesTab />}
            {tab === "Public Comps" && (
              <CompsTab comps={comps} setComps={setComps} saveState={{ save: saveComps, msg: compsMsg }} />
            )}
            {tab === "Valuation" && <ValuationTab />}
            {tab === "Pipeline" && (
              <PipelineTab targets={targets} setTargets={setTargets} persist={persistTargets} addons={addons} />
            )}
            {tab === "Scoring" && <ScoringTab targets={targets} updateTarget={updateTarget} />}
            {tab === "Add-Ons" && (
              <AddOnsTab targets={targets} addons={addons} setAddons={setAddons} persist={persistAddons} />
            )}
            {tab === "Playbook" && <PlaybookTab />}
          </>
        )}
        <div style={{ marginTop: 40, borderTop: `1px solid ${C.line}`, paddingTop: 10, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <SpecLabel>Indicative reference data — not investment advice. Verify multiples before use.</SpecLabel>
          <SpecLabel>Sources: GF Data · Capstone Partners · PwC · Bain · IMAP</SpecLabel>
        </div>
      </div>
    </div>
  );
}
