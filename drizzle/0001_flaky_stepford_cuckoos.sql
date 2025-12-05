ALTER TABLE "f4sr_characters" ADD COLUMN "userId" varchar(256) NOT NULL DEFAULT 'unknown';--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "character_userId_idx" ON "f4sr_characters" ("userId");