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

export async function TraitTable() {
  let traits = [];

  try {
    traits = await api.traits.getAll();
  } catch (error) {
    console.error("Failed to fetch traits:", error);
    return (
      <div className="rounded-lg border border-amber-600/30 bg-slate-900/50 p-8 text-center">
        <p className="text-amber-100">
          Unable to load traits. Please try again later.
        </p>
      </div>
    );
  }

  if (traits.length === 0) {
    return (
      <div className="rounded-lg border border-amber-600/30 bg-slate-900/50 p-8 text-center">
        <p className="text-amber-100">
          No traits found. Create your first trait to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-amber-600/30 bg-slate-900/50">
      <Table>
        <TableCaption>A list of available traits.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[300px]">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {traits.map((trait) => {
            if (!trait.uuid) {
              return null;
            }
            return (
              <TableRow key={trait.uuid}>
                <TableCell>{trait.id}</TableCell>
                <TableCell className="font-medium">{trait.name}</TableCell>
                <TableCell className="text-amber-100">
                  {trait.description}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
