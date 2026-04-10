# SweetShelf Netlify Deployment Guide

This guide prepares the current SweetShelf demo for Netlify. The storefront is the safest public demo target right now because it is mock-safe, visually complete, and does not require live payment, email, or Supabase secrets to browse.

## What Was Prepared

- Added a root `netlify.toml` configured for the storefront demo.
- Kept the Netlify setup aligned with the current automatic Next.js/OpenNext runtime path instead of pinning a runtime plugin version.
- Added `.nvmrc` with Node `22` so Netlify and local builds use a modern runtime.
- Added root scripts for targeted web builds:
  - `npm run build:storefront`
  - `npm run build:admin`

## Storefront Demo Site

Use this setup when creating the main public demo site in Netlify.

1. Push the repo to GitHub, GitLab, or Bitbucket.
2. In Netlify, choose `Add new site` then `Import an existing project`.
3. Select the SweetShelf repository.
4. Leave the base directory as the repository root.
5. Netlify should read `netlify.toml` automatically.
6. Confirm the build settings:
   - Build command: `npm run build:storefront`
   - Publish directory: `apps/storefront-web/.next`
   - Node version: `22`
7. Add environment variables for the demo.
8. Deploy the site.

If Netlify is already configured and failing, check these UI settings:

- Build command: `npm run build:storefront`
- Publish directory: `apps/storefront-web/.next`
- Package directory: preferably leave blank for this monorepo demo deploy; if it is set to `apps/storefront-web`, Netlify will read the app-level `netlify.toml` instead of the root one.
- Base directory: repository root
- Node version: `22`
- Do not use build commands that delete `node_modules` or `package-lock.json`; Netlify already installs dependencies before running the build command.
- Do not use `next build --no-turbo`; Next.js 16 supports `next build`, `next build --turbo`, and `next build --webpack`, but not `--no-turbo`.
- If the build fails with `Cannot find module '../lightningcss.linux-x64-gnu.node'`, make sure the latest lockfile is deployed. The repo now pins `lightningcss` at the workspace root and records the Linux native optional package so Netlify can install the CSS binary needed by Tailwind/Next builds.
- If the build fails with `Cannot find module '@tailwindcss/oxide-linux-x64-gnu'`, make sure the latest lockfile is deployed. The repo now records Tailwind Oxide's Linux native optional package for both Next apps so Netlify can install the Tailwind 4 CSS engine binary.
- The deploy log may show an old UI-installed `@netlify/plugin-nextjs` version. If it does, update it from Netlify's plugin UI or remove the UI-installed plugin and let Netlify's current Next.js runtime detection handle the app.

## Admin Demo Site

For a separate admin demo, create a second Netlify site from the same repository.

Recommended admin settings:

- Base directory: repository root
- Build command: `npm run build:admin`
- Publish directory: `apps/admin-web/.next`
- Node version: `22`
- Next.js runtime: automatic Netlify/OpenNext support

If you prefer using the app folder as the package directory, the existing `apps/admin-web/netlify.toml` can also be used, but the root-level settings above are easier to reason about in this monorepo.

## Demo Environment Variables

For a visual client demo, these can be minimal:

```bash
NEXT_PUBLIC_STORE_ID=store-demo
NEXT_PUBLIC_APP_URL=https://your-storefront-site.netlify.app
```

Live integration still needs the provider keys below before production launch:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PAYSTACK_SECRET_KEY=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
ADMIN_EMAIL=
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
```

## Local Pre-Deploy Checks

Run these from the repository root before deploying:

```bash
npm run lint
npm run build:storefront
npm run test:e2e
```

For a fuller repo check, run:

```bash
npm run build
npm run test
```

## Demo Caveats

- Cart behavior is local and mock-safe.
- Product data is seeded/mock data until Supabase is connected.
- Payment, email, and webhook flows are implemented as service boundaries, but real Paystack and Resend delivery require live keys.
- Backend services are container-friendly and should be deployed separately from Netlify if the client wants the full production workflow.
- `npm audit` currently reports vulnerable `axios` versions through the local `localtunnel` preview helper. Do not run `npm audit fix --force` casually because npm reports that it would apply a breaking localtunnel downgrade; replace or upgrade the preview tunnel deliberately before a production security handoff.
