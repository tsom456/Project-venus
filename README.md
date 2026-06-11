# LMM Industrials Sourcing Hub

A reference and pipeline-tracking app for lower-middle-market industrials platform sourcing, styled as an engineering drawing sheet.

## Running

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
```

## Tabs

| Tab | What it does |
| --- | --- |
| **Overview** | Market stats and the trends moving LMM industrials deal flow |
| **Multiples** | Indicative EV/EBITDA bands by subsector on a machined 3x–11x scale |
| **Public Comps** | Watchlist of public industrials peers; enter current trading multiples (persisted) |
| **Valuation** | Calculator: pick a subsector, assess quality factors, get an implied multiple and EV inside the band |
| **Pipeline** | Platform target tracker with mandate-fit checks, filters, status workflow, and CSV export |
| **Scoring** | Weighted deal scorecard (certifications, aftermarket mix, concentration, management, end markets, spec-in) that ranks the pipeline and flags red flags |
| **Add-Ons** | Attach add-on candidates to each platform and see blended entry multiple and buy-and-build arbitrage |
| **Playbook** | Data sources, sourcing channels, and screening criteria |

## How the scoring model works

Six criteria from the playbook screen, weighted to 100 (`src/lib/scoring.js`). Each scores 0–1; unassessed criteria are excluded and the score reweights over what's filled in. Grades: A ≥75, B ≥55, C ≥35, else D. Red flags (top customer >25%, founder-only bench, commodity exposure) surface independently of the total.

The Valuation tab maps the same quality score linearly across the chosen subsector band: `multiple = lo + quality × (hi − lo)`.

## Deployment

Pushes to `main` (or the current working branch) build, smoke-test, and deploy to GitHub Pages via `.github/workflows/deploy.yml`. One-time setup: in **Settings → Pages**, set **Source** to **GitHub Actions**. The site then lives at `https://tsom456.github.io/Project-venus/`.

### Custom domain

1. Buy a domain at any registrar (Cloudflare, Porkbun, and Namecheap are cheap and no-nonsense).
2. In **Settings → Pages → Custom domain**, enter the domain and save. GitHub provisions the TLS certificate automatically; tick **Enforce HTTPS** once it does.
3. At the registrar, add DNS records:
   - Apex domain (`example.com`): four `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` (or any subdomain): `CNAME` → `tsom456.github.io`

The build already uses relative asset paths (`base: "./"` in `vite.config.js`), so it works unchanged at the Pages subpath or a custom domain root.

## Persistence

State (pipeline targets, add-ons, comp multiples) is stored via `window.storage` when running as a Claude artifact, falling back to `localStorage` in the browser (`src/lib/storage.js`).

All reference data is indicative — synthesized from GF Data, Capstone Partners, and advisor-published benchmarks. Not investment advice; verify before quoting in an IOI.
