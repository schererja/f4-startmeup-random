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
  const traits = await api.traits.getAll();

  if (traits.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-600">
          No traits found. Create your first trait to get started!
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>A list of available traits.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead className="w-[200px]">Name</TableHead>
          <TableHead className="w-[300px]">Description</TableHead>
          <TableHead className="w-[200px]">UUID</TableHead>
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
              <TableCell className="text-gray-700">
                {trait.description}
              </TableCell>
              <TableCell className="font-mono text-sm">{trait.uuid}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
