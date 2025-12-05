import { api } from "~/trpc/server";
import { DataTable, columns } from "../_components/specials/specialsTable";
import { SignedOut, SignedIn } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default async function SpecialsPage() {
  const data = await api.specials.getAll();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-amber-50">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <SignedOut>
          <div className="h-full w-full text-center text-2xl">
            Please sign in above
          </div>
        </SignedOut>
        <SignedIn>
          <div className="w-full space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-amber-100">Specials</h1>
              <p className="mt-1 text-sm text-amber-500">
                View special perks and abilities
              </p>
            </div>
            <DataTable columns={columns} data={data} />
          </div>
        </SignedIn>
      </div>
    </main>
  );
}
