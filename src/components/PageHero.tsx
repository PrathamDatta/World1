import Link from "next/link";
import Split from "./Split";
import StackGlyph from "./stage/StackGlyph";

export default function PageHero({
  title,
  intro,
  layer = -1,
}: {
  title: string;
  intro: string;
  layer?: number;
}) {
  return (
    <section className="page-hero">
      <div className="wrap page-hero__grid">
        <div>
          <p className="crumbs enter" style={{ ["--i" as string]: 0 }}>
            <Link href="/">Home</Link> / {title}
          </p>
          <Split as="h1" text={title} mode="load" />
          <p className="page-hero__intro enter" style={{ ["--i" as string]: 3 }}>{intro}</p>
        </div>
        <div className="page-hero__glyph enter" style={{ ["--i" as string]: 2 }}>
          <StackGlyph highlight={layer} className="glyph" />
          {layer >= 0 && <span className="page-hero__no" aria-hidden="true">{String(layer + 1).padStart(2, "0")}</span>}
        </div>
      </div>
    </section>
  );
}
