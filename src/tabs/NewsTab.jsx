import { useEffect, useState } from "react";
import { C, F, btnStyle } from "../theme.js";
import { SpecLabel, SectionHead, Card } from "../components/ui.jsx";

const FEEDS = [
  { key: "ma", label: "Industrial M&A", q: 'industrial manufacturing acquisition "middle market"' },
  { key: "reshoring", label: "Reshoring", q: "reshoring manufacturing North America" },
  { key: "pe", label: "PE Industrials", q: "private equity industrials platform acquisition" },
  { key: "autom", label: "Automation", q: "industrial automation robotics manufacturing investment" },
];

const SOURCES = [
  ["Manufacturing Dive", "https://www.manufacturingdive.com/", "Daily manufacturing industry briefing"],
  ["IndustryWeek", "https://www.industryweek.com/", "Manufacturing operations and leadership news"],
  ["Modern Machine Shop", "https://www.mmsonline.com/", "Precision machining technology and shop news"],
  ["PE Hub", "https://www.pehub.com/", "Private equity deal coverage incl. LMM industrials"],
  ["Middle Market Growth (ACG)", "https://middlemarketgrowth.org/", "ACG's middle-market deal and trend coverage"],
  ["Axios Pro Rata", "https://www.axios.com/newsletters/axios-pro-rata", "Daily deals newsletter"],
  ["Capstone Partners research", "https://www.capstonepartners.com/insights/", "Free MM valuation and sector reports"],
  ["GF Data", "https://gfdata.com/", "LMM valuation benchmarks (subscription)"],
  ["ITR Economics blog", "https://www.itreconomics.com/blog", "Industrial cycle forecasting"],
];

function rssUrl(q) {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;
}

/* Google News RSS has no CORS headers, so route through a public
   CORS proxy. If the proxy is down, the tab degrades to source links. */
function proxied(url) {
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
}

async function fetchHeadlines(q) {
  const res = await fetch(proxied(rssUrl(q)), { signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  if (doc.querySelector("parsererror")) throw new Error("Bad RSS payload");
  return [...doc.querySelectorAll("item")].slice(0, 10).map((it) => ({
    title: it.querySelector("title")?.textContent ?? "",
    link: it.querySelector("link")?.textContent ?? "",
    date: it.querySelector("pubDate")?.textContent ?? "",
    source: it.querySelector("source")?.textContent ?? "",
  }));
}

export default function NewsTab() {
  const [feedKey, setFeedKey] = useState(FEEDS[0].key);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  const feed = FEEDS.find((f) => f.key === feedKey) || FEEDS[0];

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetchHeadlines(feed.q)
      .then((list) => {
        if (cancelled) return;
        setItems(list);
        setStatus(list.length > 0 ? "ok" : "error");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [feed.q]);

  return (
    <div>
      <SectionHead no="03" title="Live News & Info" sub="Headlines via Google News RSS · sources open in new tabs" />

      <Card style={{ marginBottom: 14, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <SpecLabel color={C.orange}>Feed</SpecLabel>
        {FEEDS.map((f) => (
          <button key={f.key} onClick={() => setFeedKey(f.key)} style={btnStyle(f.key === feedKey)}>
            {f.label}
          </button>
        ))}
      </Card>

      {status === "loading" && (
        <Card style={{ textAlign: "center", padding: 28, marginBottom: 20 }}>
          <SpecLabel>Loading live headlines…</SpecLabel>
        </Card>
      )}
      {status === "error" && (
        <Card style={{ textAlign: "center", padding: 28, marginBottom: 20 }}>
          <SpecLabel color={C.red}>
            Couldn't reach the live feed — your network or the proxy may be blocking it. Use the live sources below.
          </SpecLabel>
        </Card>
      )}
      {status === "ok" && (
        <Card style={{ padding: 0, marginBottom: 20 }}>
          {items.map((it, i) => (
            <a
              key={it.link || i}
              href={it.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                padding: "10px 16px",
                borderBottom: i < items.length - 1 ? `1px solid ${C.line}` : "none",
                textDecoration: "none",
              }}
            >
              <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, lineHeight: 1.4 }}>{it.title}</div>
              <div style={{ fontFamily: F.mono, fontSize: 11, color: C.steel, marginTop: 2 }}>
                {[it.source, it.date && new Date(it.date).toLocaleDateString()].filter(Boolean).join(" · ")}
              </div>
            </a>
          ))}
        </Card>
      )}

      <SectionHead no="03A" title="Live Sources" sub="Curated industry coverage" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        {SOURCES.map(([name, url, desc]) => (
          <a key={name} href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <Card>
              <div style={{ fontFamily: F.display, fontSize: 17, fontWeight: 600, color: C.ink, textTransform: "uppercase" }}>
                {name} <span style={{ color: C.orange }}>↗</span>
              </div>
              <div style={{ fontSize: 12.5, color: C.steel, marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
            </Card>
          </a>
        ))}
      </div>

      <p style={{ fontSize: 12, color: C.steel, marginTop: 12, lineHeight: 1.5 }}>
        Headlines are fetched client-side from Google News RSS through a public CORS proxy (api.allorigins.win) — no keys, no
        backend, but availability depends on the proxy. The curated sources are direct links and always reachable.
      </p>
    </div>
  );
}
