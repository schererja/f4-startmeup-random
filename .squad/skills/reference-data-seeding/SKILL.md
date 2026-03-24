# Skill: Keeping Required Reference Data on the Main Seed Path

## Problem Pattern

**Symptom:** Lookup tables exist in schema and are queried by the app, but fresh environments come up missing baseline records like classes, mercenaries, or other catalog data.

## Root Cause

A dedicated one-off seed script was created for a feature area, but the normal bootstrap path does not call it. Typical misses are:

- `pnpm db:seed` only seeds older tables
- Docker migration/bootstrap only runs schema push or migration
- The app queries lookup data immediately, so empty tables surface as broken dropdowns or empty API results

## Safe Fix

1. Move the feature-specific seed logic into an exported helper.
2. Make that helper idempotent by checking existing records before insert.
3. Call the helper from the main seed entrypoint used by developers and CI/bootstrap.
4. Ensure Docker/bootstrap wiring runs both schema application and the shared seed path.

```ts
export async function seedFeatureReferenceData() {
  const existing = await db.query.featureTable.findMany();
  const existingKeys = new Set(existing.map((row) => row.name));
  const missingRows = seedRows.filter((row) => !existingKeys.has(row.name));

  if (missingRows.length > 0) {
    await db.insert(featureTable).values(missingRows);
  }
}
```

## When to Apply

- New lookup/reference tables
- Game data catalogs
- Any data the UI expects to exist on first boot

## Validation

1. Run schema application for a fresh DB.
2. Run the shared seed command.
3. Verify table counts and a few sample names.
4. Confirm the relevant app/router path reads from those same tables.

## Project Application: f4-startmeup-random

Applied in:
- `src/server/db/seed.ts`
- `src/server/db/seed-d2.ts`
- `Dockerfile`
