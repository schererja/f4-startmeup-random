import { LocationForm } from "~/app/_components/locations/locationForm";
import { LocationsTable } from "~/app/_components/locations/locationsTable";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-amber-50">
      <div className="container flex flex-col gap-12 px-4 py-8 sm:py-16">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-100 sm:text-4xl">
              Locations
            </h1>
            <p className="mt-1 text-sm text-amber-500">
              Discover the Wasteland
            </p>
          </div>
          {await LocationsTable()}
          <LocationForm />
        </div>
      </div>
    </div>
  );
}

