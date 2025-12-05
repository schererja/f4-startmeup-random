import { api } from "~/trpc/server";

import { SignedOut, SignedIn } from "@clerk/nextjs";
import { CharacterForm } from "~/app/_components/characters/characterForm";

export default async function Home() {
  const traits = await api.traits.getAll();
  const locations = await api.locations.getAll();
  const jobs = await api.jobs.getAll();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-amber-50">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <SignedOut>
          <div className="h-full w-full text-center text-2xl">
            Please sign in above
          </div>
        </SignedOut>
        <SignedIn>
          <CharacterForm traits={traits} locations={locations} jobs={jobs} />
        </SignedIn>
      </div>
    </main>
  );
}
