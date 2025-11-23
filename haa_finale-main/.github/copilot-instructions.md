# Copilot instructions for Home & Auto Assistant (haa_finale)

This file gives concise, actionable guidance for AI coding agents working in this repository.

**Big picture**
- **Framework:** Next.js (App Router, `app/` directory) + TypeScript. See `app/layout.tsx` for top-level providers.
- **State & Data:** Client-side state + server data via Supabase. Client hooks use `createClient()` from `lib/supabase.ts`. Server-side code uses `createServerSupabaseClient()` from `lib/supabase-server.ts` for SSR auth and server requests.
- **Data typing:** `lib/supabase.ts` declares a `Database` type used across hooks to keep typed queries.

**How to run & build (developer workflows)**
- Use the project's package manager (repo contains `pnpm-lock.yaml`) — prefer `pnpm`.
- Common commands (from `package.json`):
  - `pnpm dev` → runs the app locally (`next dev`).
  - `pnpm build` → production build (`next build`).
  - `pnpm start` → start production server (`next start`).
  - `pnpm lint` → run `next lint`.

**Critical environment variables**
- Required (client + server):
  - `NEXT_PUBLIC_SUPABASE_URL` (must be a valid https URL)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Files referencing these: `lib/supabase.ts`, `lib/supabase-server.ts`. Agents should not hardcode keys — use `process.env` checks already present.

**Project-specific conventions & patterns**
- Path alias: `@/` resolves to repo root per `tsconfig.json` (`"@/*": ["./*"]`). Use `@/` imports when adding files.
- Supabase client split:
  - `lib/supabase.ts` exports `createClient()` (browser). Use in client components/hooks.
  - `lib/supabase-server.ts` exports `createServerSupabaseClient()` (server). Use in server components, route handlers, and `lib/auth.ts`.
  - Do NOT call `createServerSupabaseClient()` from client components.
- Provider pattern:
  - `components/providers/supabase-provider.tsx` wraps the app and exposes `useSupabase()`.
  - `app/layout.tsx` mounts `SupabaseProvider`, `QueryProvider` (React Query), and `ThemeProvider`.
- React Query conventions:
  - Hooks live in `hooks/*` (e.g., `hooks/use-supabase-query.ts`). Follow the pattern: `useQuery` for reads, `useMutation` + `invalidateQueries` for writes.
  - Query keys are arrays like `['rooms', homeId]`. When invalidating, use the same array shape.
- UI & component patterns:
  - Dialogs and forms are in `components/dialogs/*` and reuse hooks from `hooks/*`.
  - Most client components include `'use client'` at top and rely on `useSupabase()` for the current user.

**Integration points & external deps**
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`) — typed via `Database` in `lib/supabase.ts`.
- React Query (`@tanstack/react-query`) — central for caching and invalidation.
- UI: Tailwind (`tailwind.config.ts`), Radix components (`@radix-ui/*`), `sonner` for toasts.

**Common code patterns agents should follow**
- When adding data hooks, use the style in `hooks/use-supabase-query.ts`:
  - Use `createClient()` inside the hook for client requests.
  - Use `useSupabase()` to access `user` when creating records.
  - Use `queryClient.setQueryData` for optimistic updates and `invalidateQueries` for eventual consistency.
- When writing server-side auth checks, follow `lib/auth.ts` (use `createServerSupabaseClient()` and `redirect()` from `next/navigation`).
- Preserve the `Database` type shape when changing table fields — many hooks rely on it for Insert/Update types.

**Examples (copyable patterns)**
- Create a client hook that fetches rooms:
  - Follow `useRooms(homeId)` in `hooks/use-supabase-query.ts` — use `queryKey: ['rooms', homeId]` and `enabled: !!homeId`.
- Create a mutation that invalidates queries:
  - Follow `useCreateRoom()` — after success call `queryClient.invalidateQueries({ queryKey: ['rooms', data.home_id] })`.

**Safety & constraints**
- Avoid leaking secrets: never add or commit server keys. The repo already checks for missing/placeholder env values and throws a clear error.
- Keep `use client` only in components that need hooks or state; server components must remain async and use server-only helpers.

If anything in this doc is unclear or you'd like more detail (examples for adding new hooks, auth flows, or testing steps), tell me which section to expand and I will iterate. 
