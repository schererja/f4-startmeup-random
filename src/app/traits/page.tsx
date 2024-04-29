import { TraitForm } from "../_components/traits/create-trait";
import { SignedOut, SignedIn } from "@clerk/nextjs";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center  text-black">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <SignedOut>
          <div className="h-full w-full text-center text-2xl">
            Please sign in above
          </div>
        </SignedOut>
        <SignedIn>
          <TraitForm />
        </SignedIn>
      </div>
    </main>
  );
}
