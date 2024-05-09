import { api } from "~/trpc/server";
import { CharacterTable } from "../_components/characters/characterTable";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function Page({ params }: { params: { uuid: string } }) {
  return (
    <div>
      <CharacterTable />
      <Button asChild>
        <Link href="/characters/new">New Character</Link>
      </Button>
    </div>
  );
}
