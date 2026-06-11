/* Renders every tab server-side with sample data and sanity-checks the
   scoring and blended-multiple math. Run: npm run smoke */
import { renderToString } from "react-dom/server";
import React from "react";
import OverviewTab from "../src/tabs/OverviewTab.jsx";
import MultiplesTab from "../src/tabs/MultiplesTab.jsx";
import CompsTab from "../src/tabs/CompsTab.jsx";
import ValuationTab from "../src/tabs/ValuationTab.jsx";
import PipelineTab from "../src/tabs/PipelineTab.jsx";
import ScoringTab from "../src/tabs/ScoringTab.jsx";
import AddOnsTab, { blendFor } from "../src/tabs/AddOnsTab.jsx";
import PlaybookTab from "../src/tabs/PlaybookTab.jsx";
import { scoreTarget, fitCheck } from "../src/lib/scoring.js";
import { toCsv } from "../src/lib/csv.js";

const target = {
  id: 1,
  name: "Acme Precision Machining",
  subsector: "Precision machining",
  location: "Ohio",
  revenue: "22",
  ebitda: "4.2",
  multiple: "5.5",
  status: "Outreach",
  notes: "Founder retiring, no banker",
  scorecard: {
    certs: "certified",
    aftermarketPct: "30",
    topCustomerPct: "40",
    management: "founderOnly",
    endMarket: "mixed",
    specIn: "partial",
  },
};
const addons = [{ id: 2, platformId: 1, name: "Bolt-On Gear Co", ebitda: "1.5", multiple: "4", notes: "" }];

function assert(cond, msg) {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
}

/* Math checks */
const r = scoreTarget(target);
// certs 1*15 + aftermarket .75*20 + concentration .25*20 + mgmt 0*15 + end .5*15 + spec .5*15 = 50/100
assert(r.scored && r.score === 50, `score expected 50, got ${r.score}`);
assert(r.grade === "C", `grade expected C, got ${r.grade}`);
assert(r.flags.length === 2, `expected 2 red flags, got ${r.flags.length}`);
assert(fitCheck(target).state === "fit", "target should be in mandate");

const blend = blendFor(target, addons);
// (4.2*5.5 + 1.5*4) / (4.2+1.5) = 29.1/5.7
assert(Math.abs(blend.blended - 29.1 / 5.7) < 1e-9, `blended multiple wrong: ${blend.blended}`);

const csv = toCsv([target], [{ label: "Company", value: (t) => t.name }, { label: "Notes", value: (t) => t.notes }]);
assert(csv.includes("Acme Precision Machining"), "csv missing target");

/* Render checks — every tab must produce markup without throwing */
const noop = () => {};
const tabs = {
  Overview: <OverviewTab />,
  Multiples: <MultiplesTab />,
  Comps: <CompsTab comps={{ PH: "15.2" }} setComps={noop} saveState={{ save: noop, msg: "" }} />,
  Valuation: <ValuationTab />,
  Pipeline: <PipelineTab targets={[target]} setTargets={noop} persist={async () => true} addons={addons} />,
  Scoring: <ScoringTab targets={[target]} updateTarget={noop} />,
  AddOns: <AddOnsTab targets={[target]} addons={addons} setAddons={noop} persist={async () => true} />,
  Playbook: <PlaybookTab />,
};
for (const [name, el] of Object.entries(tabs)) {
  const html = renderToString(el);
  assert(html.length > 200, `${name} rendered suspiciously little markup`);
}
const scoringHtml = renderToString(tabs.Scoring).replace(/<!--.*?-->/g, "");
assert(scoringHtml.includes("C · 50"), "scoring grade chip missing from markup");
assert(renderToString(tabs.AddOns).includes("Blended entry multiple"), "blend stats missing from markup");

console.log("smoke OK — all tabs render, scoring/blend/csv math checks pass");
