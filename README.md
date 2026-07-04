# FairShare — Mobile (React Native / Expo)

> The offline-first mobile client for **FairShare**, a group expense-splitting app. Built with **React Native (Expo)** on a feature-first architecture with enforced module boundaries, a reactive local SQLite database, and an idempotent sync layer against the FairShare backend.

![Expo](https://img.shields.io/badge/Expo-SDK%2056-000020)
![React Native](https://img.shields.io/badge/React%20Native-0.85-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6)
![Drizzle](https://img.shields.io/badge/Drizzle-SQLite-C5F74F)

**Backend:** [`meankitmishra/fairshare-backend`](https://github.com/meankitmishra/fairshare-backend) · **Live API:** https://fairshare-backend-production-e54c.up.railway.app

---

## Overview

FairShare lets a group of people track shared expenses, see who owes whom, and settle up — working fully **offline** and syncing cleanly across devices. This repository is the **mobile client**: the screens, the local database, and the sync engine that keeps a phone in agreement with the backend.

The client is built around three commitments:

1. **Offline-first.** The app owns a **reactive local SQLite database** (via Drizzle). Every record uses a client-generated UUID so a phone can create data offline that never collides on sync. Writes queue locally and reconcile with the backend on reconnect.
2. **Clean architecture, enforced.** Code is organized feature-first (mirroring the backend's modules), and a linter rule *enforces* that one feature can't reach into another — the client-side equivalent of the backend's Spring Modulith boundaries.
3. **The right tool per data kind.** App state, server state, and local persistent data are handled by three distinct systems rather than one tangled store.

This client is driven entirely by the backend's API contracts; the two repositories evolve in parallel.

---

## Design principles

- **Feature-first structure mirroring the backend** — `src/features/<module>/` maps to the backend's bounded modules; shared code lives in `src/core/`.
- **Enforced feature boundaries** — `eslint-plugin-boundaries` forbids feature-to-feature imports and forbids `core` from depending on features (no cycles). This is the client's ArchUnit.
- **Three data systems, kept separate** — **Zustand** (app/UI state) · **TanStack Query** (server state, caching, retries) · **Drizzle + expo-sqlite** (local persistent data).
- **Offline-first** — reactive local SQLite, **client-generated UUIDv4** primary keys, a mutation queue + push-before-pull sync, and optimistic UI.
- **Thin routes, thick `src`** — every file under `src/app/` is a route (Expo Router); all logic lives in `src/`, keeping routes free of business logic.
- **Auth-gated navigation** — route-group layouts guard the signed-in and signed-out worlds off the session store.
- **Exact money on the client too** — a TypeScript twin of the backend's integer-minor-unit + largest-remainder money kernel (for optimistic local computation; the server ledger stays authoritative).
- **Strict TypeScript** — `strict` + `noUncheckedIndexedAccess` catch bugs at compile time.

---

## Tech stack

| Area | Choice |
|---|---|
| Framework | **Expo SDK 56** (React Native 0.85, New Architecture) |
| Language | **TypeScript** (strict) |
| Routing | **Expo Router** (file-based) |
| App / UI state | **Zustand** |
| Server state | **TanStack Query** |
| Local database | **Drizzle ORM** + **expo-sqlite** (reactive live queries) |
| Migrations | **drizzle-kit** (bundled via babel-plugin-inline-import + Metro) |
| Client IDs | **expo-crypto** (`randomUUID`) |
| Lint / format | **eslint-config-expo** (flat config) + **Prettier** |
| Boundary enforcement | **eslint-plugin-boundaries** (version-pinned) |
| Secure token storage | **expo-secure-store** *(planned — Auth)* |
| Biometrics | **expo-local-authentication** *(planned — Auth)* |
| Push | **expo-notifications** *(planned)* |
| Distribution | **EAS Build** → TestFlight / Play internal *(planned)* |

> New Architecture is mandatory on SDK 56. Dependencies are audited with `npx expo-doctor`, and volatile dev-tooling is version-pinned.

---

## Architecture

### Feature-first, boundary-enforced

Routes are thin and live under `src/app/`; all logic lives in `src/`. Features mirror the backend's bounded modules, and `eslint-plugin-boundaries` classifies every file as `app` (a route), `core` (the shared kernel), or `feature`, then enforces: **a feature may import `core` and only its own folder — never a sibling feature; `core` may import only `core`.** An illegal cross-feature import fails linting, the same way a cross-module import fails the build on the backend.

### The three data systems

| Data kind | Example | Tool |
|---|---|---|
| App / UI state | "is the user signed in?" | **Zustand** store in `core/session` |
| Server state | backend responses, caching, retries | **TanStack Query** |
| Local persistent data | expenses saved on the phone | **Drizzle ORM** over **expo-sqlite** |

Local queries use Drizzle's **live queries** (`useLiveQuery` with SQLite change listeners), so any screen re-renders automatically when the underlying data changes — the reactive backbone of an offline-first UI.

### Offline-first & sync

Every entity uses a **client-generated UUIDv4** primary key (`expo-crypto`), codified in one place. The client owns a local mutation queue and reconciles with the backend through its delta-sync protocol (`GET /sync?since=` to pull, `POST /sync/mutations` to push, deduplicated by client mutation ID). Changes apply optimistically offline and converge on reconnect, with financial-field conflicts surfaced for user resolution. *(The persistence layer is built; the sync engine is the next major piece — see roadmap.)*

### Routing & auth gating

Expo Router uses **route groups**: `(auth)` for signed-out screens and `(tabs)` for the signed-in tab app. Each group's `_layout.tsx` guards its world by reading the Zustand session store — flipping the session drives navigation automatically. The root `_layout.tsx` also runs database migrations before any screen renders.

---

## Project structure

```
src/
  app/                      # Expo Router routes ONLY (every file = a route)
    _layout.tsx             #   providers + Drizzle migration gate
    index.tsx               #   session-aware redirector
    (auth)/
      _layout.tsx           #   redirect OUT if authenticated
      login.tsx
    (tabs)/
      _layout.tsx           #   redirect OUT if NOT authenticated; tab bar
      index.tsx             #   Groups
      activity.tsx
      profile.tsx
  core/                     # shared kernel (client twin of the backend's shared/)
    api/                    #   config, typed fetch client, query hooks
    db/                     #   schema, client, id helper, drizzle/ (generated)
    session/                #   Zustand session store
    theme/                  #   colors (light/dark), tokens, useTheme
  features/                 # mirrors backend modules
    auth/  groups/  expense/  settlement/  sync/  activity/  profile/
```

The `@/` import alias points at `src/`, so imports read `@/core/db/client` regardless of nesting depth.

---

## Roadmap & status

FairShare is built as a dependency-ordered sequence of steps (see the companion MVP Build Plan). Below is the **mobile-client** slice; backend-only steps live in the backend repo.

### MVP — mobile client

**Completed**
- [x] **App scaffold** — Expo Router feature-first structure, enforced feature boundaries, strict TS + ESLint/Prettier, Zustand + TanStack Query providers, reactive local SQLite (Drizzle + expo-sqlite) with the client-UUID convention, and a typed API client verified against the live backend (`/actuator/health` → `UP`).
  - [ ] Android run + `expo-doctor` sign-off *(iOS proven on the Simulator; Android parity pending)*

**To do**
- [ ] **Money kernel (TS twin)** — port integer-minor-unit + largest-remainder logic to `src/core/money` for optimistic local computation.
- [ ] **Auth UI** — register/login screens, secure token storage (`expo-secure-store`), optional biometric gate (`expo-local-authentication`), real auth-gated routing (replacing the dev toggle).
- [ ] **Sync engine** — local mutation queue, background worker, push-before-pull reconciliation against the backend's `/sync` endpoints.
- [ ] **Groups UI** — create group, invite-link share/join, member list *(remove the scaffold probe UI here)*.
- [ ] **Expense UI** — add/edit equal-split expense, attach receipt photo (`expo-image-picker`), group balance view.
- [ ] **Settlement UI** — record and reverse manual settlements.
- [ ] **Conflict-resolution UI** — keep mine / take theirs / re-enter for financial-field conflicts.

### v1 — post-MVP (planned)

- [ ] Unequal-split UI (exact / percentage / shares) and multiple-payers UI
- [ ] Payment-gateway settlement UI (UPI / Venmo / Stripe)
- [ ] **Receipt OCR smart-scan + itemized-split UI** — backed by the backend's LLM-based OCR microservice
- [ ] Recurring expenses
- [ ] Analytics & budgets screens
- [ ] MFA + social / biometric authentication
- [ ] Dispute tooling, export / Splitwise import, richer activity timeline
- [ ] **EAS Build** → TestFlight / Play internal distribution

---

## Getting started

### Prerequisites

- **Node.js** (LTS)
- **iOS:** macOS with **Xcode** + an iOS Simulator runtime; **CocoaPods** (needed for development builds)
- **Android:** **Android Studio** + an emulator (AVD)

> On **Expo SDK 56**, Expo Go on a *physical* device isn't available during the SDK transition — develop on the **Simulator/emulator**, or on a **development build** (`npx expo run:ios` / `run:android`) once a native module requires one.

### Run locally

```bash
# 1. Clone
git clone https://github.com/meankitmishra/fairshare-frontend.git
cd fairshare-frontend

# 2. Install dependencies
npm install

# 3. Configure the backend URL
cp .env.example .env         # set EXPO_PUBLIC_API_URL (defaults to the live backend)

# 4. Start the dev server
npx expo start
# press  i  for the iOS Simulator, or  a  for Android
```

### Tooling

```bash
npm run typecheck            # TypeScript check (tsc --noEmit)
npm run lint                 # ESLint + feature-boundary rules
npm run format               # Prettier

npx drizzle-kit generate     # regenerate local DB migrations after editing the schema
npx expo-doctor              # audit dependencies for New-Architecture compatibility
```

If a Babel/Metro/env change doesn't take effect, restart with a cleared cache: `npx expo start -c`.

---

## Related repositories

- **FairShare Backend** — [`meankitmishra/fairshare-backend`](https://github.com/meankitmishra/fairshare-backend) — Spring Modulith modular monolith (Java 21) with the double-entry ledger and sync protocol this client talks to.

## License

TBD.
