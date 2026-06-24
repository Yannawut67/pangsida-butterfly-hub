# Pang Sida Butterfly Web — Active Memory

## Active Stack (2026-06-24)
- **AI Backend**: `butterfly_server` (FastAPI) บน `localhost:8777`
  - Model: EfficientNet-B0 v3 — **82.0% Val Top-1 / 90.3% Top-3**, 40 species
  - Trained on tungrog (AMD RX 6600 via DirectML), 21 min, 2,275 imgs
  - Endpoint: `POST /api/identify` (multipart `image`) → `{species_id, name_th, name_sci, confidence, top_predictions:[5]}`
  - Catalog: `GET /api/species` → array of 40 species objects
- **Public URL** (quick tunnel, rotates): `https://thought-dozens-replacing-queensland.trycloudflare.com`
- **Webapp**: `G:\My Drive\WebPageButterfly\` (this folder) — static HTML+JS, hosted from Drive or local

## Settings storage (localStorage)
- `pang_sida_ai_url` — AI backend URL (default = tunnel above)
- `pang_sida_sheets_url` — Google Sheets Web App URL (optional)
- `pang_sida_butterflies` — local catalog cache

## Wiring done in this session
1. Settings modal now has TWO fields: 🤖 AI Classifier + 📊 Google Sheets (Sheets is optional)
2. Status card shows BOTH AI + Sheets status with separate indicators
3. `startAIScan()` now POSTs real image to `/api/identify` (not simulated)
4. `showScanResults()` renders top-3 predictions with confidence bars + colour-coded confidence buckets:
   - ≥60% = green (high confidence) → "บันทึกการพบเห็น"
   - 30–60% = gold (medium) → "บันทึกเป็นชนิดใหม่"
   - <30% = red (uncertain)
5. Auto-checks AI health every 60s (calls `/api/species`)
6. "Test connection" button in settings modal pings backend before save

## Pitfalls
- Quick tunnel URL **rotates** when cloudflared restarts → user must update via Settings ⚙️
- Cloudflared metrics endpoint: `http://127.0.0.1:20244/metrics` (extract `userHostname` to find current URL)
- Server backend CORS allows `*` so cross-origin scan from Drive works
