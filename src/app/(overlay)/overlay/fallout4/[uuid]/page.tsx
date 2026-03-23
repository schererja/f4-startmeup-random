import { api } from "~/trpc/server";
import { OverlayCard } from "../../../_components/OverlayCard";
import { StatBox } from "../../../_components/StatBox";
import { OverlayBadge } from "../../../_components/OverlayBadge";

type LayoutMode = "full" | "stats" | "minimal";

export const dynamic = "force-dynamic";

const SPECIAL_KEYS = [
  { label: "S", key: "strength" },
  { label: "P", key: "perception" },
  { label: "E", key: "endurance" },
  { label: "C", key: "charisma" },
  { label: "I", key: "intelligence" },
  { label: "A", key: "agility" },
  { label: "L", key: "luck" },
] as const;

export default async function FO4OverlayPage({
  params,
  searchParams,
}: {
  params: { uuid: string };
  searchParams: { layout?: string };
}) {
  const layoutMode: LayoutMode =
    searchParams.layout === "stats" || searchParams.layout === "minimal"
      ? (searchParams.layout as LayoutMode)
      : "full";

  let data: Awaited<ReturnType<typeof api.characters.getByUUID>>;
  try {
    data = await api.characters.getByUUID({ uuid: params.uuid });
  } catch {
    return (
      <div
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          color: "#4caf50",
          background: "rgba(0,10,5,0.85)",
          border: "1px solid rgba(76,175,80,0.4)",
          borderRadius: "4px",
          padding: "1rem 1.5rem",
          display: "inline-block",
        }}
      >
        <span style={{ color: "#ef5350" }}>ERROR:</span> Character not found
      </div>
    );
  }

  const stats = data.specialStats;

  // ── MINIMAL: name + background only ──────────────────────────────────────
  if (layoutMode === "minimal") {
    return (
      <main
        className="obs-flicker"
        style={{ display: "inline-block", padding: "0.5rem" }}
      >
        <OverlayCard glow>
          <h1
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "2rem",
              fontWeight: 700,
              color: "#00ff41",
              margin: 0,
              letterSpacing: "0.04em",
              textShadow: "0 0 10px rgba(0,255,65,0.5)",
            }}
          >
            {data.character.name}
          </h1>
          <div style={{ marginTop: "0.4rem", display: "flex", gap: "0.75rem" }}>
            <OverlayBadge label="Background" value={data.job.name} />
          </div>
        </OverlayCard>
      </main>
    );
  }

  // ── STATS: SPECIAL row only ───────────────────────────────────────────────
  if (layoutMode === "stats") {
    return (
      <main
        className="obs-flicker"
        style={{ display: "inline-block", padding: "0.5rem" }}
      >
        <OverlayCard glow scanlines>
          <p
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "#4caf50",
              textTransform: "uppercase",
              margin: "0 0 0.5rem 0",
            }}
          >
            S.P.E.C.I.A.L
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.4rem",
            }}
          >
            {SPECIAL_KEYS.map(({ label, key }) => (
              <StatBox
                key={label}
                label={label}
                value={stats[key] ?? 0}
                highlight={(stats[key] ?? 0) >= 8}
              />
            ))}
          </div>
        </OverlayCard>
      </main>
    );
  }

  // ── FULL: complete character card ─────────────────────────────────────────
  return (
    <main
      className="obs-flicker"
      style={{
        display: "inline-block",
        padding: "0.75rem",
        minWidth: "400px",
        maxWidth: "520px",
      }}
    >
      <OverlayCard glow scanlines>
        {/* ── Header bar ── */}
        <div
          style={{
            borderBottom: "1px solid rgba(76,175,80,0.3)",
            paddingBottom: "0.6rem",
            marginBottom: "0.75rem",
          }}
        >
          {/* Pip-Boy accent strip */}
          <div
            style={{
              fontSize: "0.55rem",
              fontFamily: "'Courier New', Courier, monospace",
              letterSpacing: "0.25em",
              color: "#4caf50",
              textTransform: "uppercase",
              marginBottom: "0.3rem",
              opacity: 0.75,
            }}
          >
            ◆ Vault-Tec Personal Identification File
          </div>

          <h1
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "1.85rem",
              fontWeight: 700,
              color: "#00ff41",
              margin: 0,
              letterSpacing: "0.04em",
              textShadow: "0 0 12px rgba(0,255,65,0.45)",
              lineHeight: 1.1,
            }}
          >
            {data.character.name}
          </h1>
        </div>

        {/* ── S.P.E.C.I.A.L. ── */}
        <div style={{ marginBottom: "0.75rem" }}>
          <p
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "#4caf50",
              textTransform: "uppercase",
              margin: "0 0 0.4rem 0",
            }}
          >
            S.P.E.C.I.A.L
          </p>
          <div style={{ display: "flex", gap: "0.35rem" }}>
            {SPECIAL_KEYS.map(({ label, key }) => (
              <StatBox
                key={label}
                label={label}
                value={stats[key] ?? 0}
                highlight={(stats[key] ?? 0) >= 8}
              />
            ))}
          </div>
        </div>

        {/* ── Badges row ── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.4rem",
          }}
        >
          <OverlayBadge label="Background" value={data.job.name} accent />
          <OverlayBadge label="Location" value={data.location.name} />
          <OverlayBadge label="Trait" value={data.trait.name} accent />
        </div>
      </OverlayCard>
    </main>
  );
}
