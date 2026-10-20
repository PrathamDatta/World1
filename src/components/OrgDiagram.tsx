/** Project team structure as described on the existing ADINET site: the client sits at the centre. */
const roles = [
  { x: 20, y: 123, label: "Director" },
  { x: 340, y: 123, label: "Creative team" },
  { x: 180, y: 20, label: "Project advisor" },
  { x: 180, y: 226, label: "Programming team" },
];

export default function OrgDiagram() {
  return (
    <svg
      viewBox="0 0 480 280"
      role="img"
      aria-label="Project team structure: director, project advisor, creative team and programming team all connected to the client"
      style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}
    >
      <g stroke="#1469df" strokeWidth="2" fill="none">
        <line x1="140" y1="140" x2="202" y2="140" />
        <line x1="340" y1="140" x2="278" y2="140" />
        <line x1="240" y1="54" x2="240" y2="102" />
        <line x1="240" y1="226" x2="240" y2="178" />
      </g>
      <circle cx="240" cy="140" r="38" fill="#1469df" />
      <text x="240" y="145" textAnchor="middle" fill="#ffffff" fontFamily="var(--font-head)" fontWeight="800" fontSize="15">Client</text>
      {roles.map((r) => (
        <g key={r.label}>
          <rect x={r.x} y={r.y} width="120" height="34" rx="6" fill="#0b3d91" />
          <text x={r.x + 60} y={r.y + 21} textAnchor="middle" fill="#fff" fontFamily="var(--font-head)" fontWeight="700" fontSize="12">
            {r.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
