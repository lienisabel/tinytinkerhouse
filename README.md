# Tiny Tinker House

A family library of age-by-age activity ideas and kid-friendly recipes. Vite + React, deployed on Vercel.

## Project layout

```
api/claude.js            Vercel serverless function — proxies AI requests to the Anthropic API
src/App.jsx              Main app (state, filters, hero, sidebar, modals)
src/components/          HeroLogo, CollageTile, ActivityCard, RecipeCard
src/data/                Age bands, activity seed library, recipes, form options
src/lib/storage.js       localStorage persistence (per browser)
src/lib/claude.js        Browser client for /api/claude
src/lib/helpers.js       Search/parse helpers
src/styles.js            Inline style objects
src/index.css            Global CSS, animations, responsive rules
```

## Develop

```bash
npm install
npm run dev        # UI only — the AI buttons need the API route
npm run dev:full   # UI + /api/claude via the Vercel CLI (needs .env.local with ANTHROPIC_API_KEY)
```

## Deploy to Vercel

1. Push this folder to a GitHub repo and import it in Vercel (framework preset: **Vite**), or run `npx vercel`.
2. In **Project → Settings → Environment Variables**, add `ANTHROPIC_API_KEY`.
3. Deploy.

Saved activities, recipes, and favorites live in each visitor's browser (localStorage); they don't sync across devices.
