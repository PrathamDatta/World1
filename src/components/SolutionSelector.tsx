import Link from "next/link";
import Tabs from "./Tabs";
import { goals } from "@/data/services";

export default function SolutionSelector() {
  return (
    <Tabs
      label="What do you need to do?"
      tabs={goals.map((g) => ({
        id: g.id,
        label: g.label,
        content: (
          <div>
            <p className="lede" style={{ marginBottom: 24 }}>{g.intro}</p>
            <div className="grid-3">
              {g.picks.map((p) => (
                <Link key={p.title} href={p.href} className="solution-card">
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                  <span className="arrow-link">Open <span aria-hidden="true">→</span></span>
                </Link>
              ))}
            </div>
          </div>
        ),
      }))}
    />
  );
}
