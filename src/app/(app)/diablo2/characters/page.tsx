import { D2CharacterTable } from "~/app/_components/d2/d2CharacterTable";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-amber-50">
      <div className="container mx-auto space-y-8 px-4 py-8 sm:py-16">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-red-200 sm:text-4xl">
              Characters
            </h1>
            <p className="mt-1 text-sm text-red-400">
              Your Diablo II characters
            </p>
          </div>
          <Button
            asChild
            className="w-full bg-red-700 font-bold text-white hover:bg-red-600 sm:w-auto"
          >
            <Link href="/diablo2/characters/new">New Character</Link>
          </Button>
        </div>
        {await D2CharacterTable()}
      </div>
    </div>
  );
}

