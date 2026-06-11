import { C, F } from "../theme.js";
import { MARKET_STATS, TRENDS } from "../data/reference.js";
import { SpecLabel, SectionHead, Card, DirMark } from "../components/ui.jsx";

export default function OverviewTab() {
  return (
    <div>
      <SectionHead no="01" title="Market Overview" sub="As of mid-2026 · indicative" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12, marginBottom: 28 }}>
        {MARKET_STATS.map((s) => (
          <Card key={s.label}>
            <SpecLabel>{s.label}</SpecLabel>
            <div style={{ fontFamily: F.display, fontSize: 34, fontWeight: 600, color: C.ink, margin: "4px 0 2px" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: C.steel, lineHeight: 1.4 }}>{s.note}</div>
          </Card>
        ))}
      </div>

      <SectionHead no="02" title="Trends in the Space" sub="What's moving LMM industrials" />
      <div style={{ display: "grid", gap: 10 }}>
        {TRENDS.map((t) => (
          <Card key={t.title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <DirMark dir={t.dir} />
            <div>
              <div style={{ fontFamily: F.display, fontSize: 18, fontWeight: 600, color: C.ink, textTransform: "uppercase", letterSpacing: "0.02em" }}>
                {t.title}
              </div>
              <div style={{ fontSize: 13.5, color: "#3B4452", lineHeight: 1.55, marginTop: 4 }}>{t.body}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
