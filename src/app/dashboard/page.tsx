import { SignedOut, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await api.characters.getStats();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-amber-50">
      <div className="container flex flex-col gap-12 px-4 py-8 sm:py-16">
        <SignedOut>
          <div className="h-full w-full text-center text-xl sm:text-2xl">
            Please sign in above
          </div>
        </SignedOut>
        <SignedIn>
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-amber-100 sm:text-4xl">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-amber-500">
                Your Vault-Tec statistics and insights
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Total Characters */}
              <div className="rounded-lg border border-amber-600/40 bg-slate-900 p-6 shadow-lg shadow-amber-900/20">
                <div className="flex items-center gap-3">
                  <span className="text-3xl text-amber-500">◆</span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">
                      Total Characters
                    </p>
                    <p className="text-4xl font-bold text-amber-100">
                      {stats.characterCount}
                    </p>
                  </div>
                </div>
              </div>

              {/* Most Used Trait */}
              <div className="rounded-lg border border-amber-600/40 bg-slate-900 p-6 shadow-lg shadow-amber-900/20">
                <div className="flex items-center gap-3">
                  <span className="text-3xl text-amber-500">◆</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">
                      Favorite Trait
                    </p>
                    {stats.mostUsedTrait ? (
                      <>
                        <p className="truncate text-xl font-bold text-amber-100">
                          {stats.mostUsedTrait.name}
                        </p>
                        <p className="text-xs text-amber-200/60">
                          Used {stats.mostUsedTrait.count} time
                          {stats.mostUsedTrait.count !== 1 ? "s" : ""}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg text-amber-200/60">None yet</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Most Used Job */}
              <div className="rounded-lg border border-amber-600/40 bg-slate-900 p-6 shadow-lg shadow-amber-900/20">
                <div className="flex items-center gap-3">
                  <span className="text-3xl text-amber-500">◆</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">
                      Favorite Background
                    </p>
                    {stats.mostUsedJob ? (
                      <>
                        <p className="truncate text-xl font-bold text-amber-100">
                          {stats.mostUsedJob.name}
                        </p>
                        <p className="text-xs text-amber-200/60">
                          Used {stats.mostUsedJob.count} time
                          {stats.mostUsedJob.count !== 1 ? "s" : ""}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg text-amber-200/60">None yet</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Most Used Location */}
              <div className="rounded-lg border border-amber-600/40 bg-slate-900 p-6 shadow-lg shadow-amber-900/20 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3">
                  <span className="text-3xl text-amber-500">◆</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">
                      Favorite Location
                    </p>
                    {stats.mostUsedLocation ? (
                      <>
                        <p className="truncate text-xl font-bold text-amber-100">
                          {stats.mostUsedLocation.name}
                        </p>
                        <p className="text-xs text-amber-200/60">
                          Used {stats.mostUsedLocation.count} time
                          {stats.mostUsedLocation.count !== 1 ? "s" : ""}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg text-amber-200/60">None yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Average SPECIAL Stats */}
            {stats.averageStats && (
              <div className="rounded-lg border border-amber-600/40 bg-slate-900 p-6 shadow-lg shadow-amber-900/20">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-amber-100 sm:text-2xl">
                  <span className="text-amber-500">◆</span>
                  Average S.P.E.C.I.A.L. Stats
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
                  <div className="rounded-lg border border-amber-600/20 bg-slate-800/50 p-4 text-center transition hover:border-amber-600/40">
                    <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">
                      Strength
                    </p>
                    <p className="mt-2 text-4xl font-bold text-amber-100">
                      {stats.averageStats.strength}
                    </p>
                  </div>
                  <div className="rounded-lg border border-amber-600/20 bg-slate-800/50 p-4 text-center transition hover:border-amber-600/40">
                    <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">
                      Perception
                    </p>
                    <p className="mt-2 text-4xl font-bold text-amber-100">
                      {stats.averageStats.perception}
                    </p>
                  </div>
                  <div className="rounded-lg border border-amber-600/20 bg-slate-800/50 p-4 text-center transition hover:border-amber-600/40">
                    <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">
                      Endurance
                    </p>
                    <p className="mt-2 text-4xl font-bold text-amber-100">
                      {stats.averageStats.endurance}
                    </p>
                  </div>
                  <div className="rounded-lg border border-amber-600/20 bg-slate-800/50 p-4 text-center transition hover:border-amber-600/40">
                    <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">
                      Charisma
                    </p>
                    <p className="mt-2 text-4xl font-bold text-amber-100">
                      {stats.averageStats.charisma}
                    </p>
                  </div>
                  <div className="rounded-lg border border-amber-600/20 bg-slate-800/50 p-4 text-center transition hover:border-amber-600/40">
                    <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">
                      Intelligence
                    </p>
                    <p className="mt-2 text-4xl font-bold text-amber-100">
                      {stats.averageStats.intelligence}
                    </p>
                  </div>
                  <div className="rounded-lg border border-amber-600/20 bg-slate-800/50 p-4 text-center transition hover:border-amber-600/40">
                    <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">
                      Agility
                    </p>
                    <p className="mt-2 text-4xl font-bold text-amber-100">
                      {stats.averageStats.agility}
                    </p>
                  </div>
                  <div className="rounded-lg border border-amber-600/20 bg-slate-800/50 p-4 text-center transition hover:border-amber-600/40">
                    <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">
                      Luck
                    </p>
                    <p className="mt-2 text-4xl font-bold text-amber-100">
                      {stats.averageStats.luck}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {stats.characterCount === 0 && (
              <div className="rounded-lg border border-amber-600/40 bg-slate-900 p-12 text-center shadow-lg shadow-amber-900/20">
                <span className="mb-4 inline-block text-5xl text-amber-500">
                  ◆
                </span>
                <h2 className="text-2xl font-bold text-amber-100">
                  No characters created yet!
                </h2>
                <p className="mt-2 text-amber-200/60">
                  Create your first character to see your statistics and
                  insights.
                </p>
                <Button
                  asChild
                  className="mt-6 bg-amber-600 font-bold text-slate-950 hover:bg-amber-700"
                >
                  <Link href="/characters/new">
                    Create Your First Character
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </SignedIn>
      </div>
    </main>
  );
}
