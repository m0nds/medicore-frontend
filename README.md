# Medicore

A role-based hospital management web app. Patients, doctors, receptionists, and admins each get their own portal — served from a dedicated subdomain in production and a path prefix in local development — behind a shared authentication and data layer.

Built with React 19, TanStack Router (file-based), TanStack Query, Tailwind CSS v4, and shadcn/ui.

## Features

- **Four role portals** — `patient`, `doctor`, `receptionist`, and a delicate, separately-gated `admin` portal, each with its own layout and route guards.
- **Subdomain-aware routing** — the same route tree renders as `patient.medicore.app/dashboard` in production and `localhost/patient/dashboard` in development, via TanStack Router's location `rewrite`.
- **Type-safe data layer** — a thin Axios service per module, wrapped by reusable TanStack Query hooks with a central query-key factory.
- **httpOnly refresh-token auth** — access token in memory (Zustand), refresh token in an httpOnly cookie, with a single-flight refresh interceptor.
- **shadcn/ui component library** — Radix-based components (Geist font, Lucide icons) themed with an OKLCH design-token system and dark mode.
- **Forms** — `react-hook-form` + Zod schemas with the shadcn `Field` primitives.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | React 19 + TypeScript (strict), Vite 8 |
| Routing | TanStack Router (file-based, code-split) |
| Server state | TanStack Query + TanStack Table |
| Client state | Zustand |
| Styling | Tailwind CSS v4, shadcn/ui, `tw-animate-css` |
| Forms & validation | react-hook-form, Zod |
| HTTP | Axios (shared instance with auth interceptors) |
| Notifications | Sonner |
| Package manager | pnpm |

## Getting started

### Prerequisites

- Node.js >= 20
- pnpm >= 10

### Installation

```bash
pnpm install
```

### Environment

Create a `.env` file in the project root:

```bash
# Base URL of the backend API
VITE_BASE_URL=https://api.medicore.app

# Optional: non-obvious hostname for the admin portal (defaults to "admin")
VITE_ADMIN_SUBDOMAIN=admin
```

> [!IMPORTANT]
> The API must send the refresh token as an httpOnly cookie and, because requests use `withCredentials`, respond with a specific `Access-Control-Allow-Origin` (not `*`) plus `Access-Control-Allow-Credentials: true`.

### Develop

```bash
pnpm dev
```

> [!NOTE]
> Locally there is no subdomain, so portals are reached by path prefix: `/(patient|doctor|receptionist|admin)/...`. In production the subdomain carries the role and the prefix is hidden from the address bar.

### Build

```bash
pnpm build     # type-check (tsc -b) + production build
pnpm preview   # preview the production build
```

## Available scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Type-check and build for production |
| `pnpm preview` | Serve the production build locally |
| `pnpm lint` | Run ESLint |

## Project structure

```
src/
├── assets/              Static assets
├── components/          Shared components
│   ├── ui/              shadcn/ui primitives (+ date-picker, data-table)
│   ├── app-sidebar.tsx  Role-aware navigation sidebar
│   └── portal-shell.tsx Sidebar + header chrome for portals
├── hooks/               TanStack Query hooks, one file per module (useDoctor, …)
├── lib/
│   ├── router.tsx       Router creation + subdomain rewrite wiring
│   ├── routerContext.ts Typed router context (DI)
│   ├── queryClient.ts   Shared QueryClient
│   ├── queryKeys.ts     Per-module query-key factories
│   ├── portal.ts        Subdomain ⇄ role mapping + location rewrite
│   ├── guards.ts        Role guards for route beforeLoad
│   └── utils.ts         cn() helper
├── pages/               Page components (rendered by routes)
├── routes/              File-based route tree (see Routing below)
├── schemas/             Zod schemas per module
├── services/            Axios service layer, one file per module
│   └── service.ts       Shared Axios instance + auth interceptors
├── stores/              Zustand stores (auth.store.ts)
├── styles/              Tailwind v4 entry + design tokens
├── types/               TypeScript types, one file per module
├── App.tsx              Providers (Query, Router, Tooltip, Toaster)
└── main.tsx             App entry
```

## Routing and portals

Routes are file-based under `src/routes/` and generated into `routeTree.gen.ts`.

```
routes/
├── __root.tsx                 Root route + typed context
├── index.tsx                  Redirects by auth/role
├── _auth/                     Public pages (login, …) — no auth
└── _authenticated/            Auth gate (redirects to /login)
    ├── patient/               Role layout + guard → /patient/*
    ├── doctor/                Role layout + guard → /doctor/*
    ├── receptionist/          Role layout + guard → /receptionist/*
    └── admin/                 Role-gated, code-split → /admin/*
```

- `_authenticated/route.tsx` blocks unauthenticated users; each role folder adds a `requireRole` guard so users only reach their own portal.
- `lib/portal.ts` resolves the current portal from the hostname and builds the `rewrite` that strips/adds the `/{portal}` prefix — giving clean subdomain URLs in production and path-prefixed URLs in development.
- The `admin` portal has no links from other portals, sits on its own (optionally obscured) subdomain, and is split into its own bundle.

## Data layer

Each domain follows the same three-layer shape:

1. **`services/<module>.service.ts`** — thin, typed Axios calls (queries forward the query key and abort `signal`).
2. **`lib/queryKeys.ts`** — a key factory per module (`<module>Keys`) with broad `lists`/`details` keys for invalidation and precise `list(params)`/`detail(id)` keys for reads.
3. **`hooks/use<Module>.ts`** — reusable `useQuery`/`useMutation` hooks; mutations invalidate the relevant keys, and detail hooks accept `{ enabled }` for gated fetches (e.g. modals).

```tsx
// List with live params (refetches per param combination)
const { data } = useAppointments({ page, limit })

// Detail gated on a modal being open
const { data } = useAppointment(id, { enabled: open })
```

## Authentication

- On login, the access token is stored in memory via Zustand (`stores/auth.store.ts`); only `user` and `isAuthenticated` are persisted.
- The refresh token lives in an httpOnly cookie owned by the API and is never read client-side.
- `services/service.ts` attaches the access token, and on a `401` performs a single-flight refresh (`authService.refreshToken`) before retrying the original request; if refresh fails, the session is cleared and the user is redirected to `/login`.
