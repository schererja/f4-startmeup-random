import { api } from "~/trpc/server";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function Page({ params }: { params: { uuid: string } }) {
  let data;
  try {
    data = await api.d2Characters.getByUUID({ uuid: params.uuid });
  } catch {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-amber-50">
        <div className="container flex flex-col items-center gap-8 px-4 py-16">
          <h1 className="text-2xl font-bold text-red-200">
            Character not found
          </h1>
          <Link href="/diablo2/characters">
            <Button className="bg-red-700 text-white hover:bg-red-600">
              Back to Characters
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { character, class: d2Class, mercenary, skillFocuses } = data;

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-amber-50">
      <div className="container flex flex-col gap-8 px-4 py-8 sm:py-16">
        {/* Header */}
        <div className="border-b border-red-700/30 pb-6">
          <h1 className="text-3xl font-bold text-red-200 sm:text-4xl">
            {character.name}
          </h1>
          <p className="mt-2 text-sm text-red-300/60">
            Diablo II character details
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left — Character Details */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-lg border border-red-700/40 bg-slate-900 p-6 shadow-lg shadow-red-900/20">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-red-200">
                <span className="text-red-500">◆</span>
                Character Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-red-500">
                    Class
                  </p>
                  <p className="text-lg font-bold text-amber-50">
                    {d2Class.name}
                  </p>
                  {d2Class.description && (
                    <p className="mt-1 text-sm text-amber-200/60">
                      {d2Class.description}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-red-500">
                    Difficulty
                  </p>
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-sm font-semibold ${
                      character.difficulty === "Hell"
                        ? "bg-red-900/50 text-red-300"
                        : character.difficulty === "Nightmare"
                          ? "bg-purple-900/50 text-purple-300"
                          : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {character.difficulty}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-red-500">
                    Starting Act
                  </p>
                  <p className="text-lg text-amber-50">
                    Act {character.startingAct}
                  </p>
                </div>

                {mercenary && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-red-500">
                      Mercenary
                    </p>
                    <p className="text-lg text-amber-50">{mercenary.name}</p>
                    {mercenary.description && (
                      <p className="mt-1 text-sm text-amber-200/60">
                        {mercenary.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* OBS Overlay */}
            <div className="rounded-lg border border-red-700/40 bg-slate-900 p-6 shadow-lg shadow-red-900/20">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-red-500">
                OBS Streaming
              </p>
              <Link
                href={`/overlay/diablo2/${params.uuid}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-red-700 hover:bg-red-600">
                  Open OBS Overlay
                </Button>
              </Link>
              <p className="mt-3 text-xs text-red-300/50">
                Transparent overlay for OBS browser sources
              </p>
            </div>
          </div>

          {/* Right — Skill Focuses */}
          {skillFocuses.length > 0 && (
            <div className="lg:col-span-2">
              <div className="rounded-lg border border-red-700/40 bg-slate-900 p-6 shadow-lg shadow-red-900/20">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-red-200">
                  <span className="text-red-500">◆</span>
                  {d2Class.name} Skill Focuses
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {skillFocuses.map((sf) => (
                    <div
                      key={sf.uuid}
                      className="rounded border border-red-700/30 bg-slate-800/50 p-3"
                    >
                      <p className="font-semibold text-red-200">{sf.name}</p>
                      {sf.description && (
                        <p className="mt-1 text-xs text-amber-200/50">
                          {sf.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center pt-6">
          <Link href="/diablo2/characters">
            <Button className="border border-red-700/50 bg-slate-800/50 text-red-200 transition hover:border-red-700 hover:bg-slate-700">
              ← Back to Characters
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

