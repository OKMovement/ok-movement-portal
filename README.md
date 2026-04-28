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

That's it. No env vars are required for the public site.

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
