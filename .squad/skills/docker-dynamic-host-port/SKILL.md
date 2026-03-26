---
name: "docker-dynamic-host-port"
description: "Default Docker Compose database ports to a free localhost port while keeping service-to-service networking unchanged"
domain: "docker"
confidence: "high"
source: "observed"
---

## Context

Use this when a Compose-managed database only needs host access for optional
debugging or external tools, but the main app talks to it over the Docker
network by service name.

## Patterns

### Publish to localhost with a dynamic default

- Keep the container target port fixed for internal callers.
- Publish to `127.0.0.1` with `published: "${PORT_VAR:-0}"` so Docker selects a
  free host port by default.
- Let users opt into a fixed host port by setting the environment variable.

### Document host-port discovery

- Tell users to run `docker compose port <service> <container-port>` after
  startup.
- Explain that service-to-service callers should keep using the Docker service
  hostname and container port.

## Examples

```yaml
ports:
  - target: 5432
    published: "${POSTGRES_PORT:-0}"
    host_ip: 127.0.0.1
```

```bash
docker compose port db 5432
```

## Anti-Patterns

- **Defaulting to a popular fixed host port** — This makes `docker compose up`
  fragile on machines already running the same database locally.
- **Changing app connection strings to host-mapped ports** — Containers on the
  same Compose network should keep using `db:5432`, not the host-assigned port.
