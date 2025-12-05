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
  const characters = await api.characters.getAll();
  
  if (characters.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-600">No characters found. Create your first character to get started!</p>
      </div>
    );
  }
  
  return (
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
                <Button asChild>
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
  );
}
