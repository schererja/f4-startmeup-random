import { type InferSelectModel } from "drizzle-orm";
import {
  type characters,
  type jobs,
  type locations,
  type specialStats,
  type traits,
} from "~/server/db/schema";
import {
  type d2Characters,
  type d2Classes,
  type d2Mercenaries,
  type d2SkillFocuses,
} from "~/server/db/schema-d2";

// Infer types from the schema
export type Character = InferSelectModel<typeof characters>;
export type Job = InferSelectModel<typeof jobs>;
export type Location = InferSelectModel<typeof locations>;
export type SpecialStats = InferSelectModel<typeof specialStats>;
export type Trait = InferSelectModel<typeof traits>;

// Composite type for full character data
export type FullCharacter = {
  character: Character;
  specialStats: SpecialStats;
  job: Job;
  trait: Trait;
  location: Location;
};

// D2 types
export type D2Character = InferSelectModel<typeof d2Characters>;
export type D2Class = InferSelectModel<typeof d2Classes>;
export type D2Mercenary = InferSelectModel<typeof d2Mercenaries>;
export type D2SkillFocus = InferSelectModel<typeof d2SkillFocuses>;

export type FullD2Character = {
  character: D2Character;
  class: D2Class;
  mercenary: D2Mercenary | null;
  skillFocuses: D2SkillFocus[];
};

export type CreateD2CharacterInput = {
  name: string;
  classUUID: string;
  mercenaryUUID?: string;
  difficulty: "Normal" | "Nightmare" | "Hell";
  startingAct: 1 | 2 | 3 | 4 | 5;
};

// Input types for creating entities
export type CreateCharacterInput = {
  name: string;
  specialStats: {
    strength: number;
    perception: number;
    endurance: number;
    charisma: number;
    intelligence: number;
    agility: number;
    luck: number;
  };
  job: {
    name: string;
    uuid: string;
  };
  trait: {
    name: string;
    uuid: string;
  };
  location: {
    name: string;
    uuid: string;
  };
};
