import type { ReactNode } from "react";

interface OverlayBadgeProps {
  label: string;
  value: ReactNode;
  accent?: boolean;
}

export function OverlayBadge({ label, value, accent = false }: OverlayBadgeProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: "0.1rem",
        padding: "0.35rem 0.75rem",
        background: accent ? "rgba(76, 175, 80, 0.12)" : "rgba(0, 10, 5, 0.6)",
        border: `1px solid ${accent ? "rgba(76, 175, 80, 0.6)" : "rgba(76, 175, 80, 0.25)"}`,
        borderRadius: "2px",
        borderLeftWidth: "3px",
        borderLeftColor: "#4caf50",
      }}
    >
      <span
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "0.6rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: "#4caf50",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "0.95rem",
          fontWeight: 600,
          color: "#c8e6c9",
          letterSpacing: "0.02em",
        }}
      >
        {value}
      </span>
    </div>
  );
}
