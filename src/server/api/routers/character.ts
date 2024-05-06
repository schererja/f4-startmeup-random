import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { characters, jobs, locations, specialStats, traits } from "~/server/db/schema";

export const characterRouter = createTRPCRouter({
    // hello: publicProcedure
    //     .input(z.object({ text: z.string() }))
    //     .query(({ input }) => {
    //         return {
    //             greeting: `Hello ${input.text}`,
    //         };
    //     }),

    create: publicProcedure
        .input(z.object({
            name: z.string().min(1),
            specialStats: z.object({
                strength: z.number(),
                perception: z.number(),
                endurance: z.number(),
                charisma: z.number(),
                intelligence: z.number(),
                agility: z.number(),
                luck: z.number(),
            }),
            job: z.object({
                name: z.string().min(1),
                uuid: z.string(),
            }),
            trait: z.object({
                name: z.string().min(1),
                uuid: z.string(),
            }),
            location: z.object({ name: z.string().min(1), uuid: z.string() }),
        }))
        .mutation(async ({ ctx, input }) => {
            const insertedStats = await ctx.db.insert(specialStats).values({
                strength: input.specialStats.strength,
                perception: input.specialStats.perception,
                endurance: input.specialStats.endurance,
                charisma: input.specialStats.charisma,
                intelligence: input.specialStats.intelligence,
                agility: input.specialStats.agility,
                luck: input.specialStats.luck,
            }).returning();


            await ctx.db.insert(characters).values({
                name: input.name,
                specialStats: insertedStats[0]?.uuid,
                jobsUUID: input.job.uuid,
                traitsUUID: input.trait.uuid,
                locationsUUID: input.location.uuid,
            });
        }),

});
