import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { specialStats } from "~/server/db/schema";

export const specialsRouter = createTRPCRouter({
  // hello: publicProcedure
  //     .input(z.object({ text: z.string() }))
  //     .query(({ input }) => {
  //         return {
  //             greeting: `Hello ${input.text}`,
  //         };
  //     }),
  create: protectedProcedure
    .input(
      z.object({
        strength: z.number(),
        perception: z.number(),
        endurance: z.number(),
        charisma: z.number(),
        intelligence: z.number(),
        agility: z.number(),
        luck: z.number(),
        uuid: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(specialStats).values({
        strength: input.strength,
        perception: input.perception,
        endurance: input.endurance,
        charisma: input.charisma,
        intelligence: input.intelligence,
        agility: input.agility,
        luck: input.luck,
        userId: ctx.userId,
        createdAt: new Date(),
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.specialStats.findFirst({
      where: (specialStats, { eq }) => eq(specialStats.userId, ctx.userId),
      orderBy: (specialStats, { desc }) => [desc(specialStats.createdAt)],
    });
  }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.specialStats.findMany({
      where: (specialStats, { eq }) => eq(specialStats.userId, ctx.userId),
    });
  }),
  update: protectedProcedure
    .input(
      z.object({
        uuid: z.string().uuid(),
        strength: z.number().int().min(1).max(10),
        perception: z.number().int().min(1).max(10),
        endurance: z.number().int().min(1).max(10),
        charisma: z.number().int().min(1).max(10),
        intelligence: z.number().int().min(1).max(10),
        agility: z.number().int().min(1).max(10),
        luck: z.number().int().min(1).max(10),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const stat = await ctx.db.query.specialStats.findFirst({
        where: (specialStats, { eq }) => eq(specialStats.uuid, input.uuid),
      });

      if (!stat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Special stats not found",
        });
      }

      if (stat.userId !== ctx.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You do not have permission to update these stats",
        });
      }

      await ctx.db
        .update(specialStats)
        .set({
          strength: input.strength,
          perception: input.perception,
          endurance: input.endurance,
          charisma: input.charisma,
          intelligence: input.intelligence,
          agility: input.agility,
          luck: input.luck,
          updatedAt: new Date(),
        })
        .where(eq(specialStats.uuid, input.uuid));

      return { success: true };
    }),
  // getByCharacterId: publicProcedure.query(({ ctx }) => {
  //     return ctx.db.query.specialStats.findFirst({
  //         orderBy: (specialStats, { desc }) => [desc(specialStats)],
  //     });
  // }),
});
