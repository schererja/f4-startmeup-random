import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("Zod validation schemas", () => {
  describe("character validation", () => {
    const characterSchema = z.object({
      name: z.string().min(1, "Name is required"),
      strength: z.number().int().min(1).max(10),
      perception: z.number().int().min(1).max(10),
      endurance: z.number().int().min(1).max(10),
      charisma: z.number().int().min(1).max(10),
      intelligence: z.number().int().min(1).max(10),
      agility: z.number().int().min(1).max(10),
      luck: z.number().int().min(1).max(10),
    });

    it("validates a correct character", () => {
      const validCharacter = {
        name: "Vault Dweller",
        strength: 5,
        perception: 5,
        endurance: 5,
        charisma: 5,
        intelligence: 5,
        agility: 5,
        luck: 3,
      };

      const result = characterSchema.safeParse(validCharacter);
      expect(result.success).toBe(true);
    });

    it("rejects invalid stat values", () => {
      const invalidCharacter = {
        name: "Vault Dweller",
        strength: 11, // exceeds max
        perception: 5,
        endurance: 5,
        charisma: 5,
        intelligence: 5,
        agility: 5,
        luck: 3,
      };

      const result = characterSchema.safeParse(invalidCharacter);
      expect(result.success).toBe(false);
    });

    it("rejects empty name", () => {
      const invalidCharacter = {
        name: "",
        strength: 5,
        perception: 5,
        endurance: 5,
        charisma: 5,
        intelligence: 5,
        agility: 5,
        luck: 3,
      };

      const result = characterSchema.safeParse(invalidCharacter);
      expect(result.success).toBe(false);
    });

    it("rejects stats below minimum", () => {
      const invalidCharacter = {
        name: "Vault Dweller",
        strength: 0, // below minimum
        perception: 5,
        endurance: 5,
        charisma: 5,
        intelligence: 5,
        agility: 5,
        luck: 3,
      };

      const result = characterSchema.safeParse(invalidCharacter);
      expect(result.success).toBe(false);
    });
  });

  describe("job validation", () => {
    const jobSchema = z.object({
      name: z.string().min(3, "Name must be at least 3 characters"),
    });

    it("validates a correct job", () => {
      const validJob = { name: "Scavenger" };
      const result = jobSchema.safeParse(validJob);
      expect(result.success).toBe(true);
    });

    it("rejects job with too short name", () => {
      const invalidJob = { name: "AB" };
      const result = jobSchema.safeParse(invalidJob);
      expect(result.success).toBe(false);
    });
  });
});
