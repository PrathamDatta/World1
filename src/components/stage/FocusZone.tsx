"use client";

import { useEffect, useRef } from "react";
import { setStage } from "@/lib/stage";

/** Reports which layer of the stack the scroll story is currently centred on. */
export default function FocusZone({
  index,
  className,
  id,
  children,
  labelledBy,
}: {
  index: number;
  className?: string;
  id?: string;
  children: React.ReactNode;
  labelledBy?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStage({ focus: index });
      },
      { rootMargin: "-42% 0px -42% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [index]);
  return (
    <section ref={ref} className={className} id={id} aria-labelledby={labelledBy} data-layer={index}>
      {children}
    </section>
  );
}
