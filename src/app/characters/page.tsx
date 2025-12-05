import { CharacterTable } from "../_components/characters/characterTable";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-amber-50">
      <div className="container mx-auto space-y-8 px-4 py-8 sm:py-16">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-amber-100 sm:text-4xl">
              Characters
            </h1>
            <p className="mt-1 text-sm text-amber-500">
              Build your Vault dweller
            </p>
          </div>
          <Button
            asChild
            className="w-full bg-amber-600 font-bold text-slate-950 hover:bg-amber-700 sm:w-auto"
          >
            <Link href="/characters/new" aria-label="Create a new character">
              New Character
            </Link>
          </Button>
        </div>
        {await CharacterTable()}
      </div>
    </main>
  );
}
