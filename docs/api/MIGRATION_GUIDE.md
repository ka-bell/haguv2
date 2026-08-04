# Hagu API — Mock → API Migratie Gids

Dit document beschrijft hoe de huidige localStorage-mocks in haguv2 vervangen worden door echte API-calls naar de Laravel backend.

## Overzicht

| Huidige mock | Vervangen door | API endpoints |
|-------------|----------------|---------------|
| `lib/session.ts` | Echte auth met tokens | `POST /auth/*` |
| `lib/hagee-booking-storage.ts` | Booking API | `POST /bookings`, `GET /bookings` |
| `lib/hagu-chat-threads.ts` | Chat API + WebSocket | `GET /threads`, `WS /chat/{id}` |
| `lib/hagu-reviews.ts` | Review API | `POST /bookings/{id}/review` |
| `lib/hagee-companion-profiles.ts` | Companions API | `GET /companions` |
| `lib/hagu-provider-profile.ts` | Profile API | `GET /profiles/me` |
| `lib/hagee-explore.ts` | Companions API met filters | `GET /companions?vibe=...` |
| `lib/hagu-provider-feed.ts` | Bookings API (HAGU view) | `GET /bookings?role=hagu` |
| `lib/hagu-onboarding.ts` | Onboarding API | `POST /onboarding/hagu` |
| `lib/hagee-discover.ts` | Companions API | `GET /companions` |
| `lib/hagee-home.ts` | Bookings + Companions API | `GET /bookings?status=confirmed` |
| `lib/hagu-provider-status.ts` | Bookings API | `GET /bookings?role=hagu&status=...` |
| `lib/hagu-provider-booking-detail.ts` | Booking detail API | `GET /bookings/{id}` |
| `lib/hagee-client-booking-detail.ts` | Booking detail API | `GET /bookings/{id}` |
| `lib/hagee-reschedule.ts` | Reschedule API | `POST /bookings/{id}/reschedule` |
| `lib/account-settings-storage.ts` | Profile API | `PATCH /profiles/me` |
| `lib/chat-report.ts` | Chat API | `POST /threads/{id}/messages` |
| `lib/hagu-review-storage.ts` | Review API | `GET /reviews/pending` |
| `lib/hagee-saved-storage.ts` | Profile API (favorites) | `PATCH /profiles/me` |
| `lib/hagee-discover-preferences.ts` | Profile API | `PATCH /profiles/me` |
| `lib/hagu-demo-request-dismiss.ts` | User preferences API | `PATCH /profiles/me` |

## Stap 1: Auth migratie

### Huidige code (mock)
```typescript
// lib/session.ts
export function loginAsReturningUser(role: UserRole = "HAGEE") {
  setSession({ isLoggedIn: true, role, onboardingComplete: true })
}
```

### Nieuwe code (API)
```typescript
// lib/api/auth.ts
export async function login(email: string, password: string) {
  const res = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, device_name: 'web' }),
  })
  const { data } = await res.json()
  localStorage.setItem('hagu-token', data.token)
  return data.user
}

export async function getCurrentUser() {
  const token = localStorage.getItem('hagu-token')
  if (!token) return null
  const res = await fetch('/api/v1/profiles/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    localStorage.removeItem('hagu-token')
    return null
  }
  const { data } = await res.json()
  return data
}
```

## Stap 2: Booking migratie

### Huidige code (mock)
```typescript
// lib/hagee-booking-storage.ts
export function createBookingRequest(draft: BookingDraft, profile: HageeCompanionProfile) {
  const request: HageeBookingRequest = {
    id: `booking-${Date.now()}`,
    profileId: profile.id,
    // ... all local
  }
  saveRequests([...readRequests(), request])
  return request
}
```

### Nieuwe code (API)
```typescript
// lib/api/bookings.ts
export async function createBooking(input: CreateBookingInput) {
  const res = await fetch('/api/v1/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(input),
  })
  const { data } = await res.json()
  return data
}

export async function payBooking(bookingId: string, paymentMethodId: string) {
  const res = await fetch(`/api/v1/bookings/${bookingId}/pay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ payment_method_id: paymentMethodId }),
  })
  const { data } = await res.json()
  return data // { client_secret, payment_intent_id }
}
```

## Stap 3: Chat migratie

### Huidige code (mock)
```typescript
// lib/hagu-chat-threads.ts
export const CHAT_THREADS: Record<string, ChatThread> = {
  luca: { id: "luca", name: "Luca M.", messages: [...] },
  // ...
}
```

### Nieuwe code (API + WebSocket)
```typescript
// lib/api/chat.ts
export async function getThreads() {
  const res = await fetch('/api/v1/threads', {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  const { data } = await res.json()
  return data
}

export async function sendMessage(threadId: string, body: string) {
  const res = await fetch(`/api/v1/threads/${threadId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ body }),
  })
  return res.json()
}

// WebSocket setup (Reverb)
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export function createEcho(token: string) {
  return new Echo({
    broadcaster: 'reverb',
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
    wsPort: process.env.NEXT_PUBLIC_REVERB_PORT,
    forceTLS: true,
    auth: {
      headers: { Authorization: `Bearer ${token}` },
    },
  })
}

export function subscribeToThread(echo: Echo, threadId: string, onMessage: (msg: ChatMessage) => void) {
  return echo.private(`chat.${threadId}`)
    .listen('MessageSent', (e: { message: ChatMessage }) => onMessage(e.message))
}
```

## Stap 4: Profile migratie

### Huidige code (mock)
```typescript
// lib/hagee-companion-profiles.ts
const COMPANION_PROFILES: HageeCompanionProfile[] = [/* hardcoded */]
export function getCompanionProfile(id: string) { /* ... */ }
```

### Nieuwe code (API)
```typescript
// lib/api/companions.ts
export async function getCompanions(filters?: { vibe?: string; interests?: string[] }) {
  const params = new URLSearchParams()
  if (filters?.vibe) params.set('vibe', filters.vibe)
  if (filters?.interests) params.set('interests', filters.interests.join(','))
  const res = await fetch(`/api/v1/companions?${params}`)
  const { data, meta } = await res.json()
  return { companions: data, pagination: meta }
}

export async function getCompanion(id: string) {
  const res = await fetch(`/api/v1/companions/${id}`)
  const { data } = await res.json()
  return data
}
```

## Stap 5: Environment variables

Voeg toe aan `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_REVERB_APP_KEY=hagu-app-key
NEXT_PUBLIC_REVERB_HOST=localhost
NEXT_PUBLIC_REVERB_PORT=8080
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Stap 6: Type generatie

Genereer TypeScript types uit de OpenAPI spec:

```bash
npx openapi-typescript docs/api/openapi.yaml -o lib/api/types.ts
```

Gebruik de types:
```typescript
import type { components } from '@/lib/api/types'
type Booking = components['schemas']['Booking']
type CompanionSummary = components['schemas']['CompanionSummary']
```

## Migratie volgorde

1. **Auth** — eerst, want alles hangt ervan af
2. **Profiles** — nodig voor companions browse
3. **Bookings** — core flow
4. **Chat** — real-time vereist WebSocket setup
5. **Reviews** — na bookings
6. **Payments** — Stripe integratie
7. **Uploads** — S3 signed URLs
8. **Availability** — HAGU calendar

## Rollback strategie

Behoud mocks tijdens migratie:
```typescript
// lib/api/index.ts
const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true'

export const api = USE_API ? realApi : mockApi
```

Zet `NEXT_PUBLIC_USE_API=true` in `.env.local` om te schakelen.
