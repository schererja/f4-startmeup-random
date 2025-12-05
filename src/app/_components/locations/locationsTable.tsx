import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/server";

export async function LocationsTable() {
  let locations = [];
  
  try {
    locations = await api.locations.getAll();
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return (
      <div className="rounded-lg border border-amber-600/30 bg-slate-900/50 p-8 text-center">
        <p className="text-amber-100">
          Unable to load locations. Please try again later.
        </p>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="rounded-lg border border-amber-600/30 bg-slate-900/50 p-8 text-center">
        <p className="text-amber-100">
          No locations found. Create your first location to get started!
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>A list of available locations.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead className="w-[200px]">Name</TableHead>
          <TableHead className="w-[300px]">UUID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {locations.map((location) => {
          if (!location.uuid) {
            return null;
          }
          return (
            <TableRow key={location.uuid}>
              <TableCell>{location.id}</TableCell>
              <TableCell className="font-medium">{location.name}</TableCell>
              <TableCell className="font-mono text-sm">
                {location.uuid}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
