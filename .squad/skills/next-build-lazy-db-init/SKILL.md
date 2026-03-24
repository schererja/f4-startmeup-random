# Skill: Avoiding Build-Time DB Initialization in Next.js

## Problem Pattern

**Symptom:** `next build` or Docker `pnpm build` fails with `TypeError: Invalid URL` or similar during page-data collection.

**Common Setup:**
- `SKIP_ENV_VALIDATION=1` is enabled for production builds
- A server module imports the DB layer during route or RSC evaluation
- The DB module eagerly reads or parses `process.env.POSTGRES_URL` (for example with `new URL(...)`) at import time

## Root Cause

Skipping env validation does **not** guarantee required env vars are populated during build. If the DB module parses the connection string while the module is being imported, the build can fail before any request handler or page code gets a chance to catch or defer the problem.

## Safe Fix

Move DB initialization behind a lazy helper and only call it when work actually needs the database.

```ts
let dbInstance: AppDatabase | undefined;

const createDb = (): AppDatabase => {
  const connectionString = env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error("POSTGRES_URL is required to initialize the database client");
  }

  const isPooler = new URL(connectionString).hostname.includes("-pooler.");
  return isPooler
    ? drizzleVercel(sql, { schema })
    : drizzlePostgresJs(postgres(connectionString), { schema });
};

export const getDb = (): AppDatabase => {
  dbInstance ??= createDb();
  return dbInstance;
};
```

Then resolve the DB inside request context or scripts instead of at module top level.

## When to Apply

- Next.js App Router projects where build-time module loading touches server code
- Docker builds that set `SKIP_ENV_VALIDATION=1`
- Any server module that currently constructs a DB client as a top-level constant

## Validation

1. `SKIP_ENV_VALIDATION=1 pnpm build`
2. Existing lint and test commands
3. Docker build path that previously failed, e.g. `docker compose build app`

## Project Application: f4-startmeup-random

Applied in:
- `src/server/db/index.ts`
- `src/server/api/trpc.ts`
- `src/server/db/seed.ts`
- `src/server/db/seed-d2.ts`
