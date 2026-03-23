import { redirect } from "next/navigation";

// Dispatcher for /overlay/[game]/[uuid]
// Static game-specific routes take precedence in Next.js routing, so
// /overlay/fallout4/[uuid] and /overlay/diablo2/[uuid] are handled by their
// own page.tsx files. This fallback handles legacy slugs and unsupported games.
//
// Slug aliases:
//   fo4  → /overlay/fallout4/[uuid]   (legacy Tyrael architecture slug)
//   d2   → /overlay/diablo2/[uuid]    (short slug)
//
// Example OBS browser source URL: /overlay/d2/550e8400-e29b-41d4-a716-446655440000

const GAME_SLUG_MAP: Record<string, string> = {
  fo4: "fallout4",
  d2: "diablo2",
};

export default function OverlayPage({
  params,
  searchParams,
}: {
  params: { game: string; uuid: string };
  searchParams: Record<string, string>;
}) {
  const canonical = GAME_SLUG_MAP[params.game];

  if (canonical) {
    const query = new URLSearchParams(searchParams).toString();
    const qs = query ? `?${query}` : "";
    redirect(`/overlay/${canonical}/${params.uuid}${qs}`);
  }

  return (
    <main
      style={{
        display: "inline-block",
        padding: "1rem",
        fontFamily: "'Courier New', Courier, monospace",
        color: "#4caf50",
        background: "rgba(0,10,5,0.85)",
        border: "1px solid rgba(76,175,80,0.4)",
        borderRadius: "4px",
      }}
    >
      <span style={{ color: "#ef5350" }}>ERROR:</span> Unknown game:{" "}
      <code>{params.game}</code>
    </main>
  );
}
