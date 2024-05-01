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
  const locations = await api.locations.getAll();
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead className="w-[100px]">UUID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {locations.map((location) => (
          <TableRow key={location.name}>
            <TableCell key={location.id}>{location.id}</TableCell>
            <TableCell key={location.id}>{location.name}</TableCell>
            <TableCell key={location.id}>{location.uuid}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
