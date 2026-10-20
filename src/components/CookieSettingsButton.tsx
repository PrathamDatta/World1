"use client";

import { CONSENT_OPEN_EVENT } from "@/lib/consent";

export default function CookieSettingsButton() {
  return (
    <button type="button" className="footer-linkbtn" onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}>
      Cookie settings
    </button>
  );
}
