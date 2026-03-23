import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { d2Characters } from "~/server/db/schema-d2";

export const d2CharacterRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(256),
        classUUID: z.string().uuid(),
        mercenaryUUID: z.string().uuid().optional(),
        difficulty: z.enum(["Normal", "Nightmare", "Hell"]),
        startingAct: z.number().int().min(1).max(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(d2Characters)
        .values({
          name: input.name,
          userId: ctx.userId,
          classUUID: input.classUUID,
          mercenaryUUID: input.mercenaryUUID ?? null,
          difficulty: input.difficulty,
          startingAct: input.startingAct,
        })
        .returning();

      const character = result[0];
      if (!character) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create D2 character",
        });
      }

      return character;
    }),

  getByUUID: publicProcedure
    .input(z.object({ uuid: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const character = await ctx.db.query.d2Characters.findFirst({
        where: (chars, { eq }) => eq(chars.uuid, input.uuid),
      });

      if (!character) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "D2 Character not found",
        });
      }

      const [d2Class, mercenary] = await Promise.all([
        ctx.db.query.d2Classes.findFirst({
          where: (classes, { eq }) => eq(classes.uuid, character.classUUID),
        }),
        character.mercenaryUUID
          ? ctx.db.query.d2Mercenaries.findFirst({
              where: (mercs, { eq }) =>
                eq(mercs.uuid, character.mercenaryUUID!),
            })
          : Promise.resolve(null),
      ]);

      if (!d2Class) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Character class data is missing",
        });
      }

      const skillFocuses = await ctx.db.query.d2SkillFocuses.findMany({
        where: (focuses, { eq }) => eq(focuses.classUUID, character.classUUID),
      });

      return {
        character,
        class: d2Class,
        mercenary: mercenary ?? null,
        skillFocuses,
      };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.d2Characters.findMany({
      where: (chars, { eq }) => eq(chars.userId, ctx.userId),
      orderBy: (chars, { desc }) => [desc(chars.createdAt)],
    });
  }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userCharacters = await ctx.db.query.d2Characters.findMany({
      where: (chars, { eq }) => eq(chars.userId, ctx.userId),
    });

    const characterCount = userCharacters.length;

    // Tally class, merc, and difficulty counts
    const classCounts = new Map<string, number>();
    const mercCounts = new Map<string, number>();
    const difficultyCounts = new Map<string, number>();

    userCharacters.forEach((char) => {
      classCounts.set(char.classUUID, (classCounts.get(char.classUUID) ?? 0) + 1);
      if (char.mercenaryUUID) {
        mercCounts.set(
          char.mercenaryUUID,
          (mercCounts.get(char.mercenaryUUID) ?? 0) + 1,
        );
      }
      difficultyCounts.set(
        char.difficulty,
        (difficultyCounts.get(char.difficulty) ?? 0) + 1,
      );
    });

    const mostUsedClassUUID =
      classCounts.size > 0
        ? [...classCounts.entries()].reduce((a, b) => (a[1] > b[1] ? a : b))[0]
        : null;

    const mostUsedMercUUID =
      mercCounts.size > 0
        ? [...mercCounts.entries()].reduce((a, b) => (a[1] > b[1] ? a : b))[0]
        : null;

    const [mostUsedClass, mostUsedMerc] = await Promise.all([
      mostUsedClassUUID
        ? ctx.db.query.d2Classes.findFirst({
            where: (classes, { eq }) => eq(classes.uuid, mostUsedClassUUID),
          })
        : null,
      mostUsedMercUUID
        ? ctx.db.query.d2Mercenaries.findFirst({
            where: (mercs, { eq }) => eq(mercs.uuid, mostUsedMercUUID),
          })
        : null,
    ]);

    return {
      characterCount,
      mostUsedClass: mostUsedClass
        ? {
            name: mostUsedClass.name,
            count: classCounts.get(mostUsedClassUUID!),
          }
        : null,
      mostUsedMerc: mostUsedMerc
        ? {
            name: mostUsedMerc.name,
            count: mercCounts.get(mostUsedMercUUID!),
          }
        : null,
      difficultyDistribution: Object.fromEntries(difficultyCounts),
    };
  }),
});
