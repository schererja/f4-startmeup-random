import type { ReactNode } from "react";

interface OverlayCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  scanlines?: boolean;
}

export function OverlayCard({
  children,
  className = "",
  glow = false,
  scanlines = false,
}: OverlayCardProps) {
  return (
    <div
      className={`obs-fadein ${scanlines ? "obs-scanlines" : ""} ${className}`}
      style={{
        background: "rgba(0, 10, 5, 0.82)",
        border: "1px solid rgba(76, 175, 80, 0.45)",
        borderRadius: "4px",
        backdropFilter: "blur(4px)",
        boxShadow: glow
          ? "0 0 8px rgba(76, 175, 80, 0.5), 0 0 20px rgba(76, 175, 80, 0.2), inset 0 0 40px rgba(0, 0, 0, 0.4)"
          : "0 0 4px rgba(76, 175, 80, 0.25), inset 0 0 40px rgba(0, 0, 0, 0.4)",
        padding: "1rem",
      }}
    >
      {children}
    </div>
  );
}
