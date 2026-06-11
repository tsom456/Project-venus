import { useMemo, useState } from "react";
import { C, F, btnStyle, inputStyle } from "../theme.js";
import { SpecLabel, SectionHead, Card } from "../components/ui.jsx";

const blankAddon = { name: "", ebitda: "", multiple: "", notes: "" };

function num(v) {
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

/* Blended entry math for one platform + its add-ons. Only rows with
   both EBITDA and multiple contribute to the blend. */
export function blendFor(platform, addons) {
  const rows = [];
  const pe = num(platform.ebitda), pm = num(platform.multiple);
  if (pe !== null && pm !== null) rows.push({ ebitda: pe, multiple: pm });
  addons.forEach((a) => {
    const e = num(a.ebitda), m = num(a.multiple);
    if (e !== null && m !== null) rows.push({ ebitda: e, multiple: m });
  });
  if (rows.length === 0) return null;
  const totalEbitda = rows.reduce((s, r) => s + r.ebitda, 0);
  const totalEv = rows.reduce((s, r) => s + r.ebitda * r.multiple, 0);
  if (totalEbitda === 0) return null;
  return {
    totalEbitda,
    totalEv,
    blended: totalEv / totalEbitda,
    platformMultiple: pm,
  };
}

export default function AddOnsTab({ targets, addons, setAddons, persist }) {
  const platforms = targets.filter((t) => t.status !== "Passed");
  const [platformId, setPlatformId] = useState(platforms[0]?.id ?? null);
  const [draft, setDraft] = useState(blankAddon);
  const [msg, setMsg] = useState("");

  const platform = platforms.find((p) => p.id === platformId) || platforms[0] || null;
  const mine = useMemo(
    () => addons.filter((a) => platform && a.platformId === platform.id),
    [addons, platform]
  );
  const blend = platform ? blendFor(platform, mine) : null;

  const set = (k) => (e) => setDraft({ ...draft, [k]: e.target.value });

  const addAddon = async () => {
    if (!platform) return;
    if (!draft.name.trim()) {
      setMsg("Add-on name is required");
      return;
    }
    const next = [...addons, { ...draft, id: Date.now(), platformId: platform.id }];
    setAddons(next);
    setDraft(blankAddon);
    const ok = await persist(next);
    setMsg(ok ? "Add-on saved" : "Added (saved in session only)");
    setTimeout(() => setMsg(""), 2500);
  };

  const removeAddon = async (id) => {
    const next = addons.filter((a) => a.id !== id);
    setAddons(next);
    await persist(next);
  };

  if (platforms.length === 0) {
    return (
      <div>
        <SectionHead no="08" title="Add-On Tracker" sub="Buy-and-build arbitrage per platform" />
        <Card style={{ textAlign: "center", padding: 32 }}>
          <SpecLabel>No active platforms — add platform candidates in the Pipeline tab first</SpecLabel>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <SectionHead no="08" title="Add-On Tracker" sub="Buy-and-build arbitrage per platform" />

      <Card style={{ marginBottom: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <SpecLabel color={C.orange}>Platform</SpecLabel>
        <select
          style={inputStyle(280)}
          value={platform?.id ?? ""}
          onChange={(e) => setPlatformId(Number(e.target.value))}
        >
          {platforms.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {platform && (
          <SpecLabel>
            {platform.ebitda ? `EBITDA $${platform.ebitda}M` : "EBITDA TBD"}
            {platform.multiple ? ` · entry ${platform.multiple}x` : " · multiple TBD"}
          </SpecLabel>
        )}
      </Card>

      {blend && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginBottom: 16 }}>
          <Card>
            <SpecLabel>Combined EBITDA</SpecLabel>
            <div style={statNum}>${blend.totalEbitda.toFixed(1)}M</div>
          </Card>
          <Card>
            <SpecLabel>Combined EV</SpecLabel>
            <div style={statNum}>${blend.totalEv.toFixed(1)}M</div>
          </Card>
          <Card>
            <SpecLabel>Blended entry multiple</SpecLabel>
            <div style={statNum}>{blend.blended.toFixed(2)}x</div>
          </Card>
          <Card>
            <SpecLabel>Arbitrage vs platform entry</SpecLabel>
            <div style={{ ...statNum, color: blend.platformMultiple !== null && blend.platformMultiple - blend.blended > 0 ? C.green : C.ink }}>
              {blend.platformMultiple !== null ? `${(blend.platformMultiple - blend.blended).toFixed(2)}x` : "—"}
            </div>
            <div style={{ fontSize: 11.5, color: C.steel }}>turns below platform multiple</div>
          </Card>
        </div>
      )}

      <Card style={{ marginBottom: 16 }}>
        <SpecLabel color={C.orange}>Add add-on candidate</SpecLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginTop: 10 }}>
          <input style={inputStyle()} placeholder="Company name *" value={draft.name} onChange={set("name")} />
          <input style={inputStyle()} placeholder="EBITDA ($M)" value={draft.ebitda} onChange={set("ebitda")} />
          <input style={inputStyle()} placeholder="Est. multiple (x)" value={draft.multiple} onChange={set("multiple")} />
          <input style={inputStyle()} placeholder="Notes (angle, banker, geography...)" value={draft.notes} onChange={set("notes")} />
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 10, alignItems: "center" }}>
          <button onClick={addAddon} style={btnStyle(true)}>Attach to platform</button>
          {msg && <SpecLabel color={C.green}>{msg}</SpecLabel>}
        </div>
      </Card>

      {mine.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 28 }}>
          <SpecLabel>No add-ons attached to this platform yet</SpecLabel>
        </Card>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {mine.map((a) => {
            const e = num(a.ebitda), m = num(a.multiple);
            const ev = e !== null && m !== null ? (e * m).toFixed(1) : null;
            return (
              <Card key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontFamily: F.display, fontSize: 17, fontWeight: 600, color: C.ink, textTransform: "uppercase" }}>{a.name}</div>
                  {a.notes && <div style={{ fontSize: 12.5, color: C.steel }}>{a.notes}</div>}
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ fontFamily: F.mono, fontSize: 12.5, color: C.ink }}>
                    {a.ebitda && <span>EBITDA ${a.ebitda}M&nbsp;&nbsp;</span>}
                    {ev && <span style={{ color: C.orange }}>EV ~${ev}M @ {m}x</span>}
                  </div>
                  <button onClick={() => removeAddon(a.id)} style={btnStyle(false)}>Remove</button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <p style={{ fontSize: 12, color: C.steel, marginTop: 12, lineHeight: 1.5 }}>
        With flat multiples through 2026, buy-and-build arbitrage is the return driver: every add-on acquired below the
        platform's entry multiple pulls the blended basis down. A platform bought at 7x with add-ons at 4–5x can exit the
        combined entity 1.5–2.5 turns below a strategic's bid for the same EBITDA.
      </p>
    </div>
  );
}

const statNum = { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 30, fontWeight: 600, color: "#18222E", marginTop: 4 };
