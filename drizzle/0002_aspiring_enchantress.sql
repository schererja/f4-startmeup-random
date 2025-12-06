ALTER TABLE "f4sr_specials" ADD COLUMN "userId" varchar(256) NOT NULL DEFAULT 'unknown';--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "special_userId_idx" ON "f4sr_specials" ("userId");