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

export const character = createTable(
  "characters",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (character) => ({
    nameIndex: index("character_name_idx").on(character.name),
  })
)


export const jobs = createTable(
  "jobs",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    uuid: uuid("uuid").default(sql`gen_random_uuid()`),
  },
  (job) => ({
    nameIndex: index("job_name_idx").on(job.name),
  })
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
    uuid: uuid("uuid"),
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
    uuid: uuid("uuid"),
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
    uuid: uuid("uuid"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  }
)
