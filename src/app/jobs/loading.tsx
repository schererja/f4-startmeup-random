import { TableSkeleton } from "../_components/loading-skeleton";

export default function JobsLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-black">
      <div className="container flex flex-col gap-12 px-4 py-16">
        <div className="space-y-6">
          <div className="h-9 w-24 animate-pulse rounded bg-gray-200" />
          <TableSkeleton rows={5} />
        </div>
      </div>
    </main>
  );
}
