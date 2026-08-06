# Hagu API — Implementation Plan

## Doel
Laravel 12 API die alle localStorage-mocks uit haguv2 vervangt.

## Nieuwe repo
- **Naam**: `ka-bell/hagu-api`
- **Stack**: Laravel 12, PHP 8.4, MySQL 8, Pest
- **Deploy**: Laravel Forge server `hagu-api`

## Fasering

### Fase 1 — Foundation (deze branch)
- [x] API-specificatie document (`docs/api/hagu-api-spec.md`)
- [ ] OpenAPI 3.0 YAML spec voor frontend contract
- [ ] Database migrations (volledig schema)
- [ ] Eloquent modellen met relaties
- [ ] Auth controllers (Sanctum + Socialite)
- [ ] Basis booking state machine

### Fase 2 — Core Features
- [ ] Booking CRUD + state transitions
- [ ] Chat threads + messages
- [ ] Availability slots
- [ ] Reviews
- [ ] Stripe Payment Intent integratie (escrow)

### Fase 3 — Real-time & Polish
- [ ] Laravel Reverb WebSocket channels
- [ ] Queue jobs (expiry, payout release)
- [ ] File uploads (S3 signed URLs)
- [ ] KYC webhook (Veriff/Onfido)
- [ ] CI/CD (GitHub Actions)

### Fase 4 — Frontend migratie
- [ ] haguv2: vervang `lib/session.ts` door echte auth
- [ ] haguv2: vervang `lib/hagee-booking-storage.ts` door API calls
- [ ] haguv2: vervang chat mocks door WebSocket + REST
- [ ] haguv2: Stripe.js integratie voor betalingen

## Huidige stap
Deze branch bevat de **specificatie en het datamodel** die als contract dienen tussen frontend en backend. De daadwerkelijke Laravel-code wordt in de nieuwe repo `ka-bell/hagu-api` geschreven.

## Notitie
Omdat deze repo (`haguv2`) de frontend is en de API een aparte repo wordt, bevat deze branch:
1. De volledige API-specificatie
2. Een OpenAPI contract (YAML) voor type-safe frontend-integratie
3. Een migratie-gids voor het vervangen van mocks
