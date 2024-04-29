import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { character } from "~/server/db/schema";

export const characterRouter = createTRPCRouter({
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

        return ctx.db.query.character.findFirst({
            orderBy: (character, { desc }) => [desc(character.createdAt)],
        });
    }),
});
