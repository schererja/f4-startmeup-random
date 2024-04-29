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
    // create: publicProcedure
    //     .input(z.object({ name: z.string().min(1) }))
    //     .mutation(async ({ ctx, input }) => {
    //         // simulate a slow db call
    //         await new Promise((resolve) => setTimeout(resolve, 1000));

    //         await ctx.db.insert(posts).values({
    //             name: input.name,
    //         });
    //     }),

    getLatest: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.specialStats.findFirst({
            orderBy: (specialStats, { desc }) => [desc(specialStats.createdAt)],
        });
    }),
    // getByCharacterId: publicProcedure.query(({ ctx }) => {
    //     return ctx.db.query.specialStats.findFirst({
    //         orderBy: (specialStats, { desc }) => [desc(specialStats)],
    //     });
    // }),
});
