/** Cookie-consent storage. The choice itself is kept in one first-party cookie (no tracking, no third parties). */
export const CONSENT_COOKIE = "adinet_consent";
export const CONSENT_OPEN_EVENT = "adinet:cookie-open";
export const CONSENT_CHANGE_EVENT = "adinet:consent";
const MAX_AGE = 60 * 60 * 24 * 180; // 180 days

export type Consent = "accepted" | "rejected";

export function readConsent(): Consent | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=(accepted|rejected)`));
  return (m?.[1] as Consent | undefined) ?? null;
}

export function writeConsent(value: Consent) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: value }));
}

/** For future analytics/marketing scripts: only load them when this returns true. */
export const hasOptionalConsent = () => readConsent() === "accepted";
