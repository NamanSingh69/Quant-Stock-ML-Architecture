# Quant Data Architecture — Complete Standalone Agent Prompt

## Project Identity

| Field | Value |
|-------|-------|
| **Project Folder** | `C:\Users\namsi\Desktop\Projects\quant-data-architecture` *(NOT `quant data` — that folder contains Jupyter notebooks and CSV data)* |
| **Tech Stack** | React + Vite (TypeScript + Tailwind CSS) |
| **Vercel URL** | https://quant-data-architecture.vercel.app/ |
| **GitHub Repo** | `NamanSingh69/Quant-Data-Architecture` (create if not exists) |
| **Vercel Env Vars** | `GEMINI_API_KEY` is set |

### Key Files
- `src/` — React component tree
- `index.html` — Entry HTML (4.6KB)
- `package.json` — Dependencies
- `vite.config.ts` — Vite config

### Important Note About Folders
`C:\Users\namsi\Desktop\Projects\quant data` is a SEPARATE directory containing Jupyter notebooks (`Code Comparision.ipynb`, `data analysis.ipynb`), CSV data files, and a `main.py` (73KB) — this is the raw data science work. The Vercel-deployed React showcase is in `quant-data-architecture`.

---

## Shared Infrastructure Context (CRITICAL)

### Design System — "UX Mandate"
4 states: Loading (skeletons), Success (sonner toasts), Empty (null states), Error (recovery). Never `alert()`.

### React Toast: `sonner`
### Smart Model Cascade (March 2026)
**Primary (Free Preview):** `gemini-3.1-pro-preview` → `gemini-3-flash-preview` → `gemini-3.1-flash-lite-preview`
**Fallback (Free Stable):** `gemini-2.5-pro` → `gemini-2.5-flash` → `gemini-2.5-flash-lite`
**Grounding Tasks:** Use `gemini-2.5-pro` or `gemini-2.5-flash` for live market data queries (5,000 free grounded queries/month)
**Note:** `gemini-2.0-*` deprecated March 3, 2026.
### Security: Vercel Serverless Functions, never hardcode keys
### Mobile: 375px–1920px, Tailwind responsive prefixes

---

## Current Live State (Verified March 10, 2026)

| Feature | Status | Details |
|---------|--------|---------|
| Site loads | ✅ 200 OK | Static showcase: "Zerodha Live Trading Integration" architecture page |
| Login wall | ✅ None | |
| Interactive Features | ❌ NONE | Static showcase only — no inputs, no API calls |
| Pro/Fast Toggle | ❌ Not present | |
| Rate Limit Counter | ❌ Not present | |
| Mobile Responsive | ✅ Yes | Layout adapts at 375px |

---

## Required Changes

### 1. Convert to Interactive Quant Analysis Tool (PRIMARY OBJECTIVE)
Since `GEMINI_API_KEY` is set and there's a rich data science backend available in the `quant data` folder, convert this from a static showcase to an interactive tool:

**Implementation:**
- Add a **ticker input** field: user enters a stock ticker symbol (e.g., `RELIANCE.NS`, `TCS.NS`)
- Add an **"Analyze"** button:
  - Use Gemini API with **Google Search grounding** to fetch real-time/recent stock data
  - Use `gemini-2.5-pro` with grounding enabled for live market analysis
  - Generate: company overview, recent performance, technical indicators, AI-driven prediction
- Display results in a structured card layout:
  - Company info card
  - Price history chart (or placeholder)
  - AI analysis with bullish/bearish signal
  - Risk assessment

**Create Vercel Serverless Function `/api/analyze`:**
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.GEMINI_API_KEY;
  const { ticker, model } = req.body;
  const modelName = model || 'gemini-2.5-pro'; // Use pro for grounding
  
  const payload = {
    contents: [{ parts: [{ text: `Analyze the stock ${ticker}. Provide: company overview, recent performance, key technical indicators, and an AI-driven prediction with risk assessment.` }] }],
    tools: [{ googleSearch: {} }] // Enable free Google Search grounding
  };
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
  });
  const data = await response.json();
  res.status(response.status).json(data);
}
```

### 2. Add Pro/Fast Toggle
- Pro → `gemini-2.5-pro` (with grounding for live data)
- Fast → `gemini-2.5-flash` (with grounding)
- Store in `localStorage.gemini_mode`

### 3. Add Rate Limit Counter
- `X/15 remaining` with progress bar

### 4. UX States
- **Empty State**: "Enter a stock ticker to get AI-powered analysis" with chart icon
- **Skeleton Loaders**: Shimmer placeholders while analysis runs
- **Toasts**: `sonner` — success/error

### 5. Mobile Responsiveness
- Ticker input must be full-width on mobile
- Analysis cards should stack vertically
- Any chart/graph must be scrollable or responsive

### 6. GitHub & Deployment
- Create repo `Quant-Data-Architecture` under `NamanSingh69`
- Push and redeploy: `npx vercel --prod --yes`

---

## Verification Checklist
1. ✅ Site loads with ticker input and empty state (NOT just static showcase)
2. ✅ Pro/Fast toggle visible
3. ✅ Rate limit counter visible
4. ✅ Enter a ticker (e.g., `RELIANCE`) → click Analyze → skeleton → results with grounded data → success toast
5. ✅ Results show real/recent information (grounding working)
6. ✅ Resize to 375px → fully usable
7. ✅ DevTools console → zero errors
