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

  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-600">
          No jobs found. Create your first job to get started!
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>A list of available jobs.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead className="w-[200px]">Name</TableHead>
          <TableHead className="w-[300px]">UUID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => {
          if (!job.uuid) {
            return null;
          }
          return (
            <TableRow key={job.uuid}>
              <TableCell>{job.id}</TableCell>
              <TableCell className="font-medium">{job.name}</TableCell>
              <TableCell className="font-mono text-sm">{job.uuid}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
