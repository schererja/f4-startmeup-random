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
  return (
    <Table>
      <TableCaption>A list of your recent characters.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead className="w-[100px]">UUID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {characters.map((character) => {
          if (!character) {
            return null;
          }
          if (!character.uuid) {
            return null;
          }
          const characterLink = `/characters/${character.uuid}`;
          return (
            <TableRow key={character.name}>
              <TableCell key={character.id}>{character.id}</TableCell>
              <TableCell key={character.id}>{character.name}</TableCell>
              <TableCell key={character.id}>
                <Button asChild>
                  <Link className="blue" href={characterLink}>
                    Link to character: {character.name}
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
