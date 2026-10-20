"use client";

import Link from "next/link";
import { layers } from "@/data/layers";
import { setStage } from "@/lib/stage";

/** Real links to every service, listed top-down like the stack. Hover/focus lights the matching 3D layer. */
export default function StackIndex() {
  const top = [...layers].reverse();
  return (
    <nav className="stack-index" aria-label="Services">
      <p className="stack-index__cap">The stack, top to bottom</p>
      <ol>
        {top.map((l) => (
          <li key={l.id}>
            <Link
              href={l.links[0].href}
              data-cursor="Open"
              onPointerEnter={(e) => e.pointerType === "mouse" && setStage({ hover: l.index })}
              onPointerLeave={() => setStage({ hover: -1 })}
              onFocus={() => setStage({ hover: l.index })}
              onBlur={() => setStage({ hover: -1 })}
            >
              <span className="si-n">{String(l.index + 1).padStart(2, "0")}</span>
              <span className="si-l">{l.label}</span>
              <span className="si-a" aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
