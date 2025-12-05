import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Table>
      <TableCaption>Loading...</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">
            <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
          </TableHead>
          <TableHead className="w-[100px]">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          </TableHead>
          <TableHead className="w-[100px]">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
            </TableCell>
            <TableCell>
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            </TableCell>
            <TableCell>
              <div className="h-10 w-32 animate-pulse rounded bg-gray-200" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function CharacterDetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}
