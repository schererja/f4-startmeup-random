import { type InferSelectModel } from "drizzle-orm";
import {
  type characters,
  type jobs,
  type locations,
  type specialStats,
  type traits,
} from "~/server/db/schema";

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
