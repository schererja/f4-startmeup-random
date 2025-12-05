import { SignedOut, SignedIn } from "@clerk/nextjs";
import { JobsForm } from "../_components/jobs/jobsForm";
import { JobsTable } from "../_components/jobs/jobsTable";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-amber-50">
      <div className="container flex flex-col gap-12 px-4 py-8 sm:py-16">
        <SignedOut>
          <div className="h-full w-full text-center text-xl sm:text-2xl">
            Please sign in above
          </div>
        </SignedOut>
        <SignedIn>
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-amber-100 sm:text-4xl">
                Jobs
              </h1>
              <p className="mt-1 text-sm text-amber-500">
                Choose your character&apos;s profession and skills
              </p>
            </div>
            {await JobsTable()}
            <JobsForm />
          </div>
        </SignedIn>
      </div>
    </main>
  );
}
