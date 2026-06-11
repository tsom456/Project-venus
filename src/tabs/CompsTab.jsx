import { C, F, btnStyle } from "../theme.js";
import { PUBLIC_COMPS } from "../data/reference.js";
import { SpecLabel, SectionHead, Card } from "../components/ui.jsx";

export default function CompsTab({ comps, setComps, saveState }) {
  const update = (ticker, val) => {
    setComps({ ...comps, [ticker]: val });
  };
  return (
    <div>
      <SectionHead no="04" title="Public Comps Watchlist" sub="Trading multiples move daily — enter current figures" />
      <Card style={{ padding: 0, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${C.ink}`, textAlign: "left" }}>
              <th style={{ padding: "10px 14px" }}><SpecLabel>Ticker</SpecLabel></th>
              <th style={{ padding: "10px 14px" }}><SpecLabel>Company</SpecLabel></th>
              <th style={{ padding: "10px 14px" }}><SpecLabel>Segment</SpecLabel></th>
              <th style={{ padding: "10px 14px", textAlign: "right" }}><SpecLabel>EV/EBITDA (your input)</SpecLabel></th>
            </tr>
          </thead>
          <tbody>
            {PUBLIC_COMPS.map((c, i) => (
              <tr key={c.t} style={{ borderBottom: i < PUBLIC_COMPS.length - 1 ? `1px solid ${C.line}` : "none" }}>
                <td style={{ padding: "8px 14px", fontFamily: F.mono, color: C.orange, fontSize: 12.5 }}>{c.t}</td>
                <td style={{ padding: "8px 14px", fontWeight: 600, color: C.ink }}>{c.name}</td>
                <td style={{ padding: "8px 14px", color: C.steel }}>{c.seg}</td>
                <td style={{ padding: "8px 14px", textAlign: "right" }}>
                  <input
                    value={comps[c.t] || ""}
                    onChange={(e) => update(c.t, e.target.value)}
                    placeholder="—"
                    style={{
                      width: 70,
                      fontFamily: F.mono,
                      fontSize: 13,
                      textAlign: "right",
                      border: `1px solid ${C.line}`,
                      padding: "4px 6px",
                      background: "#FAFBFC",
                      color: C.ink,
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
        <button onClick={saveState.save} style={btnStyle(true)}>Save multiples</button>
        {saveState.msg && <SpecLabel color={C.green}>{saveState.msg}</SpecLabel>}
      </div>
      <p style={{ fontSize: 12, color: C.steel, marginTop: 12, lineHeight: 1.5 }}>
        Use these large-cap and mid-cap names as the valuation ceiling for each subsector — private LMM targets typically transact
        at a meaningful discount to public peers due to scale, liquidity, and key-person risk. Pull current multiples from your
        terminal or data provider; entries persist across sessions.
      </p>
    </div>
  );
}
