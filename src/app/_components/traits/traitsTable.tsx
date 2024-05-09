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
  return (
    <Table>
      <TableCaption>A list of your recent Traits.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead className="w-[100px]">Description</TableHead>
          <TableHead className="w-[100px]">UUID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {traits.map((trait) => (
          <TableRow key={trait.name}>
            <TableCell key={trait.id}>{trait.id}</TableCell>
            <TableCell key={trait.id}>{trait.name}</TableCell>
            <TableCell key={trait.id}>{trait.description}</TableCell>
            <TableCell key={trait.id}>{trait.uuid}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
