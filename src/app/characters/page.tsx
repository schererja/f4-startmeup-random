import { CharacterTable } from "../_components/characters/characterTable";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-amber-50">
      <div className="container mx-auto space-y-8 px-4 py-16">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-amber-100">Characters</h1>
            <p className="mt-1 text-sm text-amber-500">
              Build your Vault dweller
            </p>
          </div>
          <Button
            asChild
            className="bg-amber-600 font-bold text-slate-950 hover:bg-amber-700"
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
