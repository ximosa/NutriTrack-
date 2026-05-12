# NutriTrack+

NutriTrack+ is a React + Vite PWA for nutrition tracking and weekly meal planning.

## Local setup

1. Clone:
```bash
git clone https://github.com/ximosa/NutriTrack-.git
cd NutriTrack-
```

2. Install deps:
```bash
npm install
```

3. Create `.env` from `.env.example` and set values:
```env
VITE_USDA_API_KEY="YOUR_USDA_API_KEY"
VITE_AI_PROXY_URL="https://your-backend.example.com/api/weekly-plan"
```

4. Run dev server:
```bash
npm run dev
```

## Deploy to GitHub Pages (without workflow)

This project is already configured with `gh-pages` and deploy script.

```bash
npm run deploy
```

That command builds `dist/` and publishes it to branch `gh-pages`.

Configured repo path:
- GitHub repo: `ximosa/NutriTrack-`
- Vite `base`: `/NutriTrack-/`

Final URL:
- `https://ximosa.github.io/NutriTrack-/`

## Environment variables and security

Important:
- Everything inside a Vite frontend build can be inspected by users.
- Do not put private API keys in frontend `.env`.

Safe in frontend:
- Public values like `VITE_USDA_API_KEY` (or use `DEMO_KEY` fallback).
- Public URLs like `VITE_AI_PROXY_URL`.

Never in frontend:
- `GEMINI_API_KEY`, OpenAI secret keys, DB passwords, admin tokens.

Recommended secure architecture:
1. Keep private Gemini key in a backend (Vercel Functions, Netlify Functions, Cloudflare Workers, Render, etc.).
2. Expose one endpoint like `POST /api/weekly-plan`.
3. Frontend calls that endpoint using `VITE_AI_PROXY_URL`.

## Notes

- `.env` is ignored by git.
- `.env.example` is versioned as template only.
