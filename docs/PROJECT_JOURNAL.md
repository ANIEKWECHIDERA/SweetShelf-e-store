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

### 2026-04-10
- Refreshed the storefront visual system using shadcn-inspired component patterns after reviewing the referenced food-delivery Figma layout.
- Updated shared UI primitives toward shadcn-style `button`, `badge`, `card`, `input`, and `separator` behavior while keeping SweetShelf brand tokens.
- Redesigned the storefront home page with a brighter promo bar, richer hero, more app-like merchandising cards, and stronger cart entry points.
- Added a dedicated `/cart` page where customers can increase quantity, decrease quantity, remove individual items, or clear the cart entirely.
- Upgraded the product detail flow so quantity selection works before adding to cart, with a direct path into the cart page.
- Added a public preview helper script `npm run dev:public` and changed app dev servers to bind on `0.0.0.0` for easier testing across devices.
- Updated Playwright coverage to match the redesigned storefront entry flow.
- Tightened the storefront Playwright selector so the smoke test targets the header cart link explicitly after the new `Manage Cart` entry was introduced.
- Reworked the storefront header to follow the requested arrangement more closely: store name on the left, centered menu links, cart access on the right, and a create-account slot that swaps into a profile block when a demo signed-in session exists.
- Replaced the older cart snapshot block with a segmented green cart summary strip inspired by the supplied reference image, and mirrored that summary treatment on the dedicated cart page.
- Expanded the mock catalogue with more cakes, pastries, and dessert boxes so the refreshed storefront feels fuller during browsing and mobile review.
- Removed the remaining `SectionCard` wrapper usage from storefront and admin routes so the shared surface now leans on the shadcn-style card primitives consistently.
- Standardized badge copy to reader-friendly labels such as `On Sale`, `New`, `In Stock`, and `Sold Out` instead of exposing underscored internal states in the UI.
- Realigned the Playwright storefront smoke test with the new hero copy and cart trigger after the navigation/header redesign.
- Made the storefront navbar sticky and moved the live cart breakdown into the header so cart status stays visible while browsing.
- Simplified the hero back down to a single full-width content panel by removing the extra featured-product spotlight card and the duplicate cart strip from the hero area.
- Adjusted the storefront smoke test again after the hero simplification changed the featured product from a heading into inline card content.
- Split `Browse Menu`, `Special Offers`, and `Track Order` into dedicated storefront pages while keeping a shared storefront chrome for consistent navigation.
- Added active-page styling in the storefront nav, a cleaner mobile menu collapse, and a cart control that stays compact until items exist and then expands with animation.
- Reduced roundness across the shared UI primitives, increased badge background contrast, and improved the hero search styling so text remains readable against the storefront surfaces.
- Added live product suggestions while typing in the storefront search field and forwarded searches into the dedicated menu page.
- Hid the `Saved Items` navigation entry for signed-out users and updated the saved-items page to show an access prompt unless the demo customer session is present.
- Restored the softer rounded styling across buttons, cards, and inputs after the sharper UI pass felt too aggressive for the pastry brand.
- Added a hero image panel with a direct add-to-cart action and also enabled quick add-to-cart from the hero product callouts and offer cards.
- Hid the vertical scrollbar globally in the storefront shell for a cleaner preview presentation.
- Reworked product badges into tighter chip-style pills with stronger fills and built functional category filter buttons into the menu page.
- Moved the storefront navigation into the shared app layout so the same sticky header now persists on catalogue, product detail, cart, checkout, and the added utility pages.
- Restructured the hero so the cake image sits beside the introduction while the search bar and featured quick-add cards span the full hero width beneath it.
- Tightened the product-card add-to-cart path by binding the CTA explicitly as a button action and keeping it separate from product-detail navigation.
- Reverted the shared-layout navbar experiment back to the earlier storefront-shell navigation, hid horizontal overflow across the app, changed the cart-summary `X` control to clear the cart, and tuned badge padding/button presence after a Playwright UI review.
- Removed the top gap above the promo strip, added empty-state placeholders for no-result menu searches and filters, surfaced cart total directly in the navbar summary, refreshed the product-card and special-offer layout toward a tighter marketplace-style arrangement, and gave product badges stronger filled backgrounds for readability.
- Normalized storefront product imagery to fill each card frame cleanly, added more seeded products, introduced 9-item pagination for menu-heavy views, turned the hero strip below search into a visual best-sellers section, and updated add-to-cart buttons to the softer pill-plus layout from the latest UI reference.
- Reverted product-card purchasing back to a quantity-first flow with plus/minus controls, added an animated add-to-cart confirmation toast that only fires on the actual add action, and increased badge scale so storefront status tags are easier to scan on smaller screens.
- Centered and enlarged badge labels further, tightened best-seller card titles with ellipsis so rows stay aligned, removed unavailable purchase controls entirely, made paginated views scroll back to the top of the list, added lazy-friendly product image placeholders/fallbacks, and reduced the home-page menu and offer rows back to three cards each.
- Replaced text-only image fallbacks with dessert SVG artwork, added a subtle outlined dessert backdrop to the premium hero surfaces, aligned storefront buttons back to the current shared button style, added a working search bar to the special-offers page, hid the pagination previous control on page one, hid the quantity minus control when only one item is selected, and translated the home-page visual language into the track-order experience.
- Removed the stray `commerce-api` `rootDir` restriction that was blocking workspace type/build verification once the shared package graph was re-evaluated, so the repo returns to a clean passing state after the storefront polish.
- Removed an outdated storefront `ignoreDeprecations` TypeScript flag that started failing Next build workers under the current toolchain, keeping the verification pipeline healthy after the latest UI pass.
- Applied the storefront sizing system across shared primitives and key pages: standardized container padding, section spacing, responsive headings/body text, card/button padding, grid gaps, sticky header/content scrolling behavior, touch-target sizing, and persistent horizontal overflow protection across the app shell, storefront shell, cart, checkout, and product detail views.
- Centralized the storefront WhatsApp number into one shared source so layout, storefront shell, product detail, and admin settings all read from the same value, and restored the best-sellers border tint without otherwise changing the current button style direction.
- Prepared the repo for a Netlify storefront demo by adding a root `netlify.toml`, pinning Node `22`, adding targeted web build scripts, documenting the storefront/admin deployment path in `docs/NETLIFY_DEPLOYMENT.md`, and keeping the config on Netlify's current automatic Next.js/OpenNext runtime path rather than pinning a plugin version.
- Captured the current `npm audit` finding in the Netlify deployment guide: the remaining high/critical warnings come through the local `localtunnel` preview helper and should be handled deliberately rather than force-fixed before a production security handoff.

## Commands Used For Verification
- `npm install`
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run build:storefront`
- `npm run build:admin`
- `npm run test:e2e`
- `npm run dev:public`
- `npm audit --audit-level=high`

## What Is Mock-Safe vs Live-Ready
- Mock-safe now:
  - Catalogue rendering
  - Cart persistence
  - Cart management page with quantity updates and item removal
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
