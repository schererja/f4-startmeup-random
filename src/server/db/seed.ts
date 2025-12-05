import "~/env.js";
import { db } from "~/server/db";
import { traits, jobs, locations } from "~/server/db/schema";

const defaultTraits = [
  {
    name: "Broad Shoulders",
    description:
      "Your broad shoulders add +25 to your carrying capacity (+15 in Survival mode), but due to your high center of gravity, you are more likely to be staggered by incoming blows.",
  },
  {
    name: "Bruiser",
    description:
      "A little slower, but a little bigger. You may not hit as often, but they will feel it when you do! Power attacks deal 30% more damage, but cost 30% more Action Points to perform.",
  },
  {
    name: "Claustrophobia",
    description:
      "You have a fear of enclosed spaces. You gain +1 to all SPECIAL attributes when outside, but suffer -1 when indoors.",
  },
  {
    name: "Early Bird",
    description:
      "Hey early risers! Enjoy a +2 to each of your SPECIAL attributes from 6 am to 12 pm, but suffer -1 from 6 pm to 6 am when you're not at your best.",
  },
  {
    name: "Fast Metabolism",
    description:
      "Your metabolic rate is twice normal. This means that you are half as resistant to radiation and poison, but your body heals at double the normal pace.",
  },
  {
    name: "Fast Shot",
    description:
      "You don't have time to aim for a targeted attack, because you attack faster than normal people. Automatic and magazined weapons fire 20% faster, and AP costs are 20% lower, but you are 20% less accurate.",
  },
  {
    name: "Finesse",
    description:
      "Your attacks show a lot of finesse. You don't do as much damage (-30% for normal attacks), but you cause more critical hits (10% constant chance any time).",
  },
  {
    name: "Four Eyes",
    description:
      "While wearing any type of eyewear, you have +1 Perception. Without eyewear, you have -1 Perception.",
  },
  {
    name: "Gifted",
    description:
      "You have more innate abilities than most, so you have not spent as much time honing your skills. You gain a permanent +2 to each SPECIAL stat, but gain experience at half the normal rate.",
  },
  {
    name: "Good Natured",
    description:
      "You studied less-combative skills as you were growing up. People are 20% easier to persuade, vendor prices are 20% better, but your overall damage is reduced by 15%.",
  },
  {
    name: "Heavy Handed",
    description:
      "You swing harder, but expend more energy. Your melee attacks do 20% more damage and are more likely to stagger, but cost 20% more action points.",
  },
  {
    name: "Hot Blooded",
    description:
      "When your health drops below 50% you gain +15% more damage, but you also suffer -2 to your Agility and Perception attributes.",
  },
  {
    name: "Kamikaze",
    description:
      "You boldness grants you +20 Action Points and +10% Action Point refresh rate, but your reckless nature causes you to take 20% more damage from weapons, explosions, and radiation.",
  },
  {
    name: "Loose Cannon",
    description:
      "You love big guns, but your enthusiasm means you get carried away. Heavy weapons do 30% more damage, but are 30% less accurate.",
  },
  {
    name: "Night Owl",
    description:
      "Staying up late, you a +2 to each of your SPECIAL attributes from midnight to 6 am, but suffer -1 from 6 am to 6 pm when you're not at your best.",
  },
  {
    name: "Small Frame",
    description:
      "You are not quite as big as other people, but that never slowed you down. You gain +2 Agility, but your limbs are 20% more easily crippled.",
  },
  {
    name: "Trigger Discipline",
    description:
      "While using ranged weapons, you fire 20% more slowly but are 20% more accurate.",
  },
  {
    name: "Unsightly",
    description:
      "You may be good or bad, but you're definitely ugly. While wearing any type of mask, you get a confidence boost for +2 Charisma. With a bare face, you have -2 Charisma.",
  },
];

const defaultJobs = [
  { name: "Vault Enthusiast" },
  { name: "Survivalist" },
  { name: "Scavenger" },
  { name: "Hunter" },
  { name: "Raider (not allied with faction)" },
  { name: "Mechanic" },
  { name: "Gangster" },
  { name: "Trader" },
  { name: "Farmer" },
  { name: "Drunk" },
  { name: "Doctor" },
  { name: "Scientist" },
  { name: "Mercenary" },
  { name: "Ballplayer" },
  { name: "Drifter / Thug" },
  { name: "Thief" },
  { name: "Sailor" },
  { name: "Greaser" },
  { name: "Scout / Sniper" },
  { name: "Radiation Explorer" },
  {
    name: "Brotherhood of Steel Initiate (no power armor, not allied with faction)",
  },
  { name: "Railroad Tourist (not allied with faction)" },
  { name: "Escaped Synth (not allied with faction)" },
  { name: "Minuteman/woman (not allied with faction)" },
  { name: "Church of Atom Novice (not allied with faction)" },
  { name: "Gunner Conscript (not allied with faction)" },
  { name: "Forged member (not allied with faction)" },
  { name: "Chinese Agent" },
  { name: "Wealthy wastelander" },
  { name: "Poor wastelander" },
  { name: "Cannibal" },
  {
    name: "Enclave remnant (must have installed one of: Enclave X-02 or Enclave X-03 or Enclave Officer (standalone version) - you get power armor, but no frame)",
  },
  { name: "NCR Ranger (must have NCR Ranger installed)" },
  {
    name: "Rust Devil (must have Automatron installed; not allied with faction)",
  },
  { name: "Trapper (must have Far Harbor installed; not allied with faction)" },
  {
    name: "Pack member (must have Nuka World installed; not allied with faction)",
  },
  {
    name: "Operators member (must have Nuka World installed; not allied with faction)",
  },
  {
    name: "Disciples member (must have Nuka World installed; not allied with faction)",
  },
];

const defaultLocations = [
  {
    name: "Inside Vault 111",
    description:
      "In the cryopod. IMPORTANT NOTE: if you want the alt-start story that makes the most sense, you should start in the vault. You are released by mistake (instead of Nate/Nora, who are dead in their pods), as a pre-war vault-dweller.",
  },
  {
    name: "Outside Vault 111",
    description: "Recommended class: vault enthusiast",
  },
  {
    name: "Sanctuary Root Cellar",
    description: "Recommended class: survivalist",
  },
  {
    name: "Robotics Disposal Ground",
    description: "Recommended class: scavenger",
  },
  {
    name: "Ranger Cabin",
    description: "SW of Sanctuary. Recommended class: hunter",
  },
  {
    name: "Raider group",
    description: "NW of Sanctuary. Recommended class: raider or mercenary",
  },
  {
    name: "Red Rocket",
    description: "South of Sanctuary. Recommended class: mechanic",
  },
  {
    name: "Concord house",
    description: "",
  },
  {
    name: "Old bus",
    description: "SW of Concord. Recommended class: drunk",
  },
  {
    name: "Drumlin Diner",
    description: "Recommended class: trader",
  },
  {
    name: "Tenpines Bluff",
    description: "Recommended class: farmer",
  },
  {
    name: "Lonely Chapel",
    description: "",
  },
  {
    name: "Rocky Narrows Park",
    description: "",
  },
  {
    name: "Wildwood Cemetery",
    description: "",
  },
  {
    name: "Lake Quannapowitt",
    description: "",
  },
  {
    name: "Relay Tower 1DL-109",
    description: "In SE part of map",
  },
  {
    name: "Union Hope Cathedral",
    description: "",
  },
  {
    name: "Vault 81 (outside)",
    description: "Recommended class: vault enthusiast",
  },
  {
    name: "Diamond City outskirts",
    description: "Recommended class: baseballer or citizens",
  },
  {
    name: "Boylston Club",
    description: "Recommended class: wealthy citizen",
  },
  {
    name: "Goodneighbor",
    description: "Recommended class: thug, thief, etc.",
  },
  {
    name: "Bunker Hill",
    description: "Recommended class: trader, doctor",
  },
  {
    name: "Relay Tower 0MC-810",
    description: "In NE part of map",
  },
  {
    name: "Greentop Nursery",
    description: "Recommended class: farmer",
  },
  {
    name: "Roadside Pines motel",
    description: "Recommended class: raider or mercenary",
  },
  {
    name: "Egret Tours Marina",
    description: "Recommended class: sailor",
  },
  {
    name: "Fairline Hill Estates",
    description: "",
  },
  {
    name: "South Boston",
    description: "Near the Castle",
  },
  {
    name: "Crater of Atom",
    description: "Recommended class: Atom novice",
  },
  {
    name: "Somerville Place",
    description: "",
  },
  {
    name: "Parson's Creamery",
    description: "",
  },
  {
    name: "Glowing Sea",
    description: "Recommended class: radiation explorer",
  },
  {
    name: "Outside Quincy",
    description: "Recommended class: sniper, scout",
  },
  {
    name: "Atom Cats Garage",
    description: "Recommended class: greaser",
  },
  {
    name: "Near Spectacle Island",
    description: "Recommended class: sailor",
  },
  {
    name: "Murkwater",
    description: "In far SE swamps",
  },
  {
    name: "Nordhagen Beach",
    description: "Recommended class: farmer",
  },
  {
    name: "Nahant Oceanological Society",
    description: "Recommended class: scientist",
  },
  {
    name: "Hugo's Hole",
    description: "In Dunwich Borers",
  },
];

async function seedTraits() {
  console.log("🌱 Seeding traits...");

  try {
    // Check if traits already exist
    const existingTraits = await db.query.traits.findMany();

    if (existingTraits.length > 0) {
      console.log(
        `ℹ️  Found ${existingTraits.length} existing traits. Skipping seed.`,
      );
      console.log("💡 If you want to re-seed, delete all traits first.");
      return;
    }

    // Insert all traits
    await db.insert(traits).values(defaultTraits);

    console.log(`✅ Successfully seeded ${defaultTraits.length} traits!`);
  } catch (error) {
    console.error("❌ Error seeding traits:", error);
    throw error;
  }
}

async function seedJobs() {
  console.log("🌱 Seeding jobs...");

  try {
    // Check if jobs already exist
    const existingJobs = await db.query.jobs.findMany();

    if (existingJobs.length > 0) {
      console.log(
        `ℹ️  Found ${existingJobs.length} existing jobs. Skipping seed.`,
      );
      console.log("💡 If you want to re-seed, delete all jobs first.");
      return;
    }

    // Insert all jobs
    await db.insert(jobs).values(defaultJobs);

    console.log(`✅ Successfully seeded ${defaultJobs.length} jobs!`);
  } catch (error) {
    console.error("❌ Error seeding jobs:", error);
    throw error;
  }
}

async function seedLocations() {
  console.log("🌱 Seeding locations...");

  try {
    // Check if locations already exist
    const existingLocations = await db.query.locations.findMany();

    if (existingLocations.length > 0) {
      console.log(
        `ℹ️  Found ${existingLocations.length} existing locations. Skipping seed.`,
      );
      console.log("💡 If you want to re-seed, delete all locations first.");
      return;
    }

    // Insert all locations
    await db.insert(locations).values(defaultLocations);

    console.log(`✅ Successfully seeded ${defaultLocations.length} locations!`);
  } catch (error) {
    console.error("❌ Error seeding locations:", error);
    throw error;
  }
}

// Run the seed functions
Promise.all([seedTraits(), seedJobs(), seedLocations()])
  .then(() => {
    console.log("🎉 Seed completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seed failed:", error);
    process.exit(1);
  });
