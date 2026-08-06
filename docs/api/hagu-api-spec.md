# Hagu API — Laravel Backend voor Companionship Platform

> **Status**: Voorstel / in ontwikkeling
> **Repo**: `ka-bell/hagu-api` (nieuw, apart van deze frontend)
> **Doel**: Vervang alle localStorage-mocks in haguv2 door een echte REST + WebSocket API

---

## 1. Context

Hagu is een companionship-platform met twee rollen:

| Rol | Betekenis | Doel |
|-----|-----------|------|
| **HAGEE** | Buyer / client | Boekt en betaalt voor companionship |
| **HAGU** | Seller / provider | Biedt tijd aan, ontvangt boekingen en uitbetalingen |

De huidige frontend (`haguv2`, Next.js) draait volledig op mocks:
- Auth via `localStorage`
- Bookings in-memory + `localStorage`
- Chat threads statisch
- Betalingen gesimuleerd
- Geen echte provider-profielen, availability of reviews

Deze API vervangt al die mocks door een productie-ready Laravel backend.

---

## 2. Tech Stack

| Component | Keuze | Reden |
|-----------|-------|-------|
| Framework | **Laravel 12** | Nieuwste stable, Octane-ready |
| PHP | **8.4** | Nieuwste features, performance |
| Database | **MySQL 8** | Consistent met KBPM-projecten |
| Auth | **Laravel Sanctum** | API tokens voor SPA + mobile |
| OAuth | **Laravel Socialite** | Google login |
| WebSocket | **Laravel Reverb** | Native, geen Pusher nodig |
| Payments | **Stripe** | Connect (payouts) + Payment Intents (escrow) + iDEAL |
| Testing | **Pest** | Moderne syntax, beter dan PHPUnit |
| File storage | **S3** (of lokaal in dev) | Signed URLs voor profielfoto's |
| KYC | **Veriff of Onfido** | Async webhook voor ID-verificatie |

---

## 3. Datamodel

```
users
├── id, uuid, email, password, role (HAGEE|HAGU), email_verified_at
├── google_id (nullable), remember_token, timestamps
└── softDeletes

profiles (polymorphic)
├── id, user_id, type (hagee|hagu)
├── first_name, last_name, date_of_birth, phone
├── bio, tagline, interests (json), vibe_tags (json)
├── photo_url, photos (json), cover_image_url
├── response_time_label, is_verified, kyc_status
├── stripe_account_id (hagu), payout_settings (json)
└── timestamps

services
├── id, name, slug, description, base_duration_minutes, base_price_cents
├── is_active, timestamps

hagu_services (pivot)
├── hagu_profile_id, service_id
├── custom_price_cents, custom_duration_minutes
└── timestamps

availability_slots
├── id, hagu_profile_id
├── day_of_week (0-6), start_time, end_time
├── is_recurring, specific_date (nullable)
└── timestamps

bookings
├── id, uuid, booking_number (unique)
├── hagee_profile_id, hagu_profile_id, service_id
├── scheduled_date, scheduled_start_time, scheduled_end_time
├── duration_hours, vibe, message
├── amount_cents, platform_fee_cents, payout_cents
├── status (draft → pending_payment → escrow_held → accepted/declined/expired → confirmed → completed → reviewed → paid_out)
├── payment_intent_id, stripe_charge_id
├── accepted_at, declined_at, completed_at, payout_released_at
├── cancellation_reason, cancelled_by
└── timestamps

booking_status_history
├── id, booking_id, from_status, to_status
├── changed_by (user_id), notes
└── created_at

chat_threads
├── id, uuid, booking_id (unique)
├── hagee_profile_id, hagu_profile_id
├── last_message_at, hagee_unread_count, hagu_unread_count
└── timestamps

chat_messages
├── id, thread_id, sender_profile_id, sender_type (hagee|hagu)
├── body, type (text|image|system), metadata (json)
├── read_at, created_at

reviews
├── id, booking_id, reviewer_profile_id, reviewee_profile_id
├── rating_respectful, rating_conversation, rating_on_time (1-5)
├── comment, is_visible
└── timestamps

payouts
├── id, hagu_profile_id, stripe_payout_id
├── amount_cents, status (pending|paid|failed)
├── period_start, period_end, processed_at
└── timestamps

payment_methods
├── id, profile_id, stripe_payment_method_id
├── type (card|ideal|apple_pay), last_four, brand
├── is_default, expires_at
└── timestamps

uploads
├── id, profile_id, disk, path, url
├── type (avatar|cover|gallery|document|chat)
├── mime_type, size_bytes, is_approved
└── timestamps
```

---

## 4. API Endpoints (v1, JSON:API)

### Auth
| Method | Endpoint | Beschrijving |
|--------|----------|--------------|
| POST | `/api/v1/auth/register` | Registreer met email/password + role |
| POST | `/api/v1/auth/login` | Login, returns Sanctum token |
| POST | `/api/v1/auth/logout` | Revoke token |
| POST | `/api/v1/auth/forgot-password` | Stuur reset-link |
| POST | `/api/v1/auth/reset-password` | Reset met token |
| GET | `/api/v1/auth/google/redirect` | OAuth redirect |
| GET | `/api/v1/auth/google/callback` | OAuth callback |

### Onboarding (draft opslag per stap)
| Method | Endpoint | Beschrijving |
|--------|----------|--------------|
| POST | `/api/v1/onboarding/hagee` | Sla HAGEE onboarding op (6 stappen) |
| POST | `/api/v1/onboarding/hagu` | Sla HAGU onboarding op (9 stappen) |
| GET | `/api/v1/onboarding/draft` | Haal huidige draft op |

### Profiles
| Method | Endpoint | Beschrijving |
|--------|----------|--------------|
| GET | `/api/v1/profiles/me` | Eigen profiel |
| PATCH | `/api/v1/profiles/me` | Update eigen profiel |
| GET | `/api/v1/companions` | Browse HAGU's (filters: vibe, interests, availability) |
| GET | `/api/v1/companions/{id}` | Detail HAGU profiel |

### Bookings
| Method | Endpoint | Beschrijving |
|--------|----------|--------------|
| POST | `/api/v1/bookings` | Maak booking (draft) |
| GET | `/api/v1/bookings` | Lijst eigen bookings |
| GET | `/api/v1/bookings/{id}` | Detail booking |
| POST | `/api/v1/bookings/{id}/pay` | Start payment intent |
| POST | `/api/v1/bookings/{id}/accept` | HAGU accepteert |
| POST | `/api/v1/bookings/{id}/decline` | HAGU weigert |
| POST | `/api/v1/bookings/{id}/cancel` | Annuleer (met reden) |
| POST | `/api/v1/bookings/{id}/reschedule` | Stel nieuwe datum/tijd voor |
| POST | `/api/v1/bookings/{id}/complete` | Markeer als voltooid (na meetup) |

### Chat
| Method | Endpoint | Beschrijving |
|--------|----------|--------------|
| GET | `/api/v1/threads` | Lijst threads |
| GET | `/api/v1/threads/{id}` | Thread detail + messages |
| POST | `/api/v1/threads/{id}/messages` | Stuur bericht |
| WS | `/chat/{threadId}` | Reverb WebSocket voor real-time |

### Availability
| Method | Endpoint | Beschrijving |
|--------|----------|--------------|
| GET | `/api/v1/availability` | Eigen slots |
| PUT | `/api/v1/availability` | Bulk update slots |
| GET | `/api/v1/companions/{id}/availability` | Publieke availability |

### Reviews
| Method | Endpoint | Beschrijving |
|--------|----------|--------------|
| POST | `/api/v1/bookings/{id}/review` | Plaats review |
| GET | `/api/v1/reviews/pending` | Openstaande reviews |
| GET | `/api/v1/companions/{id}/reviews` | Reviews van HAGU |

### Payments & Earnings
| Method | Endpoint | Beschrijving |
|--------|----------|--------------|
| GET | `/api/v1/earnings` | HAGU earnings overzicht |
| GET | `/api/v1/transactions` | Transactiehistorie |
| POST | `/api/v1/payouts` | Start payout (na 2u release) |
| GET | `/api/v1/payment-methods` | Lijst betaalmethoden |
| POST | `/api/v1/payment-methods` | Voeg betaalmethode toe |
| DELETE | `/api/v1/payment-methods/{id}` | Verwijder |

### Uploads
| Method | Endpoint | Beschrijving |
|--------|----------|--------------|
| POST | `/api/v1/uploads` | Genereer signed URL |
| DELETE | `/api/v1/uploads/{id}` | Verwijder bestand |

---

## 5. Booking State Machine

```
draft
  └── pending_payment  (HAGEE start betaling)
        └── escrow_held  (Stripe Payment Intent succeeded, funds reserved)
              ├── accepted  (HAGU binnen 24u accepteert)
              │     └── confirmed  (meetup bevestigd, chat actief)
              │           └── completed  (meetup geweest, wacht op review)
              │                 └── reviewed  (review geplaatst)
              │                       └── paid_out  (payout released na 2u)
              ├── declined  (HAGU weigert)
              │     └── refunded  (escrow terug naar HAGEE)
              └── expired  (24u verstreken zonder acceptatie)
                    └── refunded

cancelled  (door HAGEE of HAGU, met reden)
  └── refunded  (indien escrow al held)
```

**Queue jobs:**
- `ExpirePendingBookings` — draait elke minuut, expired `escrow_held` bookings ouder dan 24u
- `ReleasePayouts` — draait elke minuut, released payouts voor `completed` bookings ouder dan 2u

---

## 6. Real-time (Laravel Reverb)

Channels:
- `private-chat.{threadId}` — nieuwe berichten, typing indicators, read receipts
- `private-booking.{bookingId}` — status updates (accepted, declined, expired, completed)
- `private-user.{userId}` — notificaties (nieuwe booking, review, payout)

Events:
- `MessageSent`
- `BookingStatusUpdated`
- `BookingExpired`
- `PayoutReleased`
- `NewBookingRequest`

---

## 7. Stripe Integratie

### Escrow flow
1. HAGEE maakt booking → status `pending_payment`
2. Frontend roept `POST /bookings/{id}/pay` aan → backend maakt Stripe Payment Intent (capture_method: manual)
3. HAGEE bevestigt betaling in frontend (Stripe.js)
4. Webhook `payment_intent.amount_capturable_updated` → status `escrow_held`
5. HAGU accepteert → status `accepted` → chat wordt actief
6. Na meetup: `POST /bookings/{id}/complete` → status `completed`
7. Queue job na 2u: capture Payment Intent → transfer naar HAGU Stripe Connect account
8. Webhook `transfer.created` → status `paid_out`

### iDEAL
Via Stripe Payment Intent met `payment_method_types: ['ideal']`.

### Apple Pay
Via Stripe Payment Request Button, tokenized via Stripe.js.

---

## 8. KYC / ID-verificatie

- Provider: **Veriff** (goedkoper) of **Onfido** (meer features)
- Flow:
  1. HAGU upload ID + selfie via `POST /uploads` (type: document)
  2. Backend maakt Veriff session aan, returns session URL
  3. HAGU doorloopt verificatie in Veriff UI
  4. Webhook `veriff.session.completed` → update `kyc_status`
- Async, geen blocking in onboarding

---

## 9. Testing (Pest)

Feature tests per endpoint:
- `AuthTest` — register, login, logout, password reset, Google OAuth mock
- `OnboardingTest` — multi-step draft opslag
- `BookingTest` — volledige flow: create → pay → accept → complete → payout
- `ChatTest` — threads, messages, unread counts
- `AvailabilityTest` — CRUD slots
- `ReviewTest` — plaatsen + ophalen
- `PaymentTest` — earnings, transactions, payout flow (Stripe mocked)

Integration tests:
- `BookingFlowIntegrationTest` — happy path end-to-end
- `BookingExpiryTest` — 24u expiry job
- `PayoutReleaseTest` — 2u release job

---

## 10. CI/CD

GitHub Actions workflow:
- PHP 8.4 + MySQL 8 service
- `composer install`
- `php artisan key:generate`
- `php artisan migrate`
- `./vendor/bin/pest --coverage`
- Deploy naar Forge op push naar `main` (via Forge deploy script)

---

## 11. Open vragen / risico's

| Vraag | Opties | Impact |
|-------|--------|--------|
| KYC-provider? | Veriff vs Onfido | Kosten, integratie-complexiteit |
| Escrow expiry? | Nu 24u hardcoded | Moet configureerbaar per HAGU? |
| Chat media? | Text-only of ook foto's | Storage + moderation-behoefte |
| Mobile push? | Nu of later meenemen? | Device tokens, APNs/FCM |

---

*Laatst bijgewerkt: 2026-08-04*
