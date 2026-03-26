---
name: "docker-bootstrap-gating"
description: "Keep Dockerized apps from starting against an empty database by making schema bootstrap part of the normal compose path"
domain: "docker"
confidence: "high"
source: "2026-03-26 docker bootstrap regression validation"
---

## Context

Use this when a Docker Compose stack includes an application plus a database and
the app will immediately query tables on first request or startup.

## Patterns

### Run bootstrap on the default startup path

- Do not hide required schema bootstrap behind an opt-in profile if the normal
  `docker compose up` flow is supposed to yield a working stack.
- Put schema application and required reference-data seeding into a one-shot
  bootstrap service.

### Gate the app on successful bootstrap

- Make the app depend on the bootstrap service with
  `condition: service_completed_successfully`.
- A plain dependency on the database being healthy is not enough when the app
  expects tables and seed rows immediately.

### Treat seed data as part of usability, not optional garnish

- If first-run pages query lookup tables right away, seed those tables on the
  shared bootstrap path.
- Lazy per-feature seeding can complement bootstrap, but it does not replace
  schema creation and shared seed coverage.

## Examples

```yaml
app:
  depends_on:
    db:
      condition: service_healthy
    migrate:
      condition: service_completed_successfully

migrate:
  build:
    target: migrator
  restart: "no"
```

```dockerfile
FROM deps AS migrator
COPY . .
CMD ["sh", "-c", "pnpm db:push && pnpm db:seed"]
```

## Validation

- Bring the stack up with a fresh Compose project name and volume.
- Confirm the bootstrap container exits successfully before the app is marked up.
- Verify representative tables exist and that the app container starts only after
  bootstrap completion.

## Anti-Patterns

- **Profile-only required migrations** — Fresh `docker compose up` looks healthy
  while the database is still empty.
- **Schema-only bootstrap for lookup-driven apps** — The app avoids relation
  errors but still ships without required reference data.
