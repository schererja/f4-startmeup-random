export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-amber-50">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold text-amber-100">
            Fallout 4: Start Me Up Random
          </h1>
          <p className="text-lg text-amber-200/80">
            Generate random character builds for your Fallout 4 adventure
          </p>
        </div>
      </div>
    </main>
  );
}
