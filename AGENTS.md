# prode-mundial

Next.js 16.2.7 App Router + Supabase Auth project. React 19, TypeScript 5, Tailwind v4.

## Read bundled Next.js docs first

This Next.js version is beyond training data — it has breaking changes.
Read `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Known quirks verified from the docs:
- **`proxy.ts` replaces `middleware.ts`** — export `proxy` function, not `middleware`
- **`cookies()` is fully async** — use `await cookies()` everywhere
- **Turbopack is default** — no `--turbopack` or `--turbo` flag needed

## Commands

| Command | What |
|---|---|
| `npm run dev` | Dev server (localhost:3000) |
| `npm run build` | Production build |
| `npm run lint` | ESLint (flat config) |
| `npx tsc --noEmit` | Typecheck (no dedicated script) |

No test framework is configured.

## Supabase Auth

- **Clients:** `src/lib/supabase/client.ts` (browser), `server.ts` (server components/actions), `middleware.ts` (proxy helper)
- **Proxy:** `src/proxy.ts` refreshes session on every request
- **Server actions:** `src/app/actions/auth.ts` — `register`, `login`, `logout`
- Auth pages at `/auth/login` and `/auth/register`; landing at `/`; dashboard at `/dashboard`
- SQL migration for profiles table: `supabase/migrations/00001_create_profiles.sql`

## Conventions

- **Tailwind v4** — config via `@import "tailwindcss"` + `@theme inline` in CSS. No `tailwind.config.*`
- **Path alias:** `@/` → `src/` (set in `tsconfig.json`)
- **ESLint:** flat config (`eslint.config.mjs`) with `core-web-vitals` + `typescript`
