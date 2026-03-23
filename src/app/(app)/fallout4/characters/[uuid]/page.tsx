import { api } from "~/trpc/server";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { EditSpecialForm } from "~/app/characters/[uuid]/_components/editSpecialForm";

export default async function Page({
  params,
}: {
  params: { uuid: string };
}) {
  let data;
  try {
    data = await api.characters.getByUUID({ uuid: params.uuid });
  } catch {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-amber-50">
        <div className="container flex flex-col items-center gap-8 px-4 py-16">
          <h1 className="text-2xl font-bold text-amber-100">
            Character not found
          </h1>
          <Link href="/fallout4/characters">
            <Button className="bg-amber-600 text-slate-900 hover:bg-amber-500">
              Back to Characters
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-amber-50">
      <div className="container flex flex-col gap-8 px-4 py-8 sm:py-16">
        <div className="border-b border-amber-600/30 pb-6">
          <h1 className="text-3xl font-bold text-amber-100 sm:text-4xl">
            {data.character.name}
          </h1>
          <p className="mt-2 text-sm text-amber-200/70">
            View your generated character
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-lg border border-amber-600/40 bg-slate-900 p-6 shadow-lg shadow-amber-900/20">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-amber-100">
                <span className="text-amber-500">◆</span>
                Character Details
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">
                    Background
                  </p>
                  <p className="text-lg text-amber-50">{data.job.name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">
                    Starting Location
                  </p>
                  <p className="text-lg text-amber-50">{data.location.name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">
                    Trait
                  </p>
                  <p className="text-lg text-amber-50">{data.trait.name}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-amber-600/40 bg-slate-900 p-6 shadow-lg shadow-amber-900/20">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-500">
                OBS Streaming
              </p>
              <Link
                href={`/overlay/fallout4/${params.uuid}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-amber-600 hover:bg-amber-500">
                  Open OBS Overlay
                </Button>
              </Link>
              <p className="mt-3 text-xs text-amber-200/60">
                Transparent overlay for OBS browser sources
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-lg border border-amber-600/40 bg-slate-900 p-6 shadow-lg shadow-amber-900/20">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-amber-100 sm:text-2xl">
                <span className="text-amber-500">◆</span>
                S.P.E.C.I.A.L. Stats
              </h2>
              <EditSpecialForm
                statsUuid={data.specialStats.uuid}
                initialStats={{
                  strength: data.specialStats.strength,
                  perception: data.specialStats.perception,
                  endurance: data.specialStats.endurance,
                  charisma: data.specialStats.charisma,
                  intelligence: data.specialStats.intelligence,
                  agility: data.specialStats.agility,
                  luck: data.specialStats.luck,
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <Link href="/fallout4/characters">
            <Button className="border border-amber-600/50 bg-slate-800/50 text-amber-100 transition hover:border-amber-600/80 hover:bg-slate-700">
              ← Back to Characters
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

