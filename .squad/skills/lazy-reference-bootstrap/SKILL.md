# Skill: Lazy Bootstrap for Required Reference Data

## Problem Pattern

Static lookup data exists in schema and seed scripts, but a fresh environment reaches read paths before the shared seed command has run.

## Safe Approach

1. Keep the canonical seed function idempotent.
2. Avoid DB initialization at module load if the helper may be imported by runtime code.
3. Add an `ensure...()` helper that:
   - checks for representative rows,
   - runs the seed only when data is missing,
   - shares a single in-flight promise so concurrent reads do not stampede.
4. Call that helper from the first router/query path that requires the reference data.

## Why It Works

- Fresh schemas become self-healing for critical dropdown/catalog data.
- Existing explicit seed commands still work and stay authoritative.
- Runtime imports stay safe in builds because DB client creation is deferred until function execution.

## Applied Here

- `src/server/db/seed-d2.ts`
- `src/server/api/routers/d2GameData.ts`
