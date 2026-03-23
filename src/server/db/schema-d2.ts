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

export const createD2Table = pgTableCreator((name) => `d2_${name}`);

export const d2Classes = createD2Table(
  "classes",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 1024 }),
    uuid: uuid("uuid")
      .default(sql`gen_random_uuid()`)
      .notNull()
      .unique(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (d2Class) => ({
    nameIndex: index("d2_class_name_idx").on(d2Class.name),
  }),
);

export const d2Mercenaries = createD2Table(
  "mercenaries",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    act: integer("act").notNull(),
    description: varchar("description", { length: 1024 }),
    uuid: uuid("uuid")
      .default(sql`gen_random_uuid()`)
      .notNull()
      .unique(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (merc) => ({
    nameIndex: index("d2_merc_name_idx").on(merc.name),
    actIndex: index("d2_merc_act_idx").on(merc.act),
  }),
);

export const d2SkillFocuses = createD2Table(
  "skill_focuses",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    classUUID: uuid("classUUID")
      .references(() => d2Classes.uuid)
      .notNull(),
    description: varchar("description", { length: 1024 }),
    uuid: uuid("uuid")
      .default(sql`gen_random_uuid()`)
      .notNull()
      .unique(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (focus) => ({
    nameIndex: index("d2_skill_focus_name_idx").on(focus.name),
    classUUIDIndex: index("d2_skill_focus_class_idx").on(focus.classUUID),
  }),
);

export const d2Characters = createD2Table(
  "characters",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    userId: varchar("userId", { length: 256 }).notNull(),
    uuid: uuid("uuid")
      .default(sql`gen_random_uuid()`)
      .notNull()
      .unique(),
    classUUID: uuid("classUUID")
      .references(() => d2Classes.uuid)
      .notNull(),
    mercenaryUUID: uuid("mercenaryUUID").references(() => d2Mercenaries.uuid),
    difficulty: varchar("difficulty", { length: 64 }).notNull(),
    startingAct: integer("startingAct").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (char) => ({
    userIdIndex: index("d2_character_userId_idx").on(char.userId),
    uuidIndex: index("d2_character_uuid_idx").on(char.uuid),
  }),
);
