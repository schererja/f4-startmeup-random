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

export async function JobsTable() {
  const jobs = await api.jobs.getAll();
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
        {jobs.map((job) => (
          <TableRow>
            <TableCell key={job.id}>{job.id}</TableCell>
            <TableCell key={job.id}>{job.name}</TableCell>
            <TableCell key={job.id}>{job.uuid}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
