import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-amber-50">
      <div className="container flex flex-col items-center gap-8 px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-red-200 sm:text-5xl">
          Diablo II
        </h1>
        <p className="text-red-300/70">
          Random character builds and mercenary pairings
        </p>
        <Button
          asChild
          className="bg-red-700 font-bold text-white hover:bg-red-600"
        >
          <Link href="/diablo2/characters">View Characters</Link>
        </Button>
      </div>
    </div>
  );
}

