import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { traits } from "~/server/db/schema";

export const traitsRouter = createTRPCRouter({

    create: publicProcedure
        .input(z.object({
            name: z.string().min(3),
            description: z.string().min(3)
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.insert(traits).values({
                name: input.name,
                description: input.description,
            });
        }),
    getAll: publicProcedure
        .query(async ({ ctx }) => {
            return ctx.db.query.traits.findMany();
        }),
});
