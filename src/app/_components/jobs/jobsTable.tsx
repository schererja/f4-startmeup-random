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
  let jobs = [];

  try {
    jobs = await api.jobs.getAll();
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return (
      <div className="rounded-lg border border-amber-600/30 bg-slate-900/50 p-8 text-center">
        <p className="text-amber-100">
          Unable to load jobs. Please try again later.
        </p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-amber-600/30 bg-slate-900/50 p-8 text-center">
        <p className="text-amber-100">
          No jobs found. Create your first job to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-amber-600/30 bg-slate-900/50">
      <Table>
        <TableCaption>A list of available jobs.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="w-[200px]">Name</TableHead>
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
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
