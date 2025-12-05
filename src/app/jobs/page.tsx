import { SignedOut, SignedIn } from "@clerk/nextjs";
import { JobsForm } from "../_components/jobs/jobsForm";
import { JobsTable } from "../_components/jobs/jobsTable";

export default async function JobsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-amber-50">
      <div className="container flex flex-col gap-12 px-4 py-16">
        <SignedOut>
          <div className="h-full w-full text-center text-2xl">
            Please sign in above
          </div>
        </SignedOut>
        <SignedIn>
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-amber-100">Jobs</h1>
              <p className="mt-1 text-sm text-amber-500">
                Choose your character's profession and skills
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
