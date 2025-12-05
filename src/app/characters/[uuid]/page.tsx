import { api } from "~/trpc/server";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function Page({
  params,
  searchParams,
}: {
  params: { uuid: string };
  searchParams: { obs?: string };
}) {
  const data = await api.characters.getByUUID({ uuid: params.uuid });
  if (!data) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-amber-50">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-2xl font-bold text-amber-100">
            Character not found
          </h1>
          <Link href="/characters">
            <Button className="bg-amber-600 text-slate-900 hover:bg-amber-500">
              Back to Characters
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  // OBS streaming mode - minimal UI, perfect for overlays
  if (searchParams.obs === "true") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950/95">
        <div className="space-y-6 p-4 sm:space-y-8 sm:p-8">
          {/* Character Name */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-amber-100 sm:text-5xl">
              {data.character.name}
            </h1>
            <div className="flex gap-4 text-lg text-amber-200 sm:gap-6 sm:text-2xl">
              <span>{data.job.name}</span>
              <span>•</span>
              <span>{data.location.name}</span>
            </div>
          </div>

          {/* Trait */}
          <div className="border-l-4 border-amber-500 pl-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 sm:text-sm">
              Trait
            </p>
            <p className="text-2xl font-bold text-amber-100 sm:text-3xl">
              {data.trait.name}
            </p>
          </div>

          {/* S.P.E.C.I.A.L. Stats Grid */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4">
            <div className="rounded-lg border border-amber-600/50 bg-slate-800/50 p-2 text-center sm:p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                S
              </p>
              <p className="text-2xl font-bold text-amber-100 sm:text-4xl">
                {data.specialStats.strength}
              </p>
            </div>
            <div className="rounded-lg border border-amber-600/50 bg-slate-800/50 p-2 text-center sm:p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                P
              </p>
              <p className="text-2xl font-bold text-amber-100 sm:text-4xl">
                {data.specialStats.perception}
              </p>
            </div>
            <div className="rounded-lg border border-amber-600/50 bg-slate-800/50 p-2 text-center sm:p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                E
              </p>
              <p className="text-2xl font-bold text-amber-100 sm:text-4xl">
                {data.specialStats.endurance}
              </p>
            </div>
            <div className="rounded-lg border border-amber-600/50 bg-slate-800/50 p-2 text-center sm:p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                C
              </p>
              <p className="text-2xl font-bold text-amber-100 sm:text-4xl">
                {data.specialStats.charisma}
              </p>
            </div>
            <div className="rounded-lg border border-amber-600/50 bg-slate-800/50 p-2 text-center sm:p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                I
              </p>
              <p className="text-2xl font-bold text-amber-100 sm:text-4xl">
                {data.specialStats.intelligence}
              </p>
            </div>
            <div className="rounded-lg border border-amber-600/50 bg-slate-800/50 p-2 text-center sm:p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                A
              </p>
              <p className="text-2xl font-bold text-amber-100 sm:text-4xl">
                {data.specialStats.agility}
              </p>
            </div>
            <div className="rounded-lg border border-amber-600/50 bg-slate-800/50 p-2 text-center sm:p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                L
              </p>
              <p className="text-2xl font-bold text-amber-100 sm:text-4xl">
                {data.specialStats.luck}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Regular view - full interface
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-amber-50">
      <div className="container flex flex-col gap-8 px-4 py-8 sm:py-16">
        {/* Header */}
        <div className="border-b border-amber-600/30 pb-6">
          <h1 className="text-3xl font-bold text-amber-100 sm:text-4xl">
            {data.character.name}
          </h1>
          <p className="mt-2 text-sm text-amber-200/70 sm:text-base">
            View your generated character
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Character Info */}
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

            {/* OBS Link */}
            <div className="rounded-lg border border-amber-600/40 bg-slate-900 p-6 shadow-lg shadow-amber-900/20">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-500">
                OBS Streaming
              </p>
              <Link
                href={`/characters/${params.uuid}?obs=true`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-amber-600 hover:bg-amber-500">
                  Open OBS View
                </Button>
              </Link>
              <p className="mt-3 text-xs text-amber-200/60">
                Perfect for streaming or recording with transparent background
              </p>
            </div>
          </div>

          {/* Right Column - S.P.E.C.I.A.L. Stats */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-amber-600/40 bg-slate-900 p-6 shadow-lg shadow-amber-900/20">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-amber-100 sm:text-2xl">
                <span className="text-amber-500">◆</span>
                S.P.E.C.I.A.L. Stats
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-amber-600/20 bg-slate-800/50 p-6 text-center transition hover:border-amber-600/40">
                  <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">
                    Strength
                  </p>
                  <p className="mt-3 text-5xl font-bold text-amber-100">
                    {data.specialStats.strength}
                  </p>
                </div>
                <div className="rounded-lg border border-amber-600/20 bg-slate-800/50 p-6 text-center transition hover:border-amber-600/40">
                  <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">
                    Perception
                  </p>
                  <p className="mt-3 text-5xl font-bold text-amber-100">
                    {data.specialStats.perception}
                  </p>
                </div>
                <div className="rounded-lg border border-amber-600/20 bg-slate-800/50 p-6 text-center transition hover:border-amber-600/40">
                  <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">
                    Endurance
                  </p>
                  <p className="mt-3 text-5xl font-bold text-amber-100">
                    {data.specialStats.endurance}
                  </p>
                </div>
                <div className="rounded-lg border border-amber-600/20 bg-slate-800/50 p-6 text-center transition hover:border-amber-600/40">
                  <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">
                    Charisma
                  </p>
                  <p className="mt-3 text-5xl font-bold text-amber-100">
                    {data.specialStats.charisma}
                  </p>
                </div>
                <div className="rounded-lg border border-amber-600/20 bg-slate-800/50 p-6 text-center transition hover:border-amber-600/40">
                  <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">
                    Intelligence
                  </p>
                  <p className="mt-3 text-5xl font-bold text-amber-100">
                    {data.specialStats.intelligence}
                  </p>
                </div>
                <div className="rounded-lg border border-amber-600/20 bg-slate-800/50 p-6 text-center transition hover:border-amber-600/40">
                  <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">
                    Agility
                  </p>
                  <p className="mt-3 text-5xl font-bold text-amber-100">
                    {data.specialStats.agility}
                  </p>
                </div>
                <div className="rounded-lg border border-amber-600/20 bg-slate-800/50 p-6 text-center transition hover:border-amber-600/40">
                  <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">
                    Luck
                  </p>
                  <p className="mt-3 text-5xl font-bold text-amber-100">
                    {data.specialStats.luck}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center pt-6">
          <Link href="/characters">
            <Button className="border border-amber-600/50 bg-slate-800/50 text-amber-100 transition hover:border-amber-600/80 hover:bg-slate-700">
              ← Back to Characters
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
