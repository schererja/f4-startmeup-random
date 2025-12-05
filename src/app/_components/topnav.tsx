import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function TopNav() {
  return (
    <nav className="border-b border-amber-600/30 bg-slate-900/50 backdrop-blur-sm">
      <div className="flex w-full items-center justify-between px-6 py-4">
        {/* Logo/Title */}
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-amber-100 transition hover:text-amber-50">
            <span className="text-amber-500">◆</span> Fallout 4: Start Me Up
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex flex-row items-center gap-8">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-8">
              <Link
                href="/characters"
                className="pb-1 text-amber-100 transition hover:border-b-2 hover:border-amber-500 hover:text-amber-50"
              >
                Characters
              </Link>
              <Link
                href="/traits"
                className="pb-1 text-amber-100 transition hover:border-b-2 hover:border-amber-500 hover:text-amber-50"
              >
                Traits
              </Link>
              <Link
                href="/jobs"
                className="pb-1 text-amber-100 transition hover:border-b-2 hover:border-amber-500 hover:text-amber-50"
              >
                Jobs
              </Link>
              <Link
                href="/locations"
                className="pb-1 text-amber-100 transition hover:border-b-2 hover:border-amber-500 hover:text-amber-50"
              >
                Locations
              </Link>
              <Link
                href="/specials"
                className="pb-1 text-amber-100 transition hover:border-b-2 hover:border-amber-500 hover:text-amber-50"
              >
                Specials
              </Link>
            </div>
            <div className="border-l border-amber-600/30 pl-8">
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
