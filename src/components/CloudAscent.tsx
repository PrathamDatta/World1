"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { layers } from "@/data/layers";
import { ascent, setAscent, subscribeAscent } from "@/lib/ascent";

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

const useAscent = () =>
  useSyncExternalStore(
    subscribeAscent,
    () => `${ascent.mode}:${ascent.active}`,
    () => "static:0",
  );

/**
 * The seven services, revealed one at a time as the camera climbs through seven cloud layers in the shared sky scene.
 * The section is tall and its content sticky (native scrolling, nothing is hijacked). Without WebGL, with reduced
 * motion, or before the scene is ready, it renders as a plain readable list of all seven services.
 */
export default function CloudAscent() {
  const snapshot = useAscent();
  const [, activeStr] = snapshot.split(":");
  const active = Number(activeStr);
  const tour = snapshot.startsWith("tour");
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);
  const glLive = useSyncExternalStore(subscribeAscent, () => ascent.gl, () => false);

  useEffect(() => {
    setAscent({ mode: glLive && !reduced ? "tour" : "static" });
    return () => setAscent({ mode: "static", active: 0 });
  }, [glLive, reduced]);

  const goTo = (i: number) => {
    const el = document.getElementById("ascent");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const len = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (i / (layers.length - 1)) * len + (i === layers.length - 1 ? -2 : 2), behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div id="ascent" className="ascent" data-mode={tour ? "tour" : "static"}>
      <div className="ascent__stick">
        <div className="wrap ascent__inner">
          <ol className="ascent__items">
            {layers.map((l) => {
              const on = !tour || l.index === active;
              return (
                <li key={l.id} className="ascent__item" data-on={on} aria-hidden={on ? undefined : true} inert={!on}>
                  <p className="ascent__no" aria-hidden="true">{String(l.index + 1).padStart(2, "0")}</p>
                  <p className="ascent__tag">Layer {l.index + 1} of {layers.length} · {l.tag}</p>
                  <h3>{l.title}</h3>
                  <p className="ascent__text">{l.text}</p>
                  <p className="ascent__links">
                    {l.links.map((k) => (
                      <Link key={k.href} href={k.href} className="btn btn--primary">
                        {k.label} <span className="btn__arrow" aria-hidden="true">→</span>
                      </Link>
                    ))}
                  </p>
                </li>
              );
            })}
          </ol>
          {tour && (
            <div className="ascent__rail">
              <a href="#after-ascent" className="ascent__skip">Skip the layer tour</a>
              <ul aria-label="Jump to a service layer">
                {layers.map((l) => (
                  <li key={l.id}>
                    <button type="button" aria-label={`Layer ${l.index + 1}: ${l.label}`} aria-current={l.index === active ? "step" : undefined} data-on={l.index === active} onClick={() => goTo(l.index)}>
                      <span aria-hidden="true">{l.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
