# SweetShelf Project Journal

## Purpose
This document tracks what was built, how it was built, and the decisions made throughout the project. It is intended to be a living implementation log for future contributors and deployment handoff.

## Architecture Summary
- Monorepo with `apps/`, `services/`, and `packages/`.
- `apps/storefront-web`: customer storefront.
- `apps/admin-web`: admin dashboard.
- `services/commerce-api`: checkout, receipt lookup, export, and internal business endpoints.
- `services/notification-worker`: Paystack webhook, email orchestration, and low-stock processing.
- `packages/shared-types`: DTOs, zod schemas, env contracts, and mock domain data.
- `packages/shared-ui`: shared components and styling utilities for both web apps.
- `packages/shared-config`: cross-workspace config artifacts such as tsconfig presets.

## Progress Log
### 2026-04-09
- Initialized the monorepo root with npm workspaces and Turborepo orchestration.
- Generated the two Next.js applications that will power the storefront and admin surfaces.
- Started normalizing both apps into shared workspace packages and service boundaries.
- Added `@sweetshelf/shared-types` for domain models, zod DTOs, env contracts, formatting helpers, and mock seed data.
- Added `@sweetshelf/shared-ui` for shared buttons, badges, inputs, and card shells using the SweetShelf design tokens.
- Built a mock-safe storefront flow with catalogue, product detail, checkout, order success, favourites, and order history pages.
- Built an admin shell with dashboard, orders, products, payments, and settings routes.
- Added `commerce-api` and `notification-worker` Fastify services with checkout, receipt lookup, CSV export, and Paystack HMAC verification scaffolding.
- Added initial Supabase migration scaffolding, a root `.env.example`, and Netlify config stubs for the two web apps.
- Added unit coverage for checkout schema utilities, cart totals, and webhook signature generation.
- Added a Playwright smoke test for storefront navigation and verified it passes locally.

## Commands Used For Verification
- `npm install`
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run test:e2e`

## What Is Mock-Safe vs Live-Ready
- Mock-safe now:
  - Catalogue rendering
  - Cart persistence
  - Checkout redirect flow
  - Order success rendering
  - Admin dashboard routes
  - Unit tests and Playwright smoke coverage
- Live-ready structure, pending real credentials and integration completion:
  - Supabase-backed reads and writes
  - Real Paystack transaction initialization
  - Real webhook persistence and idempotency storage
  - Resend email delivery
  - Sentry wiring
  - Netlify/container deployment

## Developer Notes
- The initial implementation is designed to run safely without live provider keys by falling back to mock-safe adapters and seed data.
- Any server-only secret must stay outside browser bundles. Use the env schemas from `packages/shared-types`.

## Keys Still Needed For Live Integration
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STORE_ID`
- `PAYSTACK_SECRET_KEY`
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ADMIN_EMAIL`
- `NEXT_PUBLIC_APP_URL`
- `SENTRY_DSN`
- `NEXT_PUBLIC_SENTRY_DSN`
- Netlify site configuration for both web apps
- Container/deployment target details for backend services
