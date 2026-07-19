# PULSE — AI Stadium Companion for FIFA World Cup 2026

**One AI reasoning engine. Two interfaces. Every gate, every fan, every decision.**

PULSE is a GenAI-powered operations system built for the FIFA World Cup 2026. It ingests a live
stadium data feed (gate queues, transit load, amenities, weather, incidents) and feeds it into
Google's Gemini model to power two connected experiences:

1. **Fan Concierge** (`/fan`) — a multilingual AI chat assistant that helps fans navigate the
   stadium, find accessible amenities, catch transit, and get first-aid directions — grounded in
   real-time conditions, answering fluently in whatever language the fan writes in.
2. **Ops Command Center** (`/ops`) — a live dashboard where the same AI reasons over the same data
   to generate prioritized, specific crowd-management recommendations for organizers and
   volunteers (e.g. "redirect flow from Gate 9 to Gate 2"), refreshing automatically like a real
   control-room feed.

This dual-interface design is the core idea: most event apps only serve fans. PULSE demonstrates
how a single generative reasoning layer can serve **both sides of the same problem** — the people
inside the crowd, and the people managing it.

## Why this is unique

- **Shared AI brain, not two separate features.** Both interfaces read the exact same simulated
  live snapshot and reason over it with the same underlying model — showing a realistic pattern
  for how a real stadium tech stack would actually be architected.
- **Structured GenAI output for ops, not just chat.** The Ops Brain forces Gemini to return
  strict JSON (priority, category, specific action) so its output can drive a real UI — this is
  the difference between "a chatbot" and "AI making operational decisions."
- **Genuinely multilingual, not translated strings.** The concierge doesn't use a translation
  layer or i18n files — Gemini itself detects and replies in the fan's language, live.
- **Graceful degradation.** If no API key is present, the app still runs fully on a rule-based
  fallback so it's never broken for a judge testing it cold — and clearly indicates fallback mode
  in the UI.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router, TypeScript) | Single repo = frontend + backend API routes, ideal for a fast build and Vercel deploy |
| AI | Google Gemini (`gemini-2.0-flash`) via `@google/genai` | Free tier, fast, strong multilingual support, matches the Google for Developers theme |
| Styling | Tailwind CSS | Fast, consistent design system, no CSS overhead |
| Hosting | Vercel | Zero-config Next.js deploys, free tier, instant live URL |
| Data layer | Simulated live stadium snapshot (`lib/stadiumState.ts`) | Deterministic-but-dynamic generator standing in for real turnstile/transit/weather IoT feeds — swap-ready for real APIs |

## Project structure

```
pulse-wc26/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── fan/page.tsx              # Fan Concierge chat UI
│   ├── ops/page.tsx              # Ops Command Center dashboard
│   ├── api/concierge/route.ts    # Gemini-powered fan chat endpoint
│   ├── api/ops-brain/route.ts    # Gemini-powered ops reasoning endpoint (structured JSON)
│   ├── layout.tsx, globals.css
├── lib/
│   ├── gemini.ts                 # Gemini client wrapper
│   └── stadiumState.ts           # Live stadium data simulator
├── package.json, tailwind.config.ts, tsconfig.json, next.config.mjs
```

## Run locally

```bash
npm install
cp .env.example .env.local
# edit .env.local and add your GEMINI_API_KEY (get one free at https://aistudio.google.com/apikey)
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel (get your live link in ~3 minutes)

1. Push this repo to GitHub (public).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. In **Environment Variables**, add:
   - `GEMINI_API_KEY` = your key from [Google AI Studio](https://aistudio.google.com/apikey)
4. Click **Deploy**. Vercel will give you a live `.vercel.app` URL — that's your submission link.

No other configuration needed — the build is zero-config Next.js.

## Getting a free Gemini API key

1. Go to https://aistudio.google.com/apikey
2. Sign in with a Google account
3. Click "Create API key" — it's free with generous rate limits
4. Paste it into `.env.local` (local) or Vercel's Environment Variables (deployed)

## Roadmap (if extended beyond the hackathon)

- Replace the simulated snapshot with real turnstile IoT / transit API / weather API feeds
- Add push notifications for the Ops Brain's high-priority recommendations
- Voice input for the Fan Concierge for accessibility
- Historical analytics dashboard trained on past match snapshots

---

Built for **Hack2skill × Google for Developers — Prompt War / GenAI Exchange Challenge 2026**.
