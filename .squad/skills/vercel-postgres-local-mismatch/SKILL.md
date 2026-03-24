# Skill: Detecting @vercel/postgres / Local Postgres Incompatibility

## Problem Pattern

**Symptom:** `VercelPostgresError: invalid_connection_string` in Docker/local development when using @vercel/postgres

**Root Cause:** @vercel/postgres is a serverless-only client library that:
- Uses @neondatabase/serverless (WebSocket-based HTTP tunneling, not TCP)
- Validates connection strings at runtime
- Rejects standard `postgresql://` URLs
- Requires `-pooler` suffix in hostname (only Vercel/Neon managed services have this)

## Key Distinction

**IMPORTANT:** Setting a connection string in docker-compose.yml ≠ App can use it

- ✓ `docker-compose.yml` can SET `POSTGRES_URL: postgresql://localhost:5432/db`
- ✗ `@vercel/postgres` at runtime will REJECT that same string as invalid
- ✓ `pg` library or `drizzle-orm/node-postgres` WILL accept it

**Common False Solution:**
- Problem: "App logs say `invalid_connection_string`"
- Wrong Fix: "Let me add the connection string to docker-compose.yml"
- Real Fix: "Let me switch the database client library for local environments"

## Recognition Checklist

Check if you see:
- [ ] Import: `import { sql } from "@vercel/postgres"` in data layer code
- [ ] Error: `VercelPostgresError: invalid_connection_string` or `invalid_connection_string`
- [ ] Context: Running in Docker or local development (not Vercel production)
- [ ] Connection: Standard PostgreSQL on TCP (not Vercel/Neon managed service)

If all checked → **This is the pattern.**

## Solutions

### Option 1: Conditional Client Selection (Recommended)
```typescript
// db/index.ts
import { drizzle as drizzleVercel } from 'drizzle-orm/vercel-postgres';
import { drizzle as drizzleNode } from 'drizzle-orm/node-postgres';
import { sql as sqlVercel } from '@vercel/postgres';
import pkg from 'pg';
const { Pool } = pkg;

const schema = { /* your schema */ };

export const db = process.env.VERCEL || process.env.NODE_ENV === 'production'
  ? drizzleVercel(sqlVercel, { schema })
  : drizzleNode(new Pool({ connectionString: process.env.POSTGRES_URL }), { schema });
```

```typescript
// Prefer detecting pooled Vercel hosts directly when one codebase must support
// both Docker/local Postgres and Vercel Postgres.
const host = new URL(process.env.POSTGRES_URL!).hostname;
const isVercelPooler = host.includes('-pooler.');

export const db = isVercelPooler
  ? drizzleVercel(sqlVercel, { schema })
  : drizzlePostgresJs(postgres(process.env.POSTGRES_URL!), { schema });
```

**Best when:** Docker or local production-like runs use a normal TCP Postgres URL, while production uses a pooled Vercel/Neon hostname.  

**Pros:** Works in both local and Vercel production  
**Cons:** Need to maintain two code paths; dependencies on both `pg` and `@vercel/postgres`

### Option 2: Unified Serverless Client
```typescript
// Use @neondatabase/serverless everywhere (if using Neon)
import { drizzle } from 'drizzle-orm/neon-http';
import { Client } from '@neondatabase/serverless';

const client = new Client({ connectionString: process.env.POSTGRES_URL });
export const db = drizzle(client);
```

**Pros:** Single codebase works everywhere  
**Cons:** Must use Neon for local dev (not standard postgres); serverless only

### Option 3: Remove @vercel/postgres Entirely
```typescript
// Use pg everywhere
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
export const db = drizzle(pool);
```

**Pros:** Standard PostgreSQL, traditional client, widely compatible  
**Cons:** Lose edge runtime support on Vercel (if needed)

## Testing the Fix

1. **Before:** Try to connect with @vercel/postgres to local postgres → FAILS
2. **After:** Try the same URL with selected client library → SUCCEEDS
3. **Verify:** docker-compose up → app starts → `GET /api/health` returns 200

```bash
# In Docker
docker-compose up
# Wait for "app is running on http://localhost:3000"
curl http://localhost:3000/api/health  # Should succeed, not crash
```

## Related Patterns

- **Vercel Edge Runtime Compatibility:** If using Vercel Edge Functions, @vercel/postgres is required (option 1 conditional path)
- **Neon PostgreSQL:** If using Neon managed service, can use either @vercel/postgres or @neondatabase/serverless
- **Connection Pooling:** docker-compose should point to local postgres (no pooler suffix); production might use Vercel/Neon pooler

## References

- [GitHub Issue: Trying to use a local DB with Vercel Postgres fails](https://github.com/vercel/storage/issues/123)
- [@vercel/postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [@neondatabase/serverless GitHub](https://github.com/neondatabase/serverless)
- [Drizzle ORM Database Drivers](https://orm.drizzle.team/docs/get-started-postgresql)

## Author

Diablo (Tester)  
Date: 2026-03-24

## Project Application: f4-startmeup-random

For this repo, the safe fix was a single standard PostgreSQL path:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const queryClient = postgres(env.POSTGRES_URL);
export const db = drizzle(queryClient, { schema });
```

Why this fit here:
- `postgres` was already a production dependency
- Docker Compose already supplied a normal PostgreSQL URL
- The app and seed scripts could share one client setup instead of branching on environment
