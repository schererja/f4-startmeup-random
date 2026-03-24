---
name: "docker-credential-helper-path"
description: "Restore Docker Desktop pulls when the desktop credential helper exists but is missing from PATH"
domain: "docker"
confidence: "high"
source: "2026-03-24 local fix"
---

## Context

Use this when Docker commands fail with `docker-credential-desktop: executable file not found in $PATH` even though Docker Desktop is installed.

## Patterns

### Restore the helper from Docker Desktop

- Check whether `/Applications/Docker.app/Contents/Resources/bin/docker-credential-desktop` exists.
- If it does, create a user-level symlink at `~/.local/bin/docker-credential-desktop` so normal `docker pull` / `docker compose` commands can find it without requiring privileged writes.
- Prefer this over editing project files when the failure happens before image pulls complete, because the root cause is host Docker configuration rather than application code.

## Examples

```bash
mkdir -p ~/.local/bin
ln -sf /Applications/Docker.app/Contents/Resources/bin/docker-credential-desktop ~/.local/bin/docker-credential-desktop
docker pull node:20-alpine
```

## Anti-Patterns

- **Blaming only the Dockerfile** — If plain `docker pull` fails with the same credential-helper error, fix the local helper path first.
- **Requiring sudo unnecessarily** — Prefer a user PATH location like `~/.local/bin` before touching `/usr/local/bin`.
