import { api } from "~/trpc/server";
import { DataTable, columns } from "~/app/_components/specials/specialsTable";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await api.specials.getAll();
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-amber-50">
      <div className="container flex flex-col gap-12 px-4 py-8 sm:py-16">
        <div className="w-full space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-100 sm:text-4xl">
              Specials
            </h1>
            <p className="mt-1 text-sm text-amber-500">
              View special perks and abilities
            </p>
          </div>
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
}

