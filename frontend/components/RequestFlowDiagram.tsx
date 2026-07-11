export default function RequestFlowDiagram() {
  return (
    <div>
      <p className="font-mono text-xs text-text-mono mb-3">request-flow.diagram</p>
      <svg viewBox="0 0 340 210" className="w-full h-auto" role="img" aria-label="Request flow: client to FastAPI to Postgres, through Pydantic validation, back to client">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-text-secondary)" />
          </marker>
        </defs>

        {/* connectors */}
        <path className="flow-line" d="M55,30 H165" markerEnd="url(#arrow)" />
        <path className="flow-line" d="M225,30 H295" markerEnd="url(#arrow)" />
        <path className="flow-line" d="M195,42 V78" markerEnd="url(#arrow)" />
        <path className="flow-line" d="M195,120 V152" markerEnd="url(#arrow)" />
        <path className="flow-line" d="M175,178 H115" markerEnd="url(#arrow)" />

        {/* nodes */}
        <Node x={5} y={12} w={50} h={36} label="client" />
        <Node x={165} y={12} w={60} h={36} label="FastAPI" accent />
        <Node x={295} y={12} w={0} h={36} label="Postgres" align="end" />
        <Node x={130} y={84} w={130} h={36} label="validation" sub="(Pydantic)" accent />
        <Node x={5} y={160} w={110} h={36} label="response" />
      </svg>
    </div>
  );
}

function Node({
  x,
  y,
  w,
  h,
  label,
  sub,
  accent = false,
  align = "start",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  accent?: boolean;
  align?: "start" | "end";
}) {
  const rectX = align === "end" ? x - 70 : x;
  const width = align === "end" ? 70 : w;
  return (
    <g>
      <rect
        x={rectX}
        y={y}
        width={width}
        height={h}
        rx={6}
        fill="var(--color-surface)"
        stroke={accent ? "var(--color-accent)" : "var(--color-border)"}
        strokeWidth={1}
      />
      <text
        x={rectX + width / 2}
        y={y + (sub ? h / 2 - 3 : h / 2 + 4)}
        textAnchor="middle"
        fontSize="11"
        fontFamily="var(--font-mono)"
        fill={accent ? "var(--color-accent)" : "var(--color-text-primary)"}
      >
        {label}
      </text>
      {sub && (
        <text
          x={rectX + width / 2}
          y={y + h / 2 + 11}
          textAnchor="middle"
          fontSize="9"
          fontFamily="var(--font-mono)"
          fill="var(--color-text-secondary)"
        >
          {sub}
        </text>
      )}
    </g>
  );
}
