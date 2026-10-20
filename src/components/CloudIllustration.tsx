/** Original diagram: a cloud platform layered over the services AdINET provides. */
export default function CloudIllustration() {
  const nodes = [
    { x: 30, y: 332, label: "Domains" },
    { x: 160, y: 372, label: "Web hosting" },
    { x: 290, y: 372, label: "Email" },
    { x: 390, y: 332, label: "IT support" },
  ];
  return (
    <svg viewBox="0 0 520 440" role="img" aria-label="Diagram of a cloud platform connected to domains, web hosting, email and IT support" className="hero__art">
      <defs>
        <linearGradient id="cl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2fb8e8" stopOpacity=".95" />
          <stop offset="1" stopColor="#1b1b85" stopOpacity=".9" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="#3a3da8" strokeWidth="1">
        {[60, 120, 180, 240, 300, 360, 420, 480].map((x) => (
          <line key={x} x1={x} y1="40" x2={x} y2="300" opacity=".45" />
        ))}
        {[80, 140, 200, 260].map((y) => (
          <line key={y} x1="20" y1={y} x2="500" y2={y} opacity=".45" />
        ))}
      </g>
      <path
        d="M150 240c-44 0-72-26-72-62 0-33 26-58 60-60 8-44 46-72 92-72 42 0 78 24 90 62 4-1 9-2 14-2 34 0 62 28 62 62 0 40-30 72-72 72z"
        fill="url(#cl)"
        stroke="#9fe3ff"
        strokeWidth="2"
      />
      <text x="260" y="176" textAnchor="middle" fill="#fff" fontFamily="var(--font-head)" fontWeight="800" fontSize="22">
        Cloud platform
      </text>
      <text x="260" y="200" textAnchor="middle" fill="#d6f3ff" fontFamily="var(--font-head)" fontSize="13">
        Public · Private · SAP HANA
      </text>
      {nodes.map((n) => (
        <g key={n.label}>
          <path d={`M260 246 C260 296 ${n.x + 50} 290 ${n.x + 50} 330`} stroke="#ff7b83" strokeWidth="2" fill="none" strokeDasharray="5 5" />
          <rect x={n.x} y={n.y} width="100" height="46" rx="6" fill="#0f0f66" stroke="#5559d4" />
          <text x={n.x + 50} y={n.y + 28} textAnchor="middle" fill="#fff" fontFamily="var(--font-head)" fontWeight="700" fontSize="14">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
