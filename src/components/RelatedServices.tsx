import Link from "next/link";
import { pages, type PageKey } from "@/data/pages";

export default function RelatedServices({ page }: { page: PageKey }) {
  const keys = pages[page].related;
  if (!keys?.length) return null;
  return (
    <section className="section section--mist related" aria-labelledby="related-title">
      <div className="wrap">
        <p className="eyebrow">Related</p>
        <h2 id="related-title">Related AdINET services</h2>
        <ul className="related__list">
          {keys.map((k) => (
            <li key={k}>
              <Link href={pages[k].path} className="related__link" data-cursor="Open">
                <strong>{pages[k].name}</strong>
                <span>{pages[k].blurb}</span>
                <i aria-hidden="true">→</i>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
