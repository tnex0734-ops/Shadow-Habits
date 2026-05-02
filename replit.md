# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Applications

### ShadowHabits (`artifacts/shadow-habits`)
- **Preview path**: `/`
- **Type**: React + Vite web app
- **Description**: Jujutsu Kaisen-themed anime habit tracker for Gen Z
- **Features**:
  - JWT authentication (signup/login)
  - 3 selectable JJK-inspired characters: Infinity Mentor (Gojo/blue), Dark King (Sukuna/red), Energy Hero (Itadori/orange)
  - Dynamic character theme engine — UI colors shift based on selected companion
  - Habit CRUD with max 7 habits limit
  - Habit completion toggling (daily)
  - Streak tracking (current + longest)
  - Dashboard with companion AI messages (rule-based, mood-aware)
  - Calendar strip (14-day view)
  - Statistics page with Recharts AreaChart (character avatar as chart dot)
  - Cursed energy particle background effects
  - Glassmorphism UI with glow effects

### API Server (`artifacts/api-server`)
- **Preview path**: `/api`
- **Type**: Express 5 REST API
- **Auth**: JWT via bcryptjs + jsonwebtoken
- **Routes**:
  - `POST /api/auth/signup` — Register user
  - `POST /api/auth/login` — Login user
  - `GET /api/auth/me` — Get current user
  - `PUT /api/auth/character` — Update selected character
  - `GET /api/habits` — List habits
  - `POST /api/habits` — Create habit (max 7)
  - `PUT /api/habits/:id` — Update habit
  - `DELETE /api/habits/:id` — Delete habit
  - `POST /api/habits/:id/complete` — Mark complete for date
  - `POST /api/habits/:id/uncomplete` — Mark incomplete for date
  - `GET /api/dashboard/summary` — Dashboard stats + weekly chart data
  - `GET /api/dashboard/insights` — Rule-based AI insights
  - `GET /api/dashboard/streaks` — Streak data per habit
  - `GET /api/dashboard/companion-message` — Character companion message

## Database Schema

- **users**: id, name, email, password_hash, selected_character, created_at
- **habits**: id, user_id, title, description, completed_dates (JSON array of ISO date strings), current_streak, longest_streak, created_at

## Auth Flow

- Token stored in localStorage under `shadowhabits_token`
- Injected via `setAuthTokenGetter` from `@workspace/api-client-react` custom-fetch
- All protected routes require `Authorization: Bearer <token>` header

## Character Theme System

CSS custom properties on `[data-character="<id>"]` selector:
- `infinity-mentor` → Electric blue (`#0ea5e9`)
- `dark-king` → Blood crimson (`#dc2626`)
- `energy-hero` → Burning orange (`#ea580c`)

Theme toggled by `ThemeProvider` setting `data-character` on `document.body`.

## Important Notes

- `lib/api-zod/src/index.ts` should only export from `./generated/api` (not `./generated/types`) to avoid duplicate exports
- Character images are AI-generated and stored in `artifacts/shadow-habits/src/assets/`
