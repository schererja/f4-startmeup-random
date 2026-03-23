import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-amber-50">
      <div className="container flex flex-col items-center gap-12 px-4 py-16">
        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-bold text-amber-100 sm:text-5xl lg:text-6xl">
            <span className="text-amber-500">◆</span> Start Me Up Random
          </h1>
          <p className="text-base text-amber-200/70 sm:text-lg">
            Random character builds for your favourite games
          </p>
        </div>

        <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
          <Link href="/fallout4/characters" className="group block">
            <div className="rounded-lg border border-amber-600/40 bg-slate-900 p-8 shadow-lg shadow-amber-900/20 transition hover:border-amber-500 hover:bg-slate-800">
              <h2 className="text-2xl font-bold text-amber-100 group-hover:text-amber-50">
                Fallout 4
              </h2>
              <p className="mt-2 text-sm text-amber-200/60">
                Generate random S.P.E.C.I.A.L. builds for Start Me Up
              </p>
              <p className="mt-6 text-amber-500 transition group-hover:text-amber-400">
                Play →
              </p>
            </div>
          </Link>

          <Link href="/diablo2/characters" className="group block">
            <div className="rounded-lg border border-red-700/40 bg-slate-900 p-8 shadow-lg shadow-red-900/20 transition hover:border-red-600 hover:bg-slate-800">
              <h2 className="text-2xl font-bold text-red-300 group-hover:text-red-200">
                Diablo II
              </h2>
              <p className="mt-2 text-sm text-red-200/60">
                Random character builds and mercenary pairings
              </p>
              <p className="mt-6 text-red-500 transition group-hover:text-red-400">
                Play →
              </p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
