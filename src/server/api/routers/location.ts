import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { locations } from "~/server/db/schema";

export const locationsRouter = createTRPCRouter({

    create: publicProcedure
        .input(z.object({
            name: z.string().min(3),
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.insert(locations).values({
                name: input.name,
            });
        }),
    getAll: publicProcedure
        .query(async ({ ctx }) => {
            return ctx.db.query.locations.findMany();
        }),
});
