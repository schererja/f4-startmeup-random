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
});
