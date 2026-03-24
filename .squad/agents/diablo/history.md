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

## Learnings

### Docker Credentials & Dockerfile Syntax
- **docker-credential-desktop errors** are system config issues, not code bugs. Fix: remove `credsStore` from `~/.docker/config.json`.
- **Dockerfile syntax directive (`# syntax=docker/dockerfile:1`) is critical** — must be first line. Without it, BuildKit features fail and builds become unreliable.
- **Key file patterns:** `.squad/decisions/inbox/` for team decisions; git diffs reveal what changed during agent edits.
- **Testing approach:** Reproduce the exact failure mode, fix one issue at a time, validate with downstream tools (docker-compose config, build stages).

### Findings from "Docker Build Failure" Review
- Original commit b89095f included syntax directive
- Unstaged Dockerfile changes accidentally removed line 1
- This is a critical rejection: syntax directive must be restored
- Credentials issue is orthogonal — user-environment problem, not code
