// TODO: Implement overlay pages per game
// Route: /overlay/[game]/[uuid]
// Supported game slugs: fo4, d2
// Contract:
//   - No auth required (public read of character data by UUID)
//   - No navigation chrome
//   - Transparent-friendly background (bg-transparent or bg-slate-950/95)
//   - Render game-specific overlay component based on `game` param
//
// Example OBS browser source URL: /overlay/fo4/550e8400-e29b-41d4-a716-446655440000

export default function OverlayPage({
  params,
}: {
  params: { game: string; uuid: string };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-transparent">
      <p className="text-amber-500">
        {/* Overlay for game={params.game} uuid={params.uuid} — not yet implemented */}
      </p>
    </main>
  );
}
