export const MARKET_STATS = [
  { label: "PE-SPONSORED MM AVG", value: "7.2–7.5x", note: "EV/EBITDA, GF Data, stable since mid-2024" },
  { label: "ALL MM M&A AVG (2025)", value: "9.8x", note: "Capstone Partners index, up from 9.4x in 2024" },
  { label: "MFG LMM TYPICAL BAND", value: "5–7x", note: "$1–25M EBITDA deals, band not point" },
  { label: "OFF-MARKET DISCOUNT", value: "15–30%", note: "Proprietary deals vs. run auctions (Bain)" },
];

export const TRENDS = [
  {
    title: "Reshoring & regionalization",
    dir: "up",
    body: "Tariff uncertainty and supply-chain risk keep pushing buyers toward North American manufacturing platforms. Domestic capacity, especially with certifications or embedded OEM relationships, is drawing premium interest.",
  },
  {
    title: "Automation as a labor hedge",
    dir: "up",
    body: "Persistent skilled-labor scarcity makes automation, robotics integration, and controls businesses structurally attractive. Buyers are acquiring certainty through automation rather than betting on hiring.",
  },
  {
    title: "Defense & aerospace supply chain roll-ups",
    dir: "up",
    body: "Sponsors are consolidating fragmented precision suppliers tied to defense procurement growth — machining, castings, and specialty components with AS9100/ITAR positioning.",
  },
  {
    title: "Aftermarket & recurring revenue premium",
    dir: "up",
    body: "Service-oriented, asset-light industrial models (maintenance, inspection, testing, parts) carry the strongest valuations. Recurring revenue can shift a multiple 1–2 turns inside its band.",
  },
  {
    title: "Capability over scale",
    dir: "flat",
    body: "2026 deal flow is selective, not slow. Buyers prioritize certification barriers, proprietary engineering, and mission-critical integration; commodity exposure faces tougher scrutiny and lower bids.",
  },
  {
    title: "Multiple expansion is over",
    dir: "down",
    body: "Consensus (Bain, GF Data, Lincoln) is flat multiples through 2026. Returns now depend on EBITDA growth (~10–12%/yr needed) and buy-and-build arbitrage, not entry-to-exit rerating.",
  },
  {
    title: "Founder retirement wave",
    dir: "up",
    body: "Aging owners of $2–15M EBITDA shops are the core LMM supply story. Proprietary outreach to founder-led businesses remains the highest-alpha sourcing channel.",
  },
];

export const SUBSECTORS = [
  { name: "Aerospace & defense components", lo: 7.0, hi: 10.0, note: "AS9100 / ITAR certified shops at top of band" },
  { name: "Test, measurement & instrumentation", lo: 7.5, hi: 10.0, note: "IP and calibration recurring revenue drive premium" },
  { name: "Industrial automation & controls", lo: 7.0, hi: 10.0, note: "Integrators lower, proprietary product higher" },
  { name: "Flow control / pumps & valves", lo: 7.0, hi: 9.0, note: "Aftermarket parts mix is the key value lever" },
  { name: "Specialty chemicals & coatings", lo: 6.5, hi: 9.0, note: "Formulation IP and spec-in positions" },
  { name: "Electrical equipment / electrification", lo: 6.5, hi: 9.0, note: "Grid, data center, and EV-adjacent demand" },
  { name: "Industrial services (MRO, testing, inspection)", lo: 6.0, hi: 8.5, note: "Recurring contracts; route density matters" },
  { name: "Packaging (rigid & flexible)", lo: 6.0, hi: 8.0, note: "Food/medical end markets at top of band" },
  { name: "Building products", lo: 5.5, hi: 7.5, note: "Repair & remodel exposure beats new construction" },
  { name: "Plastics / injection molding", lo: 5.0, hi: 7.0, note: "Medical and tooling capability lift multiples" },
  { name: "Industrial distribution", lo: 5.0, hi: 7.0, note: "Value-add services separate from pure pass-through" },
  { name: "Precision machining & metal fabrication", lo: 4.5, hi: 6.5, note: "Customer concentration is the usual discount" },
];

export const PUBLIC_COMPS = [
  { t: "PH", name: "Parker Hannifin", seg: "Motion & flow control" },
  { t: "ITW", name: "Illinois Tool Works", seg: "Diversified industrial" },
  { t: "DOV", name: "Dover Corp", seg: "Diversified / pumps, ID" },
  { t: "EMR", name: "Emerson Electric", seg: "Automation & controls" },
  { t: "IEX", name: "IDEX Corp", seg: "Fluidics & specialty flow" },
  { t: "LECO", name: "Lincoln Electric", seg: "Welding & cutting" },
  { t: "RBC", name: "RBC Bearings", seg: "Precision bearings / A&D" },
  { t: "HEI", name: "HEICO", seg: "Aerospace aftermarket parts" },
  { t: "TDY", name: "Teledyne", seg: "Instrumentation & imaging" },
  { t: "AIT", name: "Applied Industrial Tech", seg: "Industrial distribution" },
  { t: "FAST", name: "Fastenal", seg: "Industrial distribution" },
  { t: "WTS", name: "Watts Water", seg: "Flow control / plumbing" },
  { t: "CR", name: "Crane Co", seg: "Engineered industrials" },
  { t: "NPO", name: "Enpro Inc", seg: "Sealing & advanced surfaces" },
  { t: "MLI", name: "Mueller Industries", seg: "Metals / building products" },
  { t: "GTLS", name: "Chart Industries", seg: "Cryogenic / energy equipment" },
  { t: "ROK", name: "Rockwell Automation", seg: "Automation & software" },
  { t: "GGG", name: "Graco", seg: "Fluid handling systems" },
];

export const STATUSES = ["Identified", "Outreach", "NDA Signed", "IOI / LOI", "Diligence", "Closed", "Passed"];

export const STATUS_COLOR_KEYS = {
  Identified: "steel",
  Outreach: "amber",
  "NDA Signed": "ink",
  "IOI / LOI": "orange",
  Diligence: "orange",
  Closed: "green",
  Passed: "red",
};

/* Firm mandate: $0.5–10M EBITDA, revenue up to $250M */
export const FIRM = { ebitdaMin: 0.5, ebitdaMax: 10, revMax: 250 };

export const PLAYBOOK = [
  {
    head: "Primary data sources",
    items: [
      ["GF Data (ACG)", "The LMM benchmark — quarterly EV/EBITDA by size tier ($10–250M TEV) and industry. Worth the subscription for any industrials platform thesis."],
      ["Capstone Partners MM Valuations Index", "Free annual purchase-multiple data across 12 industries; good for board materials."],
      ["PitchBook / Grata / Sourcescrub", "Company discovery and private-company intelligence; Grata and Sourcescrub are built for proprietary LMM sourcing."],
      ["ITR Economics", "Industrial cycle forecasting — useful for timing theses in machinery and capex-driven subsectors."],
      ["IBISWorld / Census ASM", "Fragmentation and shop-count data to size roll-up opportunities by NAICS code."],
    ],
  },
  {
    head: "Sourcing channels",
    items: [
      ["Boutique industrial banks", "Generational Equity, Brentwood Growth, Mertz Taggart-style regional shops, plus industrial specialists (e.g., Brown Gibbons Lang, KAL Capital for A&D)."],
      ["Trade associations", "PMA (metalforming), NTMA (tooling & machining), AMT, MAPP (plastics processors), FPA (flexible packaging) — member directories map the LMM universe directly."],
      ["ThomasNet / supplier databases", "Still the densest registry of US manufacturers; filter by capability, certification, and employee count for outreach lists."],
      ["Buy-side advisors & searchers", "Sutton Place data shows broad auctions price 18–25% above bilateral deals — proprietary founder outreach is where LMM alpha lives."],
      ["Trade shows", "IMTS (Chicago), FABTECH, Automate, PACK EXPO — founder-dense, and a single circuit covers most target subsectors."],
    ],
  },
  {
    head: "Platform screening criteria (typical LMM industrials)",
    items: [
      ["Size", "$3–15M EBITDA platform entry, with visible add-on pipeline at 4–6x to arbitrage against platform entry multiple."],
      ["Quality markers", "Certifications (AS9100, ISO 13485, NADCAP), spec-in or sole-source positions, aftermarket mix >20%, customer concentration <25% top customer."],
      ["End markets", "Defense, aerospace, medical, infrastructure, electrification — durable demand with policy tailwinds."],
      ["Red flags", "Single-customer dependence, commodity pass-through pricing, deferred capex, no management bench below the founder."],
    ],
  },
];
