# HAGU — Backend / design handoff

**Version:** 1.0 (prototype freeze)  
**Figma (source of truth):** [Hagu Design File](https://www.figma.com/design/YCZ3EsQcr4rUfTgPutKj3E/Hagu)  
**Code (UI reference only):** [github.com/ka-bell/haguv2](https://github.com/ka-bell/haguv2)

---

## 1. Purpose

This document hands off product flows, routes, screens, and design tokens to the backend / engineering team. The Next.js repo provides **visual reference** for a subset of screens. **Figma defines final design and behavior.**

---

## 2. User journeys

### Roles (glossary)

| Role | Meaning |
|------|---------|
| **HAGEE** | Buyer / client — books and pays for companionship |
| **HAGU** | Seller / provider — offers time and receives bookings |

The product brand is also named **HAGU**; do not confuse brand with the seller role.

### Journey A — New HAGEE (buyer)

1. Lands on entry screen
2. Taps **Create account**
3. Selects **HAGEE** (*I buy companionship — book a HAGU for shared time.*)
4. Completes HAGEE onboarding (intro → account → preferences → profile → character → success)
5. Lands on **Home** (`/home`); browse companions on **Explore** (`/explore`)
6. Uses bottom nav: Explore · Home · Connections · Profile

### Journey B — New HAGU (seller)

1. Lands on entry screen
2. Taps **Create account**
3. Selects **HAGU** (*I sell my time — offer services and receive bookings.*)
4. Completes HAGU onboarding (9 steps ending in payment setup)
5. Lands on **Home** (`/discover` — provider dashboard: earnings, next booking, requests)
6. Uses bottom nav: Home · Bookings · Chat · Calendar · Settings

### Journey C — Returning user

1. Lands on entry screen
2. Taps **Log in**
3. Enters credentials (or Google OAuth — backend)
4. Lands on role home: **HAGEE** → `/home`, **HAGU** → `/discover`

### Journey D — Forgot password

1. From login → **Forgot password**
2. Enters email → **Send reset link**
3. Success screen: **Check your inbox**
4. Returns to login (email link handled by backend)

---

## 3. Route map

| Route | Purpose | Code reference | Figma |
|-------|---------|----------------|-------|
| `/` | Entry: log in or create account | `app/page.tsx` | To complete |
| `/login` | Returning user sign-in | `app/login/page.tsx` | To complete |
| `/forgot-password` | Password reset request + success | `app/forgot-password/page.tsx` | To complete |
| `/select-role` | HAGEE (buyer) vs HAGU (seller) | `app/select-role/page.tsx` | To complete |
| `/onboarding` | HAGEE onboarding (6 steps) | `app/onboarding/page.tsx` | `2393:9244` |
| `/onboarding/hagu` | HAGU onboarding (9 steps) | `app/onboarding/hagu/page.tsx` | `2424:11787` |
| `/home` | HAGEE home | `app/(app)/home/page.tsx` | To complete |
| `/explore` | HAGEE browse companions | `app/(app)/explore/page.tsx` | To complete |
| `/discover` | HAGU provider home only | `app/(app)/discover/page.tsx` | `2467:19060` |
| `/requests` | HAGU: incoming booking requests | `app/(app)/requests/page.tsx` | `2467:13610` |
| `/bookings` | Bookings (role-specific screens) | `app/(app)/bookings/page.tsx` | `2467:13749` |
| `/chat` | HAGEE Connections / HAGU Chat | `app/(app)/chat/page.tsx` | `2467:13855`, `2467:14477` |
| `/calendar` | HAGU: availability calendar | `app/(app)/calendar/page.tsx` | `2467:14009` |
| `/profile` | HAGEE profile | `app/(app)/profile/page.tsx` | To complete |
| `/settings` | HAGU settings / profile | `app/(app)/settings/page.tsx` | `2467:14188` |
| `/settings/transactions` | HAGU earnings & payouts | `app/(app)/settings/transactions/page.tsx` | `2467:14361` |
| `/dev/flow` | Dev-only screen index | `app/dev/flow/page.tsx` | N/A |
| `/dev/components` | Component library preview | `app/dev/components/page.tsx` | N/A |

Route constants: [`lib/routes.ts`](../lib/routes.ts)

---

## 4. Screen inventory

### Entry (`/`)

- **Goal:** Brand moment + auth entry
- **Fields:** None
- **Actions:** Log in, Create account
- **API (backend):** None

### Login (`/login`)

- **Goal:** Authenticate returning user
- **Fields:** Email, password
- **Actions:** Sign in, Forgot password, Google OAuth
- **API:** `POST /auth/login`, OAuth callback

### Forgot password (`/forgot-password`)

- **Goal:** Request password reset
- **Fields:** Email
- **States:** Form, success (check inbox)
- **API:** `POST /auth/forgot-password`

### Select role (`/select-role`)

- **Goal:** Branch onboarding by role
- **Options:** HAGEE (buyer — books companionship), HAGU (seller — offers time)
- **API:** Store role on user record or session

### HAGEE onboarding (`/onboarding`)

| Step | Title | Key fields / actions |
|------|-------|----------------------|
| 1 | Intro | Continue |
| 2 | Create account | First name, email, password, terms, Google |
| 3 | Looking for | Activity grid, vibe pills |
| 4 | About you | Photo, age, gender, city, one-liner |
| 5 | Character | Min 3 traits |
| 6 | Success | Start exploring → Home / Explore |

### HAGU onboarding (`/onboarding/hagu`)

| Step | Title | Key fields / actions | Figma ref |
|------|-------|----------------------|-----------|
| 1 | Intro | Become a Hagu | — |
| 2 | Profile Basics | Photo, display name, tagline, age, sex | `2468:19975` |
| 3 | Background | Neighborhood, languages, how you show up (min 2) | — |
| 4 | Rates & Logistics | Hosting, hourly rates (1–4 hr) | `2468:20300` |
| 5 | Activity Menu | Activities, included/extra pricing | — |
| 6 | Availability | Weekdays, time preferences | — |
| 7 | Identity (ID) | Scan ID / passport | — |
| 8 | Identity (Social) | Platform, handle | — |
| 9 | Get Paid | Stripe Connect, PayPal | — |

### HAGEE Home & Explore

- **Home (`/home`):** Active booking card, mood shortcuts, new arrivals
- **Explore (`/explore`):** Companion swipe stack / browse
- **API:** Companions, bookings, preferences

### HAGU Home (`/discover`)

- Provider home — earnings card, next booking, new requests banner (`2467:19060`)
- **API:** Bookings, earnings, profile summary

### HAGU Provider App flow

**Figma master frame:** [`2467:13479`](https://www.figma.com/design/YCZ3EsQcr4rUfTgPutKj3E/Hagu?node-id=2467-13479)

Full screen list: [`lib/figma-flows.ts`](../lib/figma-flows.ts) → `HAGU_PROVIDER_APP_FLOW`

| Screen | Figma | Key UI | API (backend) |
|--------|-------|--------|---------------|
| Requests | `2467:13610` | Pending cards, Decline/Accept, 24h timer | `GET /requests`, `POST /requests/:id/accept` |
| Bookings | `2467:13749` | Tabs: Requests, Upcoming, Past, Cancelled | `GET /bookings`, filter by status |
| Chat (active) | `2467:13855` | Booking widget + message thread | WebSocket + `GET /bookings/:id` |
| Calendar | `2467:14009` | Month grid, slot toggles | `GET/PUT /availability` |
| Settings | `2467:14188` | Cover, stats, sections, log out | `GET /profile`, `PATCH /profile` |
| Transactions | `2467:14361` | Balance, withdraw, history | `GET /earnings`, `POST /payout` |
| Chat (thread) | `2467:14477` | Standard conversation | Messages API |

**Nav:** Figma HAGU uses **Home · Bookings · Calendar · Settings**. Code HAGU uses **Home · Bookings · Chat · Calendar · Settings**. HAGEE uses **Explore · Home · Connections · Profile**.

### Bookings / Chat / Profile (HAGEE)

- HAGEE Connections (`/chat`), bookings via Connections tab, profile at `/profile`
- **API:** Standard CRUD + real-time chat

---

## 5. Design tokens

From Figma reference screens. Full export in code:

**File:** [`lib/hagu-design.ts`](../lib/hagu-design.ts)

### Colors

| Token | Hex / value | Usage |
|-------|-------------|--------|
| canvas | `#FCFFFF` | Page background |
| ink | `#1A1A1E` | Body text, headings |
| heading | `#2D1012` | Brand, CTA background |
| label | `#4A4A52` | Field labels |
| muted | `#8A8A96` | Secondary text |
| accent | `#D0F1F0` | Highlights, borders |
| accentStrong | `#5BBFB5` | Badges, selected borders |
| accentSoft | `rgba(208,241,240,0.4)` | Selected cards |
| surfaceMuted | `#F7F6F3` | Secondary buttons |

### Radius

| Token | Value |
|-------|-------|
| input / card | `20px` |
| cardLg | `24px` |
| chrome / CTA | `32px` |
| photo | `60px` |

### Typography

- **Font family:** Roobert (see `app/globals.css` `@font-face`)
- **H1 (flow):** 26px semibold, `#1A1A1E`
- **Body:** 15px, labels 12px uppercase `#4A4A52`

### Components

| Component | Code |
|-----------|------|
| Flow screen shell | `components/hagu/hagu-flow-screen.tsx` |
| Glass header | `components/hagu/hagu-flow-header.tsx` |
| Bottom CTA pill | `components/hagu/hagu-flow-cta.tsx` |
| Provider home | `components/hagu/hagu-provider-home.tsx` |
| Input | `components/ui/input.tsx` |
| Segmented pills | `components/ui/segmented-pill-group.tsx` |

---

## 6. Out of scope (backend owns)

| Feature | Notes |
|---------|--------|
| Real authentication | Email/password, Google OAuth, sessions/JWT |
| Password reset emails | Trigger + token validation |
| ID verification | Document scan, KYC provider |
| Payments | Stripe Connect, PayPal payouts |
| File upload | Profile photo, storage |
| Chat real-time | WebSocket / push |
| Booking logic | Create, accept, cancel, payments |

Current code uses `localStorage` mock session ([`lib/session.ts`](../lib/session.ts)) for UI preview only.

---

## 7. Optional: local UI preview

For engineers who want to click through screens without auth:

```bash
cp .env.example .env.local   # NEXT_PUBLIC_PROTOTYPE=true
npm run dev
```

Open **http://localhost:3000/dev/flow** — links to every route, guards and validation disabled.

---

## 8. Related docs

- [Figma flow checklist](./figma-flows.md) — frames and states to complete in Figma
- [README](../README.md) — repo overview and code freeze policy

---

## 9. Contact / next steps

1. Complete missing frames in Figma per `figma-flows.md`
2. Backend defines API contracts per screen inventory
3. Replace mock session with real auth when APIs are ready
4. Implement screens from Figma — use this repo only where it matches design
