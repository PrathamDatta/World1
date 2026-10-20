import { faqs } from "@/data/faqs";
import type { PageKey } from "@/data/pages";
import Accordion from "./Accordion";

/** FAQ section driven by src/data/faqs.ts (the same data feeds the FAQPage JSON-LD). Answers stay in the HTML even while collapsed. */
export default function FaqSection({ page, tone = "paper" }: { page: PageKey; tone?: "paper" | "mist" }) {
  const f = faqs[page];
  if (!f) return null;
  return (
    <section className={`section${tone === "mist" ? " section--mist" : ""}`} aria-labelledby="faq-title">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-title">{f.heading}</h2>
        </div>
        <Accordion items={f.items.map((i) => ({ q: i.q, a: <p>{i.a}</p> }))} />
      </div>
    </section>
  );
}
