import { characterRouter } from "~/server/api/routers/character";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { specialsRouter } from "~/server/api/routers/special";
import { traitsRouter } from "~/server/api/routers/trait";
import { locationsRouter } from "./routers/location";
import { jobsRouter } from "./routers/job";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  character: characterRouter,
  specials: specialsRouter,
  traits: traitsRouter,
  locations: locationsRouter,
  jobs: jobsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
