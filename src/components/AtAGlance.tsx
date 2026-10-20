import { pages, type PageKey } from "@/data/pages";

/** Plain-language summary at the top of a page: a definition-style lead plus the key facts as a description list. */
export default function AtAGlance({ page }: { page: PageKey }) {
  const g = pages[page].glance;
  if (!g) return null;
  return (
    <section className="glance" aria-label="Summary">
      <div className="wrap glance__grid">
        <p className="glance__lead">{g.lead}</p>
        <dl className="glance__facts">
          {g.facts.map((f) => (
            <div key={f.term}>
              <dt>{f.term}</dt>
              <dd>{f.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
