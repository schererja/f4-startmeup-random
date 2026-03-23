import { api } from "~/trpc/server";
import { CharacterForm } from "~/app/_components/characters/characterForm";

export default async function Page() {
  const traits = await api.traits.getAll();
  const locations = await api.locations.getAll();
  const jobs = await api.jobs.getAll();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-amber-50">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <CharacterForm traits={traits} locations={locations} jobs={jobs} />
      </div>
    </div>
  );
}

