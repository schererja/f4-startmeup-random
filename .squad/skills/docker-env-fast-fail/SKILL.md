---
name: "docker-env-fast-fail"
description: "Make Docker-based app startup fail immediately when required runtime secrets are missing or still placeholder values"
domain: "docker"
confidence: "high"
source: "2026-03-24 Docker follow-up investigation"
---

## Context

Use this when a containerized app technically starts but immediately throws framework or auth errors because required runtime env vars were omitted from Docker Compose.

## Patterns

### Require the Docker env file in Compose

- For app services that need runtime secrets, declare the Docker env file with `required: true`.
- Prefer a direct Compose error like `env file .../.env.docker not found` over letting the service boot with partial config.

### Validate auth secrets in shared env schema

- Put required auth variables in the shared env validation layer, not only in docs.
- Reject example placeholders such as `replace_me` so copied sample files fail fast until they are replaced.

### Force validation at startup boundaries

- Touch server-only secrets from middleware or another always-loaded server entrypoint.
- Touch client-exposed auth config from the root layout/provider setup so missing values are caught before request handling gets deep into the framework.

## Examples

```yaml
env_file:
  - path: .env.docker
    required: true
```

```js
const clerkKey = (name) =>
  z.string().min(1).refine((value) => !value.includes("replace_me"));
```

## Anti-Patterns

- **Optional secret files for required services** — This turns a configuration mistake into a noisy runtime failure.
- **Docs-only secret requirements** — If the app depends on a key, validate it in code too.
