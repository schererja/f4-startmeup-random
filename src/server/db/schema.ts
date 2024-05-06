// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `f4sr_${name}`);



export const jobs = createTable(
  "jobs",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    uuid: uuid("uuid").default(sql`gen_random_uuid()`).unique(),
  },
  (job) => ({
    nameIndex: index("job_name_idx").on(job.name)
  }),
)

export const traits = createTable(
  "traits",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    description: varchar("description", { length: 1024 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    uuid: uuid("uuid").default(sql`gen_random_uuid()`).unique(),
  },
  (traits) => ({
    nameIndex: index("traits_name_idx").on(traits.name),
  })
)

export const locations = createTable(
  "locations",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    description: varchar("description", { length: 1024 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    uuid: uuid("uuid").default(sql`gen_random_uuid()`).unique(),
  },
  (location) => ({
    nameIndex: index("location_name_idx").on(location.name),
  })
)
export const specialStats = createTable(
  "specials",
  {
    id: serial("id").primaryKey(),
    strength: integer("strength"),
    perception: integer("perception"),
    endurance: integer("endurance"),
    charisma: integer("charisma"),
    intelligence: integer("intelligence"),
    agility: integer("agility"),
    luck: integer("luck"),
    uuid: uuid("uuid").default(sql`gen_random_uuid()`).unique(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  }
)
export const characters = createTable(
  "characters",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    uuid: uuid("uuid").default(sql`gen_random_uuid()`),
    specialStats: uuid("specialStatsUUID").references(() => specialStats.uuid),
    jobsUUID: uuid("jobsUUID").references(() => jobs.uuid),
    traitsUUID: uuid("traitsUUID").references(() => traits.uuid),
    locationsUUID: uuid("locationsUUID").references(() => locations.uuid),

  },
  (character) => ({
    nameIndex: index("character_name_idx").on(character.name),
  })
)
