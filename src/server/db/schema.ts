// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
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
    name: varchar("name", { length: 256 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
    uuid: uuid("uuid")
      .default(sql`gen_random_uuid()`)
      .notNull()
      .unique(),
  },
  (job) => ({
    nameIndex: index("job_name_idx").on(job.name),
  }),
);

export const traits = createTable(
  "traits",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 1024 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
    uuid: uuid("uuid")
      .default(sql`gen_random_uuid()`)
      .notNull()
      .unique(),
  },
  (traits) => ({
    nameIndex: index("traits_name_idx").on(traits.name),
  }),
);

export const locations = createTable(
  "locations",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 1024 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
    uuid: uuid("uuid")
      .default(sql`gen_random_uuid()`)
      .notNull()
      .unique(),
  },
  (location) => ({
    nameIndex: index("location_name_idx").on(location.name),
  }),
);
export const specialStats = createTable("specials", {
  id: serial("id").primaryKey(),
  strength: integer("strength").notNull(),
  perception: integer("perception").notNull(),
  endurance: integer("endurance").notNull(),
  charisma: integer("charisma").notNull(),
  intelligence: integer("intelligence").notNull(),
  agility: integer("agility").notNull(),
  luck: integer("luck").notNull(),
  uuid: uuid("uuid")
    .default(sql`gen_random_uuid()`)
    .notNull()
    .unique(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
export const characters = createTable(
  "characters",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    userId: varchar("userId", { length: 256 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
    uuid: uuid("uuid")
      .default(sql`gen_random_uuid()`)
      .notNull()
      .unique(),
    specialStats: uuid("specialStatsUUID")
      .references(() => specialStats.uuid)
      .notNull(),
    jobsUUID: uuid("jobsUUID")
      .references(() => jobs.uuid)
      .notNull(),
    traitsUUID: uuid("traitsUUID")
      .references(() => traits.uuid)
      .notNull(),
    locationsUUID: uuid("locationsUUID")
      .references(() => locations.uuid)
      .notNull(),
  },
  (character) => ({
    nameIndex: index("character_name_idx").on(character.name),
    userIdIndex: index("character_userId_idx").on(character.userId),
  }),
);
