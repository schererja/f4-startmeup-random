import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
      <div>Fallout 4 Start Me Up Random</div>

      <div className="flex flex-row items-center gap-4">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <Link href="/characters"> Characters</Link>
          <Link href="/traits"> Traits</Link>
          <Link href="/jobs"> Jobs</Link>
          <Link href="/locations"> Locations</Link>
          <Link href="/specials"> Specials</Link>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
