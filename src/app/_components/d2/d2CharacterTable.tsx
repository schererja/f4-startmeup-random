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
import type { D2Character } from "~/types";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export async function D2CharacterTable() {
  let characters: D2Character[] = [];

  try {
    characters = await api.d2Characters.getAll();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to fetch D2 characters:", errorMessage);
    return (
      <div className="rounded-lg border border-red-700/30 bg-slate-900/50 p-8 text-center">
        <p className="text-red-200">
          Unable to load characters. Please try again later.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="mt-2 text-xs text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="rounded-lg border border-red-700/30 bg-slate-900/50 p-8 text-center">
        <p className="text-red-200">
          No characters found. Create your first Diablo II character!
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-red-700/30 bg-slate-900/50">
      <Table>
        <TableCaption>Your Diablo II characters.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-red-300">Name</TableHead>
            <TableHead className="text-red-300">Difficulty</TableHead>
            <TableHead className="text-red-300">Starting Act</TableHead>
            <TableHead className="text-red-300">Created</TableHead>
            <TableHead className="text-red-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {characters.map((character) => {
            if (!character.uuid) return null;
            return (
              <TableRow key={character.uuid}>
                <TableCell className="font-medium text-amber-50">
                  {character.name}
                </TableCell>
                <TableCell>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-semibold ${
                      character.difficulty === "Hell"
                        ? "bg-red-900/50 text-red-300"
                        : character.difficulty === "Nightmare"
                          ? "bg-purple-900/50 text-purple-300"
                          : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {character.difficulty}
                  </span>
                </TableCell>
                <TableCell className="text-amber-200/70">
                  Act {character.startingAct}
                </TableCell>
                <TableCell className="text-amber-200/50 text-sm">
                  {character.createdAt ? formatDate(character.createdAt) : "—"}
                </TableCell>
                <TableCell>
                  <Button
                    asChild
                    size="sm"
                    className="bg-red-700 text-white hover:bg-red-600"
                  >
                    <Link href={`/diablo2/characters/${character.uuid}`}>
                      View
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
