import Link from "next/link";
import { Button } from "~/components/ui/button";
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

export async function CharacterTable() {
  let characters = [];

  try {
    characters = await api.characters.getAll();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to fetch characters:", errorMessage);
    return (
      <div className="rounded-lg border border-amber-600/30 bg-slate-900/50 p-8 text-center">
        <p className="text-amber-100">
          Unable to load characters. Please try again later.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="mt-2 text-xs text-amber-600">{errorMessage}</p>
        )}
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="rounded-lg border border-amber-600/30 bg-slate-900/50 p-8 text-center">
        <p className="text-amber-100">
          No characters found. Create your first character to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-amber-600/30 bg-slate-900/50">
      <Table>
        <TableCaption>A list of your recent characters.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[200px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {characters.map((character) => {
            if (!character.uuid) {
              return null;
            }
            const characterLink = `/characters/${character.uuid}`;
            return (
              <TableRow key={character.uuid}>
                <TableCell>{character.id}</TableCell>
                <TableCell className="font-medium">{character.name}</TableCell>
                <TableCell>
                  <Button asChild className="text-xs sm:text-sm">
                    <Link
                      href={characterLink}
                      aria-label={`View details for ${character.name}`}
                    >
                      View Character
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
