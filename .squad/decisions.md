# Squad Decisions

## Active Decisions

### Docker Build — Syntax Directive (2026-03-24)

**Status:** REJECTION — Critical code issue identified by Diablo

**Issue:** Dockerfile missing `# syntax=docker/dockerfile:1` on line 1.
- This directive was present in original commit (b89095f)
- Accidentally removed during unstaged edits
- Required for BuildKit features and multi-stage build reliability
- Failure mode: Some Docker setups fail or fall back to legacy builder

**Root Cause (Credentials Error):** User-environment configuration issue
- `~/.docker/config.json` has `credsStore: "desktop"` without helper in `$PATH`
- Fix: Remove or comment out `credsStore` in user's Docker config
- This is NOT a code issue

**Secondary Issue:** Node native module build failures (bufferutil/utf-8-validate)
- Separate from the syntax directive problem
- Will block builds but is known issue in Node+Docker

**Required Action:**
- Restore `# syntax=docker/dockerfile:1` as line 1
- Verify against clean commit b89095f
- Revalidate build process

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
