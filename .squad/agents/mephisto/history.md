# Mephisto — History

## Core Context

- **Project:** A multi-game OBS streaming overlay platform supporting Fallout 4 and Diablo 2 with live web-based overlay sources.
- **Role:** Backend Dev
- **Joined:** 2026-03-23T21:56:14.980Z

## Learnings

<!-- Append learnings below -->
- The shared DB entrypoint is `src/server/db/index.ts`; it now uses `drizzle-orm/postgres-js` plus the `postgres` client so `POSTGRES_URL` can point at standard PostgreSQL hosts, including Docker service names.
- `src/server/db/seed-d2.ts` should reuse the shared `~/server/db` client instead of creating its own driver-specific client, keeping seeding aligned with app runtime behavior.
- Docker/local validation for this repo can use `docker compose up -d db`, `pnpm db:push`, and a small `db.execute(sql\`select 1\`)` smoke test against `postgresql://postgres:password@localhost:5432/f4-startmeup-random`.
- Diablo 2 reference data must be wired into the shared `pnpm db:seed` path and the Docker migrator; leaving it only in `db:seed:d2` makes classes and mercenaries disappear in fresh environments.
