import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { specialStats } from "~/server/db/schema";

export const specialsRouter = createTRPCRouter({
    // hello: publicProcedure
    //     .input(z.object({ text: z.string() }))
    //     .query(({ input }) => {
    //         return {
    //             greeting: `Hello ${input.text}`,
    //         };
    //     }),
    create: publicProcedure
        .input(z.object({
            strength: z.number(),
            perception: z.number(),
            endurance: z.number(),
            charisma: z.number(),
            intelligence: z.number(),
            agility: z.number(),
            luck: z.number(),
            uuid: z.string(),
        }))
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
                createdAt: new Date()
            });
        }),

    getLatest: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.specialStats.findFirst({
            orderBy: (specialStats, { desc }) => [desc(specialStats.createdAt)],
        });
    }),
    getAll: publicProcedure
        .query(async ({ ctx }) => {
            return ctx.db.query.specialStats.findMany();
        }),
    // getByCharacterId: publicProcedure.query(({ ctx }) => {
    //     return ctx.db.query.specialStats.findFirst({
    //         orderBy: (specialStats, { desc }) => [desc(specialStats)],
    //     });
    // }),
});
