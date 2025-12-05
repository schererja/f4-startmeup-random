CREATE TABLE IF NOT EXISTS "f4sr_characters" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"specialStatsUUID" uuid NOT NULL,
	"jobsUUID" uuid NOT NULL,
	"traitsUUID" uuid NOT NULL,
	"locationsUUID" uuid NOT NULL,
	CONSTRAINT "f4sr_characters_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "f4sr_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT "f4sr_jobs_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "f4sr_locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(1024),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT "f4sr_locations_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "f4sr_specials" (
	"id" serial PRIMARY KEY NOT NULL,
	"strength" integer NOT NULL,
	"perception" integer NOT NULL,
	"endurance" integer NOT NULL,
	"charisma" integer NOT NULL,
	"intelligence" integer NOT NULL,
	"agility" integer NOT NULL,
	"luck" integer NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "f4sr_specials_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "f4sr_traits" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(1024),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT "f4sr_traits_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "character_name_idx" ON "f4sr_characters" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_name_idx" ON "f4sr_jobs" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "location_name_idx" ON "f4sr_locations" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "traits_name_idx" ON "f4sr_traits" ("name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "f4sr_characters" ADD CONSTRAINT "f4sr_characters_specialStatsUUID_f4sr_specials_uuid_fk" FOREIGN KEY ("specialStatsUUID") REFERENCES "f4sr_specials"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "f4sr_characters" ADD CONSTRAINT "f4sr_characters_jobsUUID_f4sr_jobs_uuid_fk" FOREIGN KEY ("jobsUUID") REFERENCES "f4sr_jobs"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "f4sr_characters" ADD CONSTRAINT "f4sr_characters_traitsUUID_f4sr_traits_uuid_fk" FOREIGN KEY ("traitsUUID") REFERENCES "f4sr_traits"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "f4sr_characters" ADD CONSTRAINT "f4sr_characters_locationsUUID_f4sr_locations_uuid_fk" FOREIGN KEY ("locationsUUID") REFERENCES "f4sr_locations"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
