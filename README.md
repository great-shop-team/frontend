# WEARLY (Great Shop)

A modern e-commerce frontend built with Next.js App Router, TypeScript, SCSS, Tailwind CSS, and Redux Toolkit.

## Project overview

The codebase separates **routes**, **features**, **widgets**, and **global state**. Pages in `app/` stay thin; business logic lives in `features/`; reusable layout blocks live in `widgets/`.

## Stack

- Next.js App Router
- React 19 + TypeScript
- SCSS modules + global styles
- Tailwind CSS (utilities)
- Redux Toolkit + RTK Query + redux-persist

## Project structure

```
src/
├── app/                        # Routes and layouts (Next.js App Router)
│   ├── layout.tsx              # Root shell: Header, Footer, Providers
│   ├── providers.tsx           # Redux Provider + AuthBootstrap
│   ├── (account)/              # Protected user routes (group does not affect URL)
│   │   └── profile/            # /profile
│   ├── (auth)/                 # Auth routes (group does not affect URL)
│   │   ├── login/              # /login
│   │   ├── registration/       # /registration
│   │   ├── verify/             # /verify
│   │   └── get-code/           # /get-code
│   ├── (public)/               # Public pages
│   │   └── page.tsx            # Home page /
│   └── (product)/              # Product pages
│       └── product-card/       # /product-card
│
├── features/                   # Business features (logic + UI)
│   ├── auth/
│   │   ├── hooks/              # useAuth, useSessionEmail, useAutoLogin
│   │   ├── lib/                # validation, normalizeEmail, pendingAuth, …
│   │   └── ui/
│   │       ├── LoginForm/      # full login form (pages + overlay)
│   │       ├── RegisterForm/   # full registration form
│   │       ├── AuthPanel/      # verify / get-code / welcome steps
│   │       ├── AuthShell/      # shared 60/40 layout
│   │       ├── AuthFlow/       # overlay view switcher
│   │       └── AuthBootstrap.tsx
│   ├── profile/
│   │   └── ui/ProfileForm/     # Profile page UI (tabs, personal data, orders)
│   └── product-card/
│       └── ui/ProductCardPage/
│
├── widgets/                    # Composite UI blocks used across pages
│   ├── Header/                 # Top bar: nav, account, wishlist, cart
│   ├── Footer/
│   ├── MyAccount/              # Account icon + auth overlay
│   ├── Navigation/
│   ├── Logo/
│   ├── HeroBanner/
│   ├── ProductShowcase/
│   ├── ShoppingBag/
│   ├── WishList/
│   └── …
│
├── store/                      # Global state and API
│   ├── store.ts                # Store config, persist, RootState / AppDispatch types
│   ├── api.ts                  # RTK Query base API (base URL, auth headers)
│   ├── types.ts                # Shared API TypeScript types
│   ├── endpoints/              # RTK Query endpoints by domain
│   │   ├── authEndpoints.ts
│   │   ├── categoriesEndpoints.ts
│   │   └── profilesEndpoints.ts
│   └── slices/                 # Redux slices
│       ├── userSlice.ts        # Auth state (user, token, authEmail)
│       ├── cartSlice.ts        # Cart (persisted)
│       ├── wishlistSlice.ts    # Wishlist (persisted)
│       └── filterSlice.ts
│
├── styles/                     # Global SCSS, variables, typography
└── data/                       # Static JSON for UI mocks
```

## Where to put new code

| Task                       | Location                                 |
| -------------------------- | ---------------------------------------- |
| New page / route           | `src/app/<route>/page.tsx`               |
| Feature UI                 | `src/features/<feature>/ui/`             |
| Feature helpers (no React) | `src/features/<feature>/lib/`            |
| Feature hooks              | `src/features/<feature>/hooks/`          |
| Reusable layout block      | `src/widgets/<name>/`                    |
| Shared global state        | `src/store/slices/<name>.ts`             |
| Backend API call           | `src/store/endpoints/<name>Endpoints.ts` |

### Feature folder convention

Each feature typically follows this layout:

```
features/<name>/
├── ui/       # React components
├── lib/      # Pure functions, validation, constants
└── hooks/    # Custom React hooks (optional)
```

Examples in this repo:

- `features/auth/lib/validation.ts` — form validation rules
- `features/auth/hooks/useAuth.ts` — logout, selectors wrapper
- `features/profile/ui/ProfileForm/` — profile screen

Cart and wishlist are stored in `store/slices/`, not in `features/`, because they are shared across the whole app.

## Auth UI: `LoginForm/` vs `AuthPanel/`

Auth screens are split by **role**, not by accident.

### Folder roles

| Path                                | What lives here                                                          | Examples                                                   |
| ----------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------- |
| `ui/LoginForm/`, `ui/RegisterForm/` | Full auth forms (email, password, social buttons). Own layout SCSS.      | `LoginForm`, `RegisterForm`                                |
| `ui/AuthPanel/`                     | Short step panels for verification flow. Shared `AuthPanel.module.scss`. | `VerifyEmailForm`, `GetVerifiedForm`, `WelcomeAbroadPanel` |
| `ui/AuthShell/`                     | 60/40 layout wrapper (blur + white panel) for pages and overlay          | `AuthShell`                                                |
| `ui/AuthFlow/`                      | Switches between login → register → verify → welcome inside overlay      | `AuthFlow`                                                 |
| `ui/AuthInput/`                     | Reusable styled input for all auth forms                                 | `AuthInput`                                                |
| `ui/AuthBootstrap.tsx`              | Restores session from `localStorage` on app load                         | —                                                          |

**Rule of thumb:** if it is a full sign-in / sign-up screen → `LoginForm/` or `RegisterForm/`. If it is a small step in email verification → `AuthPanel/`.

### Two entry points, same components

The same forms are reused in two places:

1. **Standalone pages** — `app/(auth)/login`, `/registration`, `/verify`, `/get-code`  
   Page wraps a form in `<AuthShell mode="page">` and handles navigation with `router.push(...)`.

2. **Header overlay** — `widgets/MyAccount` opens `<AuthShell mode="overlay">` + `<AuthFlow>`.  
   `AuthFlow` switches views (`login` \| `register` \| `verify` \| `get-code` \| `welcome`) without changing the URL.

```
MyAccount (click icon)
  └── AuthShell (overlay)
        └── AuthFlow
              ├── LoginForm / RegisterForm     ← full forms
              └── AuthPanel/*                  ← verify / welcome steps
```

When adding a new auth step, decide first: full form or short panel — then pick the folder.

### Auth flow (registration → login)

```
RegisterForm → save pending auth (sessionStorage)
            → VerifyEmailForm (AuthPanel) → activate API
            → useAutoLogin (retry login)
            → WelcomeAbroadPanel → user is logged in
```

Login outside this flow goes through `LoginForm` directly.

### Token and session (do not duplicate this logic)

Tokens are managed in a few fixed places. **Do not** write `localStorage.setItem('accessToken', …)` elsewhere — extend one of these instead:

| File                                | Responsibility                                                                                                             |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `LoginForm.tsx`                     | On successful login: save `accessToken`, `refreshToken`, `userEmail` → `localStorage`; `setToken` + `setAuthEmail` → Redux |
| `hooks/useAutoLogin.ts`             | Auto-login after email activation (same storage + Redux updates)                                                           |
| `hooks/useAuth.ts` → `logoutUser()` | Clears tokens, `userEmail`, Redux, RTK Query cache                                                                         |
| `ui/AuthBootstrap.tsx`              | On app load: reads `accessToken` + `userEmail` from `localStorage` into Redux; fetches current user                        |
| `store/api.ts`                      | `prepareHeaders` reads `accessToken` from `localStorage` for API requests                                                  |
| `hooks/useSessionEmail.ts`          | UI helper: email + session state for header initials (reads Redux + `localStorage`)                                        |

**Storage keys:** `accessToken`, `refreshToken`, `userEmail` (all in `localStorage`).  
Pending credentials during register→verify live in `sessionStorage` via `lib/pendingAuth.ts` only.

Redux `user` slice holds `token`, `authEmail`, `user` — kept in sync with `localStorage` by the files above, not by individual form components.

## widgets vs features

- **widgets/** — visual building blocks without owning a full user flow (Header, Footer, MyAccount).
- **features/** — complete user-facing flows with business logic (login, registration, profile).

A widget may import from a feature (e.g. `MyAccount` opens `AuthFlow`), but features should not import from each other. Shared code goes to `widgets/` or a dedicated `lib/` inside one feature.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=https://wearlyshop.onrender.com
```

This file is gitignored. Update it when the backend URL changes.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve built app
- `npm run lint` — ESLint
- `npm run format` — Prettier

## Redux Toolkit + RTK Query

Key files:

- `src/store/store.ts` — store, persist config, `RootState` / `AppDispatch` types
- `src/store/api.ts` — RTK Query base API
- `src/store/endpoints/authEndpoints.ts` — auth API hooks
- `src/store/slices/userSlice.ts` — user / auth slice
- `src/app/providers.tsx` — `<Provider>` + `AuthBootstrap`

### Fetch data with RTK Query

```tsx
import { useGetCurrentUserQuery } from '@/store/endpoints/authEndpoints';

const { data, error, isLoading } = useGetCurrentUserQuery();
```

### Read and update Redux state

```tsx
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/userSlice';
import { selectCurrentUser } from '@/store/slices/userSlice';

const dispatch = useDispatch();
const user = useSelector(selectCurrentUser);

dispatch(logout());
```

Auth-specific logic is wrapped in `useAuth()` — prefer that hook in UI components.

## How to extend the app

### 1. Add a route

Create `src/app/<route>/page.tsx`. Use route groups like `(auth)` only when you need a shared layout — they do not appear in the URL.

### 2. Add a feature

1. Create `src/features/<feature>/ui/`
2. Add helpers in `lib/` and hooks in `hooks/` if needed
3. Keep the page in `app/` thin — import the feature component

### 3. Add API + state

1. Add types to `src/store/types.ts` if needed
2. Create `src/store/endpoints/<feature>Endpoints.ts` with `api.injectEndpoints`
3. Add a slice in `src/store/slices/` only when multiple pages need the same client state

### Example: reviews page

```
src/app/reviews/page.tsx
src/features/reviews/ui/ReviewsPage.tsx
src/features/reviews/lib/formatReview.ts
src/store/endpoints/reviewsEndpoints.ts
```

## Rules

- Do not import one feature from another. Extract shared UI to `widgets/` or shared helpers to the feature that owns them.
- Pages in `app/` should not contain heavy business logic.
- Prefer SCSS modules for component styles; use Tailwind for small utility classes.
- Avoid deep relative imports (`../../../../`). Use the `@/` alias (`@/features/auth/...`).

## Git workflow

- Work in branches from `main` or `develop`.
- Branch names: `feature/…`, `fix/…`, `chore/…`, `hotfix/…`
- Run `npm run lint` before opening a PR.

## Useful links

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- [Tailwind CSS](https://tailwindcss.com/docs)
