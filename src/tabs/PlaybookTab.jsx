import { C, F } from "../theme.js";
import { PLAYBOOK } from "../data/reference.js";
import { SpecLabel, SectionHead, Card } from "../components/ui.jsx";

export default function PlaybookTab() {
  return (
    <div>
      <SectionHead no="10" title="Sourcing Playbook" sub="Data, channels, screening" />
      <div style={{ display: "grid", gap: 16 }}>
        {PLAYBOOK.map((sec) => (
          <Card key={sec.head}>
            <div style={{ fontFamily: F.display, fontSize: 19, fontWeight: 600, color: C.ink, textTransform: "uppercase", marginBottom: 10, borderBottom: `1px solid ${C.line}`, paddingBottom: 6 }}>
              {sec.head}
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {sec.items.map(([k, v]) => (
                <div key={k} style={{ display: "grid", gridTemplateColumns: "210px 1fr", gap: 12 }}>
                  <SpecLabel color={C.orange}>{k}</SpecLabel>
                  <div style={{ fontSize: 13.5, color: "#3B4452", lineHeight: 1.5 }}>{v}</div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
