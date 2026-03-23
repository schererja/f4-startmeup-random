interface StatBoxProps {
  label: string;
  value: number;
  highlight?: boolean;
}

export function StatBox({ label, value, highlight = false }: StatBoxProps) {
  return (
    <div
      className={`obs-glow-pulse flex flex-col items-center justify-center`}
      style={{
        background: highlight
          ? "rgba(76, 175, 80, 0.15)"
          : "rgba(0, 10, 5, 0.75)",
        border: `1px solid ${highlight ? "rgba(76, 175, 80, 0.8)" : "rgba(76, 175, 80, 0.35)"}`,
        borderRadius: "3px",
        padding: "0.5rem 0.25rem",
        minWidth: "3rem",
        boxShadow: highlight
          ? "0 0 8px rgba(76, 175, 80, 0.6)"
          : "0 0 4px rgba(76, 175, 80, 0.2)",
      }}
    >
      <span
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.15em",
          color: "#4caf50",
          textTransform: "uppercase",
          lineHeight: 1,
          marginBottom: "0.25rem",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "1.75rem",
          fontWeight: 700,
          color: highlight ? "#00ff41" : "#c8e6c9",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
    </div>
  );
}
