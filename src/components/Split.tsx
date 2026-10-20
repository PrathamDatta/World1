import { Fragment, type ElementType } from "react";

/**
 * Word-by-word masked text reveal. Words wrapped in *asterisks* render as the serif italic accent.
 * mode "load" animates on mount (above the fold); "view" waits until scrolled into view (see PageEffects).
 */
export default function Split({
  text,
  as: Tag = "span",
  mode = "view",
  className = "",
  delay = 0,
  id,
}: {
  text: string;
  as?: ElementType;
  mode?: "load" | "view";
  className?: string;
  delay?: number;
  id?: string;
}) {
  const words = text.split(" ");
  return (
    <Tag id={id} className={`kt ${className}`} data-split={mode} style={{ ["--d0" as string]: `${delay}ms` }}>
      {words.map((w, i) => {
        const em = w.includes("*");
        const clean = w.replace(/\*/g, "");
        return (
          <Fragment key={i}>
            <span className="sw">
              <span className={`sw__i${em ? " sw--em" : ""}`} style={{ ["--i" as string]: i }}>
                {clean}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </Tag>
  );
}
