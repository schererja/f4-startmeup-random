# Decision: Diablo 2 Schema and API Implementation

**Author:** Mephisto  
**Date:** 2025-01-01  
**Status:** Implemented

## Context

Tyrael approved D2 feature with prefix isolation (`d2_`) on shared DB. Needed schema, seed data, tRPC routers, and type definitions.

## Decisions Made

### Schema Design (`src/server/db/schema-d2.ts`)
- Used a separate `createD2Table = pgTableCreator((name) => \`d2_\${name}\`)` — mirrors existing `f4sr_` pattern but isolated to D2 feature
- Tables: `d2_classes`, `d2_mercenaries`, `d2_skill_focuses`, `d2_characters`
- FK references use `uuid` columns (not `id`) — consistent with existing schema pattern
- `mercenaryUUID` on `d2_characters` is nullable (mercs are optional)
- `difficulty` stored as varchar (not enum) — avoids migration complexity for `'Normal' | 'Nightmare' | 'Hell'`

### DB Index Update (`src/server/db/index.ts`)
- Spread both schemas into drizzle: `{ ...schema, ...schemaD2 }` — enables `ctx.db.query.d2Characters` etc. in routers
- Single DB instance, no separate connection needed

### tRPC Routers
- `d2Characters` router: `create`, `getByUUID`, `getAll`, `getStats`
- `d2GameData` router: `getClasses`, `getMercenaries` (filterable by act), `getSkillFocuses` (filterable by classUUID)
- Routes registered at `d2Characters.*` and `d2GameData.*` in root router

### Types (`src/types/index.ts`)
- Added `D2Character`, `D2Class`, `D2Mercenary`, `D2SkillFocus` via `InferSelectModel`
- `FullD2Character` composite includes class, nullable mercenary, and skill focuses array
- `CreateD2CharacterInput` matches the tRPC `create` procedure input shape

## What's Not Done
- Drizzle migrations — not run per task spec
- Database seed execution — script written at `src/server/db/seed-d2.ts`, not run per task spec
