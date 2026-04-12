# RNB UI Migration Notes

This repository currently contains static HTML reference screens for a crypto/P2P trading product. The goal is to preserve the existing visual design while moving toward a maintainable application architecture.

## Decision

We are using a hybrid Next.js approach instead of:

- keeping the product as plain standalone HTML forever
- rewriting the entire UI into a heavy client-side app

The working rule is:

- keep the current HTML as the visual source of truth
- migrate page markup with minimal structural changes
- add framework features only where the product needs application behavior

## Why Not Pure HTML

Direct HTML is useful for fast prototyping and exact visual preservation, but it becomes difficult to manage when the product needs:

- authentication and protected routes
- form handling and validation
- API integration
- layouts shared across pages
- reusable components
- live data and interactive state
- long-term maintainability

Static HTML alone does not guarantee production performance either. The current screens repeat CDN Tailwind setup and page-level theme config, which is fine for prototypes but not ideal for a real app.

## Why Not A Full Rewrite

A full framework rewrite usually causes design drift:

- spacing changes
- typography shifts
- altered hierarchy
- premature abstraction of components
- inconsistent recreation of the original pages

That is the main risk we want to avoid.

## Recommended Approach: Hybrid Next.js

Hybrid Next.js means:

- render most pages on the server as HTML-first pages
- preserve the current markup and Tailwind-driven look as closely as possible
- use client components only for interactive parts

This gives us:

- file-based routing
- layouts
- server rendering
- API routes / route handlers
- auth integration
- forms and mutations
- selective hydration instead of making the whole app a client SPA

## Rendering Strategy

### Server-rendered by default

These pages can stay mostly server-rendered:

- splash
- login shell
- register shell
- market overview
- assets page
- merchant profile
- settings shell
- notifications list shell

### Client-side only where needed

These parts should become client components:

- countdown timers
- buy/sell toggles
- tabs and local filters
- chat/message input
- payment method switches
- form validation
- live notifications polling

## Migration Rules

For each screen:

1. Copy the structure into Next.js with minimal markup changes.
2. Make the page visually match the HTML reference.
3. Verify the result before refactoring.
4. Only then extract shared components.

Do not redesign while migrating.

## Proposed Route Mapping

- `13.html` -> `/splash`
- `12.html` -> `/login`
- `14.html` -> `/register`
- `1.html` -> `/p2p`
- `2.html` -> `/p2p/merchant/[id]`
- `3.html` -> `/p2p/post-ad`
- `4.html` -> `/p2p/order/[id]`
- `5.html` -> `/p2p/buy`
- `6.html` -> `/assets`
- `7.html` -> `/markets`
- `8.html` -> `/payment-methods`
- `9.html` or `10.html` -> `/notifications`
- `11.html` -> `/settings`

## Current Implementation Start

This repo now includes:

- a Next.js app shell
- shared theme tokens and base styles
- copied HTML references under `public/reference-designs/`
- an initial migrated splash screen at `/splash`

## Brand Direction

`CoinCash` is the canonical product name for the Next.js migration. Any remaining `KINETIC` naming in preserved reference HTML should be treated as legacy prototype branding and replaced only when that page is migrated natively.

## Recommended Next Steps

1. Move repeated theme values into one Tailwind config and one global stylesheet.
2. Migrate the login and register pages first, then replace the remaining reference-backed routes one by one.
3. Extract shared layout primitives only after the native pages visually match the originals.
4. Add real navigation and route handoff so the flow works without manual URL entry.
5. Add real data and auth only after the visual migration is stable.

## Development

Install dependencies:

```bash
bun install
```

Run the dev server:

```bash
bun run dev
```

Run lint:

```bash
bun run lint
```

## Dev Login Credentials (Netlify Variables)

The login page validates against server-side environment variables.

Set these in Netlify for your site:

- `DEV_LOGIN_EMAIL`
- `DEV_LOGIN_PASSWORD`

Netlify dashboard path:

1. Site settings
2. Environment variables
3. Add both variables above

Flow behavior after setup:

- Register submit -> redirects to `/login?registered=1`
- Login submit with matching env credentials -> redirects to `/markets`
- Login submit with wrong credentials -> stays on `/login` and shows an error

## Verification Notes

At this stage the implementation is an initial scaffold, not a full migration. The reference HTML remains available in `public/reference-designs/` so every migrated page can be checked against the original.
