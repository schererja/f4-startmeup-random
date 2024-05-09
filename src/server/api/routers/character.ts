import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { characters, specialStats } from "~/server/db/schema";

export const characterRouter = createTRPCRouter({


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
    getByUUID: publicProcedure
        .input(z.object({ uuid: z.string() }))
        .query(async ({ ctx, input }) => {

            let character = await ctx.db.query.characters.findFirst({

                where: (users, { eq }) => eq(users.uuid, input.uuid),

            })
            if (!character) return null
            const characterStatsID = character.specialStats
            const jobUUID = character.jobsUUID
            const traitUUID = character.traitsUUID
            const locationUUID = character.locationsUUID
            if (!characterStatsID || !locationUUID || !traitUUID || !jobUUID) return null
            const characterStats = await ctx.db.query.specialStats.findFirst({
                where: (specialStats, { eq }) => eq(specialStats.uuid, characterStatsID),
            })
            const job = await ctx.db.query.jobs.findFirst({
                where: (jobs, { eq }) => eq(jobs.uuid, jobUUID),
            })
            const trait = await ctx.db.query.traits.findFirst({
                where: (traits, { eq }) => eq(traits.uuid, traitUUID),
            })
            const location = await ctx.db.query.locations.findFirst({
                where: (locations, { eq }) => eq(locations.uuid, locationUUID),
            })

            let returnCharacter = {
                character: character,
                specialStats: characterStats,
                job: job,
                trait: trait,
                location: location

            }



            return returnCharacter
        }),
    getAll: publicProcedure
        .query(async ({ ctx }) => {
            return ctx.db.query.characters.findMany();
        }),


});
