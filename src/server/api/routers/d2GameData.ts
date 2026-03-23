import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const d2GameDataRouter = createTRPCRouter({
  getClasses: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.d2Classes.findMany({
      orderBy: (classes, { asc }) => [asc(classes.name)],
    });
  }),

  getMercenaries: publicProcedure
    .input(z.object({ act: z.number().int().min(1).max(5).optional() }))
    .query(async ({ ctx, input }) => {
      if (input.act !== undefined) {
        return ctx.db.query.d2Mercenaries.findMany({
          where: (mercs, { eq }) => eq(mercs.act, input.act!),
          orderBy: (mercs, { asc }) => [asc(mercs.name)],
        });
      }
      return ctx.db.query.d2Mercenaries.findMany({
        orderBy: (mercs, { asc }) => [asc(mercs.act), asc(mercs.name)],
      });
    }),

  getSkillFocuses: publicProcedure
    .input(z.object({ classUUID: z.string().uuid().optional() }))
    .query(async ({ ctx, input }) => {
      if (input.classUUID !== undefined) {
        return ctx.db.query.d2SkillFocuses.findMany({
          where: (focuses, { eq }) => eq(focuses.classUUID, input.classUUID!),
          orderBy: (focuses, { asc }) => [asc(focuses.name)],
        });
      }
      return ctx.db.query.d2SkillFocuses.findMany({
        orderBy: (focuses, { asc }) => [asc(focuses.name)],
      });
    }),
});
