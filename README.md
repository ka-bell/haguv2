# HAGU

UI reference implementation for the HAGU companionship platform.

## Source of truth

**Figma is the source of truth** for design, flows, and screen states.

| Resource | Location |
|----------|----------|
| Figma file | [Hagu Design](https://www.figma.com/design/YCZ3EsQcr4rUfTgPutKj3E/Hagu) |
| Flow spec (Figma checklist) | [docs/figma-flows.md](docs/figma-flows.md) |
| Backend handoff | [docs/HANDOFF.md](docs/HANDOFF.md) |

This repository is a **rough UI reference only** — not a production-ready or fully clickable prototype. Auth, payments, and ID verification are mocked.

## Code freeze

Do not spend time fixing click-through flow bugs unless backend explicitly requests it. New UI work should match Figma first; implementation follows the handoff doc.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Prototype mode (optional click-through)

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_PROTOTYPE=true`. Then open [http://localhost:3000/dev/flow](http://localhost:3000/dev/flow) to jump to any screen without auth or form validation blocking navigation.

## Design tokens

Tokens extracted from Figma reference screens live in [`lib/hagu-design.ts`](lib/hagu-design.ts) and [`app/globals.css`](app/globals.css).

## Repository

GitHub: [ka-bell/haguv2](https://github.com/ka-bell/haguv2)
