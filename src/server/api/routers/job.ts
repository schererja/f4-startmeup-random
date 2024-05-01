import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { jobs } from "~/server/db/schema";

export const jobsRouter = createTRPCRouter({

    create: publicProcedure
        .input(z.object({
            name: z.string().min(3),
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.insert(jobs).values({
                name: input.name,
            });
        }),
    getAll: publicProcedure
        .query(async ({ ctx }) => {
            return ctx.db.query.jobs.findMany();
        }),
});
