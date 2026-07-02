# Local development

## Quick start

```bash
npm run dev
```

App runs at:

- **Laptop:** http://localhost:3010
- **Phone (same WiFi):** http://192.168.178.21:3010

## Scripts

| Command | When to use |
|---------|-------------|
| `npm run dev` | Daily work — Turbopack, fast HMR |
| `npm run dev:clean` | Red error screen / stuck state |
| `npm run dev:webpack` | Fallback if one page fails under Turbopack |
| `npm run dev:preview` | Stable mobile test (production build, no HMR) |
| `npm run build` | Deploy check — **only when dev is stopped** |

## Rules

1. Never run `npm run build` while `npm run dev` is running (both use `.next`).
2. Prefer **Terminal.app** for the dev server; use Safari/Chrome for preview.
3. Hard refresh on mobile if you see a stale error: Cmd+Shift+R (Mac) or pull-to-refresh.

## If something breaks

```bash
kill -9 $(lsof -ti:3010) 2>/dev/null
cd "/Users/karissabell/Desktop/Coded projects/haguv2"
npm run dev:clean
```

## Prototype mode

`.env.local` should include:

```
NEXT_PUBLIC_PROTOTYPE=true
```

This enables click-through flows without auth blocking.
