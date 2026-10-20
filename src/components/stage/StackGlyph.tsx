/** Isometric SVG of the seven-layer stack. Used as the WebGL poster/fallback and as the page-hero emblem. */
export default function StackGlyph({
  highlight = -1,
  className,
  title,
}: {
  highlight?: number;
  className?: string;
  title?: string;
}) {
  const plates = Array.from({ length: 7 }, (_, i) => i);
  return (
    <svg
      viewBox="0 20 240 282"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {plates.map((i) => {
        const y = 196 - i * 26 - (i === highlight ? 10 : 0);
        const on = i === highlight;
        return (
          <g key={i} className={`glyph-plate${on ? " is-on" : ""}`}>
            <path d={`M120 ${y} L214 ${y + 45} L120 ${y + 90} L26 ${y + 45} Z`} className="gp-top" />
            <path d={`M26 ${y + 45} L120 ${y + 90} L214 ${y + 45} L214 ${y + 52} L120 ${y + 97} L26 ${y + 52} Z`} className="gp-side" />
            <path d={`M120 ${y + 18} L168 ${y + 45} M72 ${y + 45} L120 ${y + 72}`} className="gp-grid" />
          </g>
        );
      })}
    </svg>
  );
}
