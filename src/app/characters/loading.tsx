import { TableSkeleton } from "../_components/loading-skeleton";

export default function CharactersLoading() {
  return (
    <div>
      <TableSkeleton rows={5} />
    </div>
  );
}
