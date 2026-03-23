import { TraitForm } from "~/app/_components/traits/traitForm";
import { TraitTable } from "~/app/_components/traits/traitsTable";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-amber-50">
      <div className="container flex flex-col gap-12 px-4 py-8 sm:py-16">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-100 sm:text-4xl">
              Traits
            </h1>
            <p className="mt-1 text-sm text-amber-500">
              Select your character&apos;s defining characteristics
            </p>
          </div>
          {await TraitTable()}
          <TraitForm />
        </div>
      </div>
    </div>
  );
}

