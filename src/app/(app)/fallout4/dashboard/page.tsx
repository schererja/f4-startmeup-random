import { api } from "~/trpc/server";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export const dynamic = "force-dynamic";

export default async function Page() {
  const stats = await api.characters.getStats();

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-amber-50">
      <div className="container flex flex-col gap-12 px-4 py-8 sm:py-16">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-100 sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-amber-500">
              Your Vault-Tec statistics and insights
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          </div>

          {stats.characterCount === 0 && (
            <div className="rounded-lg border border-amber-600/40 bg-slate-900 p-12 text-center shadow-lg shadow-amber-900/20">
              <span className="mb-4 inline-block text-5xl text-amber-500">◆</span>
              <h2 className="text-2xl font-bold text-amber-100">
                No characters created yet!
              </h2>
              <p className="mt-2 text-amber-200/60">
                Create your first character to see your statistics.
              </p>
              <Button
                asChild
                className="mt-6 bg-amber-600 font-bold text-slate-950 hover:bg-amber-700"
              >
                <Link href="/fallout4/characters/new">
                  Create Your First Character
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

