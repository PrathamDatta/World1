export default function Marquee({ items, outline = false }: { items: string[]; outline?: boolean }) {
  const row = (hidden: boolean) => (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <li key={t}>
          <span>{t}</span>
          <i aria-hidden="true">✦</i>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`marquee${outline ? " marquee--outline" : ""}`} aria-hidden="true">
      <div className="marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
