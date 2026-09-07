# OK Movement — Next.js

This is the public OK Movement site exported from Replit as a stand-alone Next.js 15 (App Router) project.

It is the same React/TypeScript/Tailwind v4 codebase as the original Vite version, restructured to run on Next.js so it can be deployed to Vercel, Netlify, or any Node.js host.

## What's inside

- **Next.js 15** with the App Router (`app/`)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **shadcn/ui** components (`src/components/ui/`)
- **Framer Motion**, **lucide-react**, **react-pdf**, **embla-carousel**, **react-hook-form + zod**, etc.
- **Poppins** font loaded via `next/font/google`

## Routes

| URL                        | Source                                       |
| -------------------------- | -------------------------------------------- |
| `/`                        | `app/page.tsx` → `<HomeHero />`              |
| `/home`                    | `app/home/page.tsx`                          |
| `/home/our-movement`       | `app/home/our-movement/page.tsx`             |
| `/home/media-gallery`      | `app/home/media-gallery/page.tsx`            |
| `/home/get-involved`       | `app/home/get-involved/page.tsx`             |
| `/home/upcoming-events`    | `app/home/upcoming-events/page.tsx`          |
| `/home/contact`            | `app/home/contact/page.tsx`                  |
| `/home/about/[slug]`       | `app/home/about/[slug]/page.tsx`             |
| 404                        | `app/not-found.tsx`                          |

The Wouter `<Switch>`/`<Route>` setup was replaced by Next.js file-system routing. The dynamic route `/home/about/[slug]` uses Next.js `notFound()` if the slug isn't in `aboutPrincipals`.

## Getting started

```bash
# 1. Install dependencies (npm, pnpm, or yarn — pick one)
npm install

# 2. Start the dev server
npm run dev
# → http://localhost:3000

# 3. Production build & run
npm run build
npm run start
```

## Deploy to Vercel

1. Push this folder to a new Git repository.
2. In Vercel, import the repo — it'll auto-detect Next.js, no extra configuration needed.
3. Click **Deploy**.

Configure the environment variables in `.env.example` for registration, donations, and admin features.

## Donation payments

Cash donations use hosted checkout from [Paystack](https://paystack.com/docs/payments/accept-payments/#redirect) or [Flutterwave Standard](https://developer.flutterwave.com/v3.0/docs/flutterwave-standard-1). The donor chooses a provider, the server initializes the transaction, and the donor completes payment on that provider’s page. The site never receives card, PIN, OTP, or bank account credentials.

- Set `PAYSTACK_SECRET_KEY` in `.env.local` and your deployment environment. An `sk_test_…` key creates test transactions; replace it with an `sk_live_…` key only after testing. Never expose this variable with a `NEXT_PUBLIC_` prefix.
- Set `APP_BASE_URL` to the public site origin in production. Paystack returns donors to `/home/donations/payment`.
- In Paystack Dashboard → Settings → API Keys & Webhooks, set the live and test webhook URL to `https://YOUR_DOMAIN/api/donations/paystack/webhook`. The endpoint validates Paystack’s HMAC-SHA512 signature and then re-verifies the transaction.
- Set `FLUTTERWAVE_SECRET_KEY` for Flutterwave Standard checkout. Set a separate random `FLUTTERWAVE_SECRET_HASH`, enter that same hash in Flutterwave Dashboard → Webhooks, and use `https://YOUR_DOMAIN/api/donations/flutterwave/webhook` as the webhook URL.
- Restart the server after changing environment variables and configure the same variables on the deployment host.

Payment attempts are stored in MongoDB’s `donations` collection. Callbacks and signed webhooks trigger server-side verification of the reference, amount, currency, donor email, and environment before marking a donation paid. Admin → Donations shows the selected provider with paid, pending, or failed attempts and existing donation pledges.

Run `npm run typecheck` after changes. Complete test payments with both providers and confirm webhook delivery before switching to live secret keys.

## Notes on the migration from Vite

- All client-only components (everything in `src/components/` and `src/hooks/`) are marked with `"use client"` because they use React state, effects, refs, or browser APIs. Page wrappers in `app/` remain server components and import the client components.
- `import.meta.env.BASE_URL` is no longer used. If you need to host under a subpath, set `basePath` in `next.config.ts`.
- Three image imports that used the `@assets/` Vite alias (`For_Hero_Section.png`, `Peter.png`, `Kwankwaso.png`) were copied into `public/` and the imports were swapped for plain string paths.
- Wouter was removed. The single `useParams()` call in the about-principal route was replaced by Next.js dynamic-route `params`.
- All Replit-specific Vite plugins (`@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`, `@replit/vite-plugin-runtime-error-modal`) were dropped.
- The workspace dependency `@workspace/api-client-react` was unused in `ok-movement` and was dropped from the dependency list.

## Project structure

```
ok-movement-nextjs/
├── app/
│   ├── globals.css           # Tailwind v4 + theme tokens + custom keyframes
│   ├── layout.tsx            # Root layout (Poppins font, metadata, viewport)
│   ├── page.tsx              # Home (/)
│   ├── not-found.tsx
│   └── home/
│       ├── page.tsx
│       ├── about/[slug]/page.tsx
│       ├── contact/page.tsx
│       ├── get-involved/page.tsx
│       ├── media-gallery/page.tsx
│       ├── our-movement/page.tsx
│       └── upcoming-events/page.tsx
├── public/                   # Static assets (favicon, images, PDFs, logos…)
├── src/
│   ├── components/
│   │   ├── coming-soon/      # Coming-soon screen + PDF preview modal
│   │   ├── home/             # All home/landing-page sections
│   │   ├── ui/               # shadcn/ui primitives
│   │   └── social-icons.tsx
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   └── lib/
│       └── utils.ts          # cn() helper
├── next.config.ts
├── postcss.config.mjs        # @tailwindcss/postcss
├── tsconfig.json             # @/* → ./src/*
├── package.json
└── README.md
```
