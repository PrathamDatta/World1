"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CONSENT_CHANGE_EVENT, CONSENT_OPEN_EVENT, readConsent, writeConsent, type Consent } from "@/lib/consent";

const subscribe = (cb: () => void) => {
  window.addEventListener(CONSENT_CHANGE_EVENT, cb);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, cb);
};
// "ssr" = not yet known (server render / first hydration pass), "none" = no choice saved yet
const clientSnapshot = (): Consent | "none" => readConsent() ?? "none";
const serverSnapshot = (): "ssr" => "ssr";

export default function CookieBar() {
  const consent = useSyncExternalStore<Consent | "none" | "ssr">(subscribe, clientSnapshot, serverSnapshot);
  const [reopened, setReopened] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const acceptRef = useRef<HTMLButtonElement>(null);
  const open = consent === "none" || (consent !== "ssr" && reopened);

  // "Cookie settings" in the footer asks the bar to reopen.
  useEffect(() => {
    const reopen = () => {
      setReopened(true);
      requestAnimationFrame(() => acceptRef.current?.focus());
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  // Publish the bar height so the floating WhatsApp / back-to-top buttons sit above it.
  useEffect(() => {
    const root = document.documentElement;
    if (!open || !bar.current) {
      root.style.removeProperty("--cookie-h");
      return;
    }
    const el = bar.current;
    const set = () => root.style.setProperty("--cookie-h", `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--cookie-h");
    };
  }, [open]);

  const choose = (value: Consent) => {
    setReopened(false);
    writeConsent(value);
  };

  if (!open) return null;
  return (
    <div className="cookie-bar" ref={bar} role="region" aria-label="Cookie consent">
      <div className="wrap cookie-bar__inner">
        <p className="cookie-bar__text">
          This website uses cookies to improve your experience. You can accept or reject non-essential cookies; your
          choice is saved in a small cookie on this device.
          {(consent === "accepted" || consent === "rejected") && (
            <span className="cookie-bar__current"> Current choice: {consent}.</span>
          )}
        </p>
        <div className="cookie-bar__actions">
          <button type="button" className="btn btn--primary" ref={acceptRef} onClick={() => choose("accepted")}>
            Accept
          </button>
          <button type="button" className="btn btn--light" onClick={() => choose("rejected")}>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
