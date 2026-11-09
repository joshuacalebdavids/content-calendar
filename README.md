# Calio

Calio is a content operating system for focused creators and small teams. It brings planning, briefs, scheduling, and production status into one calm workspace.

> This repository contains Calio v0.1: a portfolio-grade Next.js rebuild of the original browser-based planner.

## What changed

The original Vite prototype proved the workflow, but stored the entire application in one large component and modeled a year as 48 generic work weeks. Calio v0.1 introduces:

- A Next.js App Router and TypeScript architecture
- A dedicated marketing experience and interactive product demo
- Real calendar dates with month navigation
- Calendar and production-pipeline views
- Working library, live workspace insights, notifications, help, and settings
- Structured content briefs and platform selection
- Search, filtering, metrics, and local demo persistence
- Neon Auth sign-up, sign-in, protected workspace access, and sign-out
- Responsive layouts and reduced-motion support
- A multi-tenant Postgres schema with Row Level Security
- Automated tests for calendar behavior

Billing is deliberately deferred until the South African payment-provider decision is complete.

## Product demo

The authenticated `/demo` workspace is fully interactive and saves content changes to local storage. Identity and sessions are managed by Neon Auth; moving workspace content into Lakebase Postgres is the next persistence layer.

## Getting started

```bash
git clone https://github.com/joshuacalebdavids/content-calendar.git
cd content-calendar
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Stack

- Next.js App Router
- React and TypeScript
- GSAP for considered marketing motion
- Neon Auth with Managed Better Auth
- Lakebase Postgres project and branch configuration through `neon.ts`
- Vercel Analytics and deployment
- Vitest

## Architecture

See [docs/architecture.md](docs/architecture.md) for the domain model, security boundaries, and planned cloud migration.

## Environment

Link the repository to its Neon project and pull the branch environment, then add a 32+ character cookie secret:

```bash
neon link --project-id <project-id> -y
neon env pull
```

See `.env.example` for the required Auth variables. The local `.env.local` file is git-ignored.

## License

MIT
