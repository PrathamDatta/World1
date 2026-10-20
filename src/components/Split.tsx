import { Fragment, type ElementType } from "react";

/**
 * Word-by-word masked text reveal. Words wrapped in *asterisks* render as the serif italic accent, and "|" forces a
 * line break so headlines break where the design wants them. `step` is the per-word stagger in ms.
 * mode "load" animates on mount (above the fold); "view" waits until scrolled into view (see PageEffects).
 */
export default function Split({
  text,
  as: Tag = "span",
  mode = "view",
  className = "",
  delay = 0,
  step,
  id,
}: {
  text: string;
  as?: ElementType;
  mode?: "load" | "view";
  className?: string;
  delay?: number;
  step?: number;
  id?: string;
}) {
  const lines = text.split("|").map((l) => l.trim().split(" "));
  let n = 0;
  return (
    <Tag
      id={id}
      className={`kt ${className}`}
      data-split={mode}
      style={{ ["--d0" as string]: `${delay}ms`, ...(step ? { ["--st" as string]: `${step}ms` } : {}) }}
    >
      {lines.map((words, li) => (
        <Fragment key={li}>
          {li > 0 ? <br /> : null}
          {words.map((w, wi) => {
            const em = w.includes("*");
            const clean = w.replace(/\*/g, "");
            const i = n++;
            return (
              <Fragment key={wi}>
                <span className="sw">
                  <span className={`sw__i${em ? " sw--em" : ""}`} style={{ ["--i" as string]: i }}>
                    {clean}
                  </span>
                </span>
                {wi < words.length - 1 ? " " : null}
              </Fragment>
            );
          })}
        </Fragment>
      ))}
    </Tag>
  );
}
