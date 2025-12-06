import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { characters, specialStats } from "~/server/db/schema";

export const characterRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(256),
        specialStats: z.object({
          strength: z.number().int().min(1).max(10),
          perception: z.number().int().min(1).max(10),
          endurance: z.number().int().min(1).max(10),
          charisma: z.number().int().min(1).max(10),
          intelligence: z.number().int().min(1).max(10),
          agility: z.number().int().min(1).max(10),
          luck: z.number().int().min(1).max(10),
        }),
        job: z.object({
          name: z.string().min(1),
          uuid: z.string().uuid(),
        }),
        trait: z.object({
          name: z.string().min(1),
          uuid: z.string().uuid(),
        }),
        location: z.object({
          name: z.string().min(1),
          uuid: z.string().uuid(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const insertedStats = await ctx.db
        .insert(specialStats)
        .values({
          strength: input.specialStats.strength,
          perception: input.specialStats.perception,
          endurance: input.specialStats.endurance,
          charisma: input.specialStats.charisma,
          intelligence: input.specialStats.intelligence,
          agility: input.specialStats.agility,
          luck: input.specialStats.luck,
          userId: ctx.userId,
        })
        .returning();

      const statsRecord = insertedStats[0];
      if (!statsRecord?.uuid) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create special stats",
        });
      }

      const result = await ctx.db
        .insert(characters)
        .values({
          name: input.name,
          userId: ctx.userId,
          specialStats: statsRecord.uuid,
          jobsUUID: input.job.uuid,
          traitsUUID: input.trait.uuid,
          locationsUUID: input.location.uuid,
        })
        .returning();

      return result[0];
    }),
  getByUUID: publicProcedure
    .input(z.object({ uuid: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const character = await ctx.db.query.characters.findFirst({
        where: (users, { eq }) => eq(users.uuid, input.uuid),
      });

      if (!character) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Character not found",
        });
      }

      const characterStatsID = character.specialStats;
      const jobUUID = character.jobsUUID;
      const traitUUID = character.traitsUUID;
      const locationUUID = character.locationsUUID;

      if (!characterStatsID || !locationUUID || !traitUUID || !jobUUID) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Character data is incomplete",
        });
      }

      const [characterStats, job, trait, location] = await Promise.all([
        ctx.db.query.specialStats.findFirst({
          where: (specialStats, { eq }) =>
            eq(specialStats.uuid, characterStatsID),
        }),
        ctx.db.query.jobs.findFirst({
          where: (jobs, { eq }) => eq(jobs.uuid, jobUUID),
        }),
        ctx.db.query.traits.findFirst({
          where: (traits, { eq }) => eq(traits.uuid, traitUUID),
        }),
        ctx.db.query.locations.findFirst({
          where: (locations, { eq }) => eq(locations.uuid, locationUUID),
        }),
      ]);

      if (!characterStats || !job || !trait || !location) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch related character data",
        });
      }

      return {
        character,
        specialStats: characterStats,
        job,
        trait,
        location,
      };
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.characters.findMany({
      where: (characters, { eq }) => eq(characters.userId, ctx.userId),
      orderBy: (characters, { desc }) => [desc(characters.createdAt)],
    });
  }),
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userCharacters = await ctx.db.query.characters.findMany({
      where: (characters, { eq }) => eq(characters.userId, ctx.userId),
    });

    const characterCount = userCharacters.length;

    // Get all special stats for user's characters
    const allSpecialStats = await Promise.all(
      userCharacters.map(async (char) => {
        return ctx.db.query.specialStats.findFirst({
          where: (specialStats, { eq }) =>
            eq(specialStats.uuid, char.specialStats),
        });
      }),
    );

    // Calculate average SPECIAL stats
    const validStats = allSpecialStats.filter((stat) => stat !== undefined);
    const avgStats =
      validStats.length > 0
        ? {
            strength: Math.round(
              validStats.reduce((sum, stat) => sum + (stat.strength ?? 0), 0) /
                validStats.length,
            ),
            perception: Math.round(
              validStats.reduce(
                (sum, stat) => sum + (stat.perception ?? 0),
                0,
              ) / validStats.length,
            ),
            endurance: Math.round(
              validStats.reduce((sum, stat) => sum + (stat.endurance ?? 0), 0) /
                validStats.length,
            ),
            charisma: Math.round(
              validStats.reduce((sum, stat) => sum + (stat.charisma ?? 0), 0) /
                validStats.length,
            ),
            intelligence: Math.round(
              validStats.reduce(
                (sum, stat) => sum + (stat.intelligence ?? 0),
                0,
              ) / validStats.length,
            ),
            agility: Math.round(
              validStats.reduce((sum, stat) => sum + (stat.agility ?? 0), 0) /
                validStats.length,
            ),
            luck: Math.round(
              validStats.reduce((sum, stat) => sum + (stat.luck ?? 0), 0) /
                validStats.length,
            ),
          }
        : null;

    // Get most used traits, jobs, locations
    const traitCounts = new Map<string, number>();
    const jobCounts = new Map<string, number>();
    const locationCounts = new Map<string, number>();

    userCharacters.forEach((char) => {
      traitCounts.set(
        char.traitsUUID,
        (traitCounts.get(char.traitsUUID) ?? 0) + 1,
      );
      jobCounts.set(char.jobsUUID, (jobCounts.get(char.jobsUUID) ?? 0) + 1);
      locationCounts.set(
        char.locationsUUID,
        (locationCounts.get(char.locationsUUID) ?? 0) + 1,
      );
    });

    // Get the most popular trait, job, and location
    const mostUsedTraitUuid =
      traitCounts.size > 0
        ? [...traitCounts.entries()].reduce((a, b) => (a[1] > b[1] ? a : b))[0]
        : null;
    const mostUsedJobUuid =
      jobCounts.size > 0
        ? [...jobCounts.entries()].reduce((a, b) => (a[1] > b[1] ? a : b))[0]
        : null;
    const mostUsedLocationUuid =
      locationCounts.size > 0
        ? [...locationCounts.entries()].reduce((a, b) =>
            a[1] > b[1] ? a : b,
          )[0]
        : null;

    const [mostUsedTrait, mostUsedJob, mostUsedLocation] = await Promise.all([
      mostUsedTraitUuid
        ? ctx.db.query.traits.findFirst({
            where: (traits, { eq }) => eq(traits.uuid, mostUsedTraitUuid),
          })
        : null,
      mostUsedJobUuid
        ? ctx.db.query.jobs.findFirst({
            where: (jobs, { eq }) => eq(jobs.uuid, mostUsedJobUuid),
          })
        : null,
      mostUsedLocationUuid
        ? ctx.db.query.locations.findFirst({
            where: (locations, { eq }) =>
              eq(locations.uuid, mostUsedLocationUuid),
          })
        : null,
    ]);

    return {
      characterCount,
      averageStats: avgStats,
      mostUsedTrait: mostUsedTrait
        ? {
            name: mostUsedTrait.name,
            count: traitCounts.get(mostUsedTraitUuid!),
          }
        : null,
      mostUsedJob: mostUsedJob
        ? { name: mostUsedJob.name, count: jobCounts.get(mostUsedJobUuid!) }
        : null,
      mostUsedLocation: mostUsedLocation
        ? {
            name: mostUsedLocation.name,
            count: locationCounts.get(mostUsedLocationUuid!),
          }
        : null,
    };
  }),
});
