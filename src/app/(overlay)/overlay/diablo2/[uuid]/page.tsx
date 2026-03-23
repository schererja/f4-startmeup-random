import { api } from "~/trpc/server";
import { OverlayBadge } from "../../../_components/OverlayBadge";

type LayoutMode = "full" | "stats" | "minimal";

export const dynamic = "force-dynamic";

// ── D2 theme tokens ────────────────────────────────────────────────────────
const D2 = {
  bg: "rgba(10, 5, 0, 0.85)",
  border: "1px solid rgba(200, 150, 44, 0.4)",
  borderAccent: "1px solid rgba(200, 150, 44, 0.7)",
  gold: "#d4a017",
  goldDim: "#c8962c",
  red: "#8b0000",
  parchment: "#e8d5a3",
  parchmentDim: "#c4b484",
  font: "Georgia, 'Times New Roman', serif",
  fontMono: "'Courier New', Courier, monospace",
  shadow: (color: string) => `0 0 8px ${color}, 0 0 18px ${color}`,
} as const;

function difficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "Normal":
      return "#4ade80";
    case "Nightmare":
      return "#fb923c";
    case "Hell":
      return "#ef4444";
    default:
      return D2.parchment;
  }
}

// ── Error card ─────────────────────────────────────────────────────────────
function D2ErrorCard({ message }: { message: string }) {
  return (
    <div
      style={{
        fontFamily: D2.font,
        color: D2.parchment,
        background: D2.bg,
        border: D2.border,
        borderRadius: "4px",
        padding: "1rem 1.5rem",
        display: "inline-block",
      }}
    >
      <span style={{ color: D2.red, fontWeight: 700 }}>✦ Error:</span>{" "}
      {message}
    </div>
  );
}

// ── D2 card wrapper ────────────────────────────────────────────────────────
function D2Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="d2-fade-in d2-ember-glow"
      style={{
        background: D2.bg,
        border: D2.border,
        borderRadius: "4px",
        backdropFilter: "blur(4px)",
        padding: "1rem",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── D2 badge — gold theme override ────────────────────────────────────────
function D2Badge({
  label,
  value,
  valueColor,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  valueColor?: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: "0.1rem",
        padding: "0.35rem 0.75rem",
        background: accent ? "rgba(200, 150, 44, 0.1)" : "rgba(10, 5, 0, 0.6)",
        border: accent ? D2.borderAccent : D2.border,
        borderRadius: "2px",
        borderLeftWidth: "3px",
        borderLeftColor: accent ? D2.gold : D2.red,
      }}
    >
      <span
        style={{
          fontFamily: D2.fontMono,
          fontSize: "0.58rem",
          fontWeight: 700,
          letterSpacing: "0.14em",
          color: D2.goldDim,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: D2.font,
          fontSize: "0.9rem",
          fontWeight: 600,
          color: valueColor ?? D2.parchment,
          letterSpacing: "0.02em",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ── Page component ─────────────────────────────────────────────────────────
export default async function D2OverlayPage({
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

  let data: Awaited<ReturnType<typeof api.d2Characters.getByUUID>>;
  try {
    data = await api.d2Characters.getByUUID({ uuid: params.uuid });
  } catch {
    return <D2ErrorCard message="Character not found" />;
  }

  const { character, class: d2Class, mercenary, skillFocuses } = data;
  const diffColor = difficultyColor(character.difficulty);

  // ── MINIMAL: name + class ────────────────────────────────────────────────
  if (layoutMode === "minimal") {
    return (
      <main style={{ display: "inline-block", padding: "0.5rem" }}>
        <D2Card>
          <h1
            style={{
              fontFamily: D2.font,
              fontSize: "1.9rem",
              fontWeight: 700,
              color: D2.gold,
              margin: 0,
              letterSpacing: "0.03em",
              textShadow: D2.shadow("rgba(212, 160, 23, 0.45)"),
              lineHeight: 1.1,
            }}
          >
            {character.name}
          </h1>
          <div
            style={{
              marginTop: "0.4rem",
              fontFamily: D2.font,
              fontSize: "0.95rem",
              color: D2.parchmentDim,
              fontStyle: "italic",
            }}
          >
            {d2Class.name}
          </div>
        </D2Card>
      </main>
    );
  }

  // ── STATS: class + difficulty + act compact ──────────────────────────────
  if (layoutMode === "stats") {
    return (
      <main style={{ display: "inline-block", padding: "0.5rem" }}>
        <D2Card style={{ minWidth: "240px" }}>
          <div
            style={{
              fontSize: "0.55rem",
              fontFamily: D2.fontMono,
              letterSpacing: "0.2em",
              color: D2.goldDim,
              textTransform: "uppercase",
              marginBottom: "0.5rem",
              opacity: 0.8,
            }}
          >
            ✦ Sanctuary
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            <D2Badge label="Class" value={d2Class.name} accent />
            <D2Badge
              label="Difficulty"
              value={character.difficulty}
              valueColor={diffColor}
            />
            <D2Badge label="Act" value={`Act ${character.startingAct}`} />
          </div>
        </D2Card>
      </main>
    );
  }

  // ── FULL: complete character card ────────────────────────────────────────
  return (
    <main
      style={{
        display: "inline-block",
        padding: "0.75rem",
        minWidth: "380px",
        maxWidth: "520px",
      }}
    >
      <D2Card>
        {/* ── Header ── */}
        <div
          style={{
            borderBottom: "1px solid rgba(200, 150, 44, 0.3)",
            paddingBottom: "0.65rem",
            marginBottom: "0.8rem",
          }}
        >
          <div
            style={{
              fontSize: "0.52rem",
              fontFamily: D2.fontMono,
              letterSpacing: "0.22em",
              color: D2.goldDim,
              textTransform: "uppercase",
              marginBottom: "0.3rem",
              opacity: 0.75,
            }}
          >
            ✦ Sanctuary — Character File
          </div>
          <h1
            style={{
              fontFamily: D2.font,
              fontSize: "1.85rem",
              fontWeight: 700,
              color: D2.gold,
              margin: 0,
              letterSpacing: "0.03em",
              textShadow: D2.shadow("rgba(212, 160, 23, 0.45)"),
              lineHeight: 1.1,
            }}
          >
            {character.name}
          </h1>
          <div
            style={{
              marginTop: "0.25rem",
              fontFamily: D2.font,
              fontSize: "1rem",
              color: D2.parchmentDim,
              fontStyle: "italic",
            }}
          >
            {d2Class.name}
          </div>
        </div>

        {/* ── Core badges ── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.4rem",
            marginBottom: "0.65rem",
          }}
        >
          <D2Badge
            label="Difficulty"
            value={character.difficulty}
            valueColor={diffColor}
            accent
          />
          <D2Badge
            label="Starting Act"
            value={`Act ${character.startingAct}`}
          />
        </div>

        {/* ── Mercenary ── */}
        {mercenary && (
          <div
            style={{
              marginBottom: "0.65rem",
              paddingTop: "0.5rem",
              borderTop: "1px solid rgba(200, 150, 44, 0.18)",
            }}
          >
            <div
              style={{
                fontSize: "0.52rem",
                fontFamily: D2.fontMono,
                letterSpacing: "0.18em",
                color: D2.goldDim,
                textTransform: "uppercase",
                marginBottom: "0.35rem",
                opacity: 0.7,
              }}
            >
              Mercenary
            </div>
            <D2Badge
              label={`Act ${mercenary.act} Hire`}
              value={mercenary.name}
            />
          </div>
        )}

        {/* ── Skill focuses ── */}
        {skillFocuses.length > 0 && (
          <div
            style={{
              paddingTop: "0.5rem",
              borderTop: "1px solid rgba(200, 150, 44, 0.18)",
            }}
          >
            <div
              style={{
                fontSize: "0.52rem",
                fontFamily: D2.fontMono,
                letterSpacing: "0.18em",
                color: D2.goldDim,
                textTransform: "uppercase",
                marginBottom: "0.35rem",
                opacity: 0.7,
              }}
            >
              Skill Focus
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {skillFocuses.map((sf) => (
                <D2Badge key={sf.uuid} label="Skill" value={sf.name} />
              ))}
            </div>
          </div>
        )}
      </D2Card>
    </main>
  );
}
