# Forge deployment

## Deploy

1. Push to `main` (Forge pulls from this branch).
2. In **Laravel Forge** → your site → **Deployments** → **Deploy Now**.

Or enable **Quick Deploy** so every push to `main` deploys automatically.

## What Forge runs

Typical deploy script:

```bash
cd /home/forge/your-site
git pull origin $FORGE_SITE_BRANCH
npm ci
npm run build
# Restart Node daemon (Forge UI → Daemons)
```

Ensure the Node daemon command is:

```bash
npm run start
```

Forge sets `PORT` automatically. The `start` script binds to `0.0.0.0` and uses that port.

## Environment

On the server, set in Forge → **Environment**:

```
NEXT_PUBLIC_PROTOTYPE=true
```

(Add other `NEXT_PUBLIC_*` vars as needed.)

## Troubleshooting

| Error | Fix |
|-------|-----|
| `ERESOLVE` / `vaul` peer deps | Fixed in `701c82c` — pull latest `main` |
| `npm ci` fails | Ensure `.npmrc` is present (`legacy-peer-deps=true`) |
| Site loads but blank / 502 | Check daemon is running; confirm `PORT` matches Nginx proxy |
| Build OOM | Increase server memory or add swap on Forge |

## Verify locally before deploy

```bash
npm ci
npm run build
PORT=3000 npm run start
```
