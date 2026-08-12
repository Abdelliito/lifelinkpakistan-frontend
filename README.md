# LifeLink Pakistan — AI-Assisted Blood Donor Network

**Connecting Blood Donors with Lives in Need**

> **Status: Frontend-only MVP.** This project is a fully interactive Next.js frontend built with simulated data and services. There is **no real backend, database, authentication provider, or AI/Gemini integration** — everything is mocked so the UI and user flows can be demoed and later wired up to a real backend with minimal refactoring.

---

## Overview

LifeLink Pakistan helps patients and families find compatible blood donors quickly during emergencies, and lets an AI-style assistant turn a plain-language description of an emergency into a structured, editable blood request.

## Features

- **Landing page** with quick donor search, platform stats, how-it-works, and AI feature preview
- **Mock authentication** — signup, login, logout, session persisted via `localStorage`, with `USER`, `DONOR`, and `ADMIN` roles
- **Donor search** — filter by blood group, city, and availability, with loading/empty/error states
- **Donor profile management** — become a donor, edit details, toggle availability instantly
- **Blood request flow** — create requests manually or via the **AI Request Assistant**, view request history and details, see matching donors computed from a dedicated blood-compatibility utility
- **AI Request Assistant** — describe an emergency in plain English (e.g. *"My father urgently needs O+ blood at Mayo Hospital Lahore."*) and get an **editable** pre-filled form. The AI never submits automatically — the user always reviews and confirms.
- **Admin panel** — platform stats, and management of users, donors, and blood requests (search, filter, delete/update, confirmation modals)
- Fully responsive, accessible, with loading skeletons, empty states, and error states throughout

## Technology Stack

- **Next.js 15 (App Router)** + **TypeScript**
- **Tailwind CSS v4**
- **React Hook Form** + **Zod** for form validation
- **Lucide-style inline SVG icons**
- No backend, no database, no real AI provider — see [Mock Layer](#mock-layer) below

## Folder Architecture

```text
src/
├── app/                     # Next.js App Router routes
│   ├── (public)/            # Navbar + footer chrome — landing, find-donors, how-it-works, about, emergency-request
│   ├── (auth)/               # Login / signup — no chrome
│   ├── (app)/                # Authenticated user routes — dashboard, donor, requests, profile
│   └── admin/                 # Admin routes with sidebar layout, protected by RequireAdmin
│
├── components/
│   ├── ui/                   # Design system: Button, Badges, FormControls, Feedback, Card, etc.
│   ├── layout/                # Navbar, Footer, AdminSidebar, Logo
│   └── shared/                 # DonorCard, RequestCard, BackLink, ConfirmModal
│
├── features/
│   └── auth/                  # AuthContext (mock session) + RouteGuard (RequireAuth / RequireAdmin)
│
├── data/                      # Mock data: users, donors, bloodRequests, dashboard stats
├── services/                  # Mock service layer (see below)
├── hooks/                     # useAsync, useCurrentDonor
├── lib/                       # bloodCompatibility.ts, validations.ts (Zod schemas), utils.ts
├── types/                     # Centralized TypeScript types
└── constants/                 # Blood groups, cities, urgency levels, mock delays, demo accounts
```

## Installation

```bash
npm install
```

## Running Locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Building

```bash
npm run build
npm start
```

## Mock Authentication

Session state lives in `services/auth.service.ts` and is persisted to `localStorage` under the key `lifelink_session` so refreshes keep you logged in. **This is not secure** — there is no real password hashing or server-side verification. Two demo accounts are pre-seeded:

| Role  | Email               | Password  |
|-------|---------------------|-----------|
| User  | `user@lifelink.pk`  | `user123` |
| Admin | `admin@lifelink.pk` | `admin123`|

Any other email used at signup is added to the in-memory mock user list for the current session.

## Mock Data & Mock Layer

All data operations run through a **service layer** (`src/services/`) that simulates network latency (`delay()` in `lib/utils.ts`) and mutates in-memory copies of the seed data in `src/data/`. Nothing persists beyond a full page reload except the auth session. Services:

- `auth.service.ts` — signup, login, logout, session
- `donor.service.ts` — CRUD + search for donor profiles
- `request.service.ts` — CRUD for blood requests + compatible-donor matching
- `ai.service.ts` — simulated natural-language extraction (regex/keyword based — **not a real LLM call**)
- `admin.service.ts` — admin-facing stats, user/donor/request management

## AI Simulation

`services/ai.service.ts` performs lightweight, deterministic parsing (blood group regex, hospital keyword list, city list, urgency keywords) over free text to approximate what a real AI extraction step would return. It is used by `/requests/ai-assistant`, which always routes the result into an **editable** form — the AI never creates or submits a request on its own.

## Future Backend Integration Plan

The mock service layer was designed so each function's signature and return shape mirror what a real API call would look like. To connect a real backend:

1. Replace the body of each function in `src/services/*.ts` with real `fetch`/API calls (e.g. to Next.js API routes or an external backend), keeping the same function names and return types.
2. Swap `auth.service.ts`'s `localStorage` session for real session/JWT handling (e.g. via a real auth provider).
3. Replace `ai.service.ts`'s regex parsing with a call to a real LLM provider (e.g. Google Gemini), keeping the same `AIExtractedRequest` return shape.
4. Point `data/*.ts` seed arrays' consumers (already isolated behind services) at a real database instead.

No UI code should need to change — components only ever talk to the service layer, never to mock arrays directly.
