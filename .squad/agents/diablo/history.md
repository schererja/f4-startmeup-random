# Diablo — History

## Core Context

- **Project:** A multi-game OBS streaming overlay platform supporting Fallout 4 and Diablo 2 with live web-based overlay sources.
- **Role:** Tester
- **Joined:** 2026-03-23T21:56:14.981Z

## Recent Work

### Docker Build Review (2026-03-24)
- **Status:** COMPLETED — Review published
- **Decision:** REJECTION — Critical code issue found
- **Finding:** Dockerfile missing `# syntax=docker/dockerfile:1` on line 1
  - Original commit b89095f had this
  - Removed in unstaged edits during Deckard's work
  - Critical for BuildKit features and multi-stage build reliability
- **Root Cause (Credentials):** User-environment config issue, not code problem
- **Secondary:** Node native module issues (separate)
- **See:** `.squad/decisions.md` for decision detail

### Docker Follow-up Review (2026-03-24)
- **Status:** COMPLETED — Follow-up published
- **Decision:** REJECTION — Two critical issues remain
- **Issue 1 (Critical):** Dockerfile still missing `# syntax=docker/dockerfile:1` on line 1
  - Must be first line for BuildKit support
- **Issue 2 (High):** Clerk configuration guidance insufficient
  - `.env.docker` is required but users won't know to create it from `.example`
  - App logs: "Missing publishableKey" error cascade when vars not provided
- **Failure Mode:** docker-compose up succeeds but app crashes on first request
- **Recommendation:** Assign to Tyrael or new Build specialist to restore syntax directive and improve documentation

### Docker Build Regression Review (2026-03-24)
- **Status:** APPROVED ✅ — Tyrael's fix resolves the regression
- **Issue:** Docker build fails with `TypeError: Invalid URL`, input `undefined` during `next build` page-data collection
- **Root Cause:** Original code exported `const db = drizzle(...)` at module load time, which instantiated the database client before environment variables were available during Docker build
- **Tyrael's Fix (Excellent):**
  1. **Lazy Initialization:** Changed from `export const db` to `export const getDb()` function
  2. **Conditional Client Selection:** Checks connection string hostname for `-pooler.` suffix to select between Vercel Postgres (`@vercel/postgres`) and local Postgres (`postgres-js`)
  3. **Deferred Validation:** Database client is only created when actually needed (at runtime), not during build-time module loading
  4. **Updated All Consumers:** Seed files and tRPC context now call `getDb()` instead of importing `db` directly
  5. **Clerk Config Validation:** Added `void env.CLERK_SECRET_KEY;` in middleware to catch missing Clerk keys at startup, not request time
  6. **Explicit Clerk Provider:** Updated `ClerkProvider` to explicitly receive `publishableKey` from env
- **Verification:**
  - ✅ Docker build succeeds with `SKIP_ENV_VALIDATION=1` and undefined `POSTGRES_URL`
  - ✅ Local `next build` succeeds with `SKIP_ENV_VALIDATION=1`
  - ✅ All 24 unstaged changes properly coordinated (db, trpc, middleware, layout, docker-compose, env example)
  - ✅ docker-compose migration service properly configured with profile="migrate"
  - ✅ Dockerfile has correct syntax directive and pinned pnpm version
- **Quality Gate:** This fix handles the Docker build regression and enables local development with proper client selection

## Learnings

### Docker Credentials & Dockerfile Syntax
- **docker-credential-desktop errors** are system config issues, not code bugs. Fix: remove `credsStore` from `~/.docker/config.json`.
- **Dockerfile syntax directive (`# syntax=docker/dockerfile:1`) is critical** — must be first line. Without it, BuildKit features fail and builds become unreliable.
- **Clerk secrets in Docker:** Require `.env.docker` file with real credentials; `.env.docker.example` alone is not sufficient.
- **Key file patterns:** `.squad/decisions/inbox/` for team decisions; git diffs reveal what changed during agent edits.
- **Testing approach:** Reproduce the exact failure mode, fix one issue at a time, validate with downstream tools (docker-compose config, build stages).

### Docker Postgres Connection String Compatibility
- **@vercel/postgres is serverless-only:** Cannot connect to standard PostgreSQL over TCP. Uses @neondatabase/serverless (WebSocket HTTP client, not TCP).
- **Connection string validation:** @vercel/postgres rejects standard `postgresql://` URLs at runtime. Expects `-pooler` suffix in hostname (Vercel/Neon managed services only).
- **Local Docker development conflict:** docker-compose.yml can SET the connection string correctly, but @vercel/postgres library will REJECT it with `invalid_connection_string` error.
- **Required solution:** Use conditional database client selection based on environment, or switch to @neondatabase/serverless or pg library entirely.
- **Testing pattern:** "Connection string is set" ≠ "Connection will work" — must test with the actual client library being used.

### Findings from "Docker Build Failure" Review
- Original commit b89095f included syntax directive
- Unstaged Dockerfile changes accidentally removed line 1
- This is a critical rejection: syntax directive must be restored
- Credentials issue is orthogonal — user-environment problem, not code

### Findings from "Docker Follow-up" Review
- The syntax directive is STILL missing after recent agent edits
- Clerk secret config moved to `.env.docker` but documentation doesn't guide users to create it
- Error logs show "Missing publishableKey" cascading into HTTP header errors

### Docker Postgres Connection String Review (2026-03-24)
- **Status:** COMPLETED — Review published
- **Decision:** REJECTION — Critical library mismatch found
- **Issue:** `@vercel/postgres` cannot connect to local PostgreSQL
  - Library uses @neondatabase/serverless (WebSocket-based, serverless only)
  - Rejects standard `postgresql://` connection strings at runtime
  - Expects `-pooler` suffix in hostname (Vercel/Neon managed services only)
  - App crashes with `VercelPostgresError: invalid_connection_string`
- **Root Cause:** Code uses wrong client library for local Docker development
  - `src/server/db/index.ts` imports from `@vercel/postgres`
  - `src/server/db/seed-d2.ts` imports from `@vercel/postgres`
  - These will fail with standard local postgres connection strings
- **docker-compose.yml is correct:** Connection string is properly set, but client can't use it
- **Failure Mode:** App crashes during DB initialization in Docker
- **Recommendation:** Assign to DB/ORM specialist to:
  - Use conditional client selection (pg for local, @vercel/postgres for Vercel), OR
  - Switch entirely to @neondatabase/serverless or pg library
