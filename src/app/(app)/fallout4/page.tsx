import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-amber-50">
      <div className="container flex flex-col items-center gap-8 px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-amber-100 sm:text-5xl">
          Fallout 4
        </h1>
        <p className="text-amber-200/70">
          Generate random S.P.E.C.I.A.L. builds for Start Me Up
        </p>
        <Button
          asChild
          className="bg-amber-600 font-bold text-slate-950 hover:bg-amber-700"
        >
          <Link href="/fallout4/characters">View Characters</Link>
        </Button>
      </div>
    </div>
  );
}

