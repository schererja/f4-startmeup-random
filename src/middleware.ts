import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Overlay routes are intentionally public — OBS browser sources can't authenticate.
const isPublicRoute = createRouteMatcher(["/overlay/(.*)"]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) auth().protect();
});

// export const config = {
//     matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };
