import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { d2Classes, d2Mercenaries, d2SkillFocuses } from "./schema-d2";

const db = drizzle(sql);

async function main() {
  console.log("Seeding D2 classes...");
  const insertedClasses = await db
    .insert(d2Classes)
    .values([
      {
        name: "Amazon",
        description:
          "A warrior from the islands of the Twin Seas, skilled with bows and javelins",
      },
      {
        name: "Necromancer",
        description:
          "A scholar of the dark arts who commands the dead and harnesses bone and poison magic",
      },
      {
        name: "Barbarian",
        description:
          "A fierce warrior from the northern tribes, master of weapons and battle cries",
      },
      {
        name: "Sorceress",
        description:
          "A wielder of the three elemental magics: fire, ice, and lightning",
      },
      {
        name: "Paladin",
        description:
          "A holy warrior who channels divine power through auras and combat skills",
      },
      {
        name: "Druid",
        description:
          "A shapeshifter and summoner who calls upon the power of nature and the elements",
      },
      {
        name: "Assassin",
        description:
          "A swift martial artist trained to battle the forces of darkness with traps and martial arts",
      },
    ])
    .returning();

  console.log("Seeding D2 mercenaries...");
  await db.insert(d2Mercenaries).values([
    {
      name: "Rogue Scout",
      act: 1,
      description: "A female archer from the Sisterhood of the Sightless Eye",
    },
    {
      name: "Desert Warrior (Combat)",
      act: 2,
      description:
        "A Lut Gholein guard skilled in combat and defensive auras",
    },
    {
      name: "Desert Warrior (Offensive)",
      act: 2,
      description: "Carries offensive auras into battle",
    },
    {
      name: "Desert Warrior (Defensive)",
      act: 2,
      description: "Masters defensive aura magic",
    },
    {
      name: "Iron Wolf",
      act: 3,
      description:
        "A sorcerer mercenary from the jungles of Kurast",
    },
    {
      name: "Barbarian",
      act: 5,
      description: "A fierce warrior from the Barbarian tribes of Mount Arreat",
    },
  ]);

  // Map class name → uuid for skill focus seeding
  const classMap = new Map(insertedClasses.map((c) => [c.name, c.uuid]));

  const skillFocusData: {
    name: string;
    classUUID: string;
    description: string;
  }[] = [];

  const addClass = (
    className: string,
    focuses: { name: string; description: string }[],
  ) => {
    const classUUID = classMap.get(className);
    if (!classUUID) throw new Error(`Class not found: ${className}`);
    focuses.forEach((f) => skillFocusData.push({ ...f, classUUID }));
  };

  addClass("Amazon", [
    { name: "Bowzon", description: "Bow-focused Amazon build" },
    { name: "Javazon", description: "Javelin and spear-focused Amazon build" },
    { name: "Fendazon", description: "Fend skill-focused Amazon build" },
  ]);

  addClass("Necromancer", [
    {
      name: "Summoner",
      description: "Skeleton and golem summoning Necromancer build",
    },
    {
      name: "Bone Necro",
      description: "Bone spear and spirit-focused Necromancer build",
    },
    {
      name: "Poison Necro",
      description: "Poison and bone-focused Necromancer build",
    },
  ]);

  addClass("Barbarian", [
    {
      name: "Whirlwind Barb",
      description: "Whirlwind skill-focused Barbarian build",
    },
    {
      name: "Berserk Barb",
      description: "Berserk skill-focused Barbarian build",
    },
    {
      name: "Frenzy Barb",
      description: "Frenzy skill-focused Barbarian build",
    },
  ]);

  addClass("Sorceress", [
    {
      name: "Blizzard Sorc",
      description: "Cold/Blizzard-focused Sorceress build",
    },
    {
      name: "Fireball Sorc",
      description: "Fire/Fireball-focused Sorceress build",
    },
    {
      name: "Lightning Sorc",
      description: "Lightning-focused Sorceress build",
    },
    {
      name: "Meteorb",
      description: "Hybrid Meteor and Frozen Orb Sorceress build",
    },
  ]);

  addClass("Paladin", [
    {
      name: "Hammerdin",
      description: "Blessed Hammer-focused Paladin build",
    },
    { name: "Zealot", description: "Zeal skill-focused Paladin build" },
    {
      name: "Smiter",
      description: "Smite skill-focused Paladin build for boss killing",
    },
    {
      name: "FoH Paladin",
      description: "Fist of the Heavens-focused Paladin build",
    },
  ]);

  addClass("Druid", [
    {
      name: "Wind Druid",
      description: "Tornado and Hurricane-focused Druid build",
    },
    { name: "Fire Druid", description: "Fire skills-focused Druid build" },
    {
      name: "Summoner Druid",
      description: "Summon-focused Druid build with wolves and ravens",
    },
    {
      name: "Werebear",
      description: "Werebear shapeshifting Druid build",
    },
    {
      name: "Werewolf",
      description: "Werewolf shapeshifting Druid build",
    },
  ]);

  addClass("Assassin", [
    { name: "Trapsin", description: "Trap-focused Assassin build" },
    {
      name: "Kicksin",
      description: "Dragon Talon kick-focused Assassin build",
    },
    {
      name: "Martial Arts Assassin",
      description: "Charged strikes and finishing moves Assassin build",
    },
  ]);

  console.log("Seeding D2 skill focuses...");
  await db.insert(d2SkillFocuses).values(skillFocusData);

  console.log("D2 seed complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
