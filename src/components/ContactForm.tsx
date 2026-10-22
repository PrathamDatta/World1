"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { company } from "@/data/site";

const interests = [
  "Domain registration",
  "IT support",
  "Cloud hosting",
  "Web hosting",
  "Business email",
  "Website design",
  "Custom web application",
  "Security & addons",
  "Something else",
];

// The enquiry is posted to a small PHP script on the website's own host (public/contact.php). Where that script does not
// exist (a preview deployment, local development) the request fails and the visitor gets the mail-app fallback below.
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "/contact.php";
const DOMAIN_RE = /^(?=.{3,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/;

type Field = "name" | "email" | "phone" | "domain" | "message";
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "sent" | "failed";

function validate(field: Field, value: string): string | undefined {
  const v = value.trim();
  if (field === "name" && v.length < 2) return "Please enter your name.";
  if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Please enter a valid email address.";
  if (field === "phone" && v && !/^[+()\d\s-]{7,20}$/.test(v)) return "Please enter a valid phone number.";
  if (field === "domain" && v) {
    const d = v.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
    if (!DOMAIN_RE.test(d)) return "Please enter a domain name such as yourcompany.com.";
  }
  if (field === "message" && v.length < 10) return "Please tell us a little about what you need (at least 10 characters).";
  return undefined;
}

export default function ContactForm() {
  const defaultDomain = (useSearchParams().get("domain") ?? "").slice(0, 253);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [notice, setNotice] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [fallback, setFallback] = useState<{ mailto: string; body: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const startedAt = useRef(0);
  const resultRef = useRef<HTMLDivElement>(null);

  // When the form was shown: real visitors take a few seconds, bots submit instantly (checked again on the server).
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const check = (field: Field, value: string) =>
    setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const f = new FormData(form);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const next: Errors = {};
    (["name", "email", "phone", "domain", "message"] as Field[]).forEach((k) => {
      const err = validate(k, get(k));
      if (err) next[k] = err;
    });
    setErrors(next);
    setCopied(false);
    setNotice("");
    const first = Object.keys(next)[0];
    if (first) {
      setStatus("idle");
      setFallback(null);
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    const payload = {
      name: get("name"),
      email: get("email"),
      phone: get("phone"),
      company: get("company"),
      interest: get("interest"),
      domain: get("domain"),
      message: get("message"),
      website: get("website"), // honeypot, left empty by real visitors
      elapsed: Date.now() - startedAt.current,
    };
    const body = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      payload.phone && `Phone: ${payload.phone}`,
      payload.company && `Company: ${payload.company}`,
      `Interested in: ${payload.interest}`,
      payload.domain && `Domain: ${payload.domain}`,
      "",
      payload.message,
    ]
      .filter((l): l is string => typeof l === "string")
      .join("\n");
    const mailto = `mailto:${company.email}?subject=${encodeURIComponent(`Website enquiry: ${payload.interest}`)}&body=${encodeURIComponent(body)}`;

    setStatus("sending");
    setFallback(null);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      let json: { ok?: boolean; error?: string; fields?: Errors } | null = null;
      try {
        json = await res.json();
      } catch {
        json = null; // not our script (for example a 404 page)
      }
      if (res.ok && json?.ok) {
        setSentTo(payload.email);
        setStatus("sent");
        form.reset();
        startedAt.current = Date.now();
        requestAnimationFrame(() => resultRef.current?.focus());
        return;
      }
      if (res.status === 422 && json) {
        setErrors(json.fields ?? {});
        setNotice(json.error ?? "Please check your details and try again.");
        setStatus("idle");
        const bad = Object.keys(json.fields ?? {})[0];
        if (bad) (form.elements.namedItem(bad) as HTMLElement | null)?.focus();
        return;
      }
      setNotice(json?.error ?? "We could not send your message automatically.");
    } catch {
      setNotice("We could not reach our server. Please check your connection and try again.");
    } finally {
      window.clearTimeout(timer);
    }
    // Anything else: keep what they typed, let them retry, and offer ways to reach us that always work.
    setFallback({ mailto, body });
    setStatus("failed");
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  async function copy() {
    if (!fallback) return;
    try {
      await navigator.clipboard.writeText(`To: ${company.email}\n\n${fallback.body}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const props = (k: Field) => ({
    "aria-invalid": errors[k] ? (true as const) : undefined,
    "aria-describedby": errors[k] ? `${k}-err` : undefined,
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => check(k, e.target.value),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (errors[k]) check(k, e.target.value);
    },
  });
  const err = (k: Field) => (errors[k] ? <p className="err" id={`${k}-err`}>{errors[k]}</p> : null);
  const sending = status === "sending";

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-busy={sending}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" autoComplete="name" required maxLength={100} {...props("name")} />
          {err("name")}
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} {...props("email")} />
          {err("email")}
        </div>
        <div className="field">
          <label htmlFor="phone">Phone <span className="opt">(optional)</span></label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} {...props("phone")} />
          {err("phone")}
        </div>
        <div className="field">
          <label htmlFor="company">Company <span className="opt">(optional)</span></label>
          <input id="company" name="company" autoComplete="organization" maxLength={150} />
        </div>
        <div className="field">
          <label htmlFor="interest">I am interested in</label>
          <select id="interest" name="interest" defaultValue={defaultDomain ? interests[0] : interests[interests.length - 1]}>
            {interests.map((i) => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="domain">Domain name <span className="opt">(optional)</span></label>
          <input id="domain" name="domain" defaultValue={defaultDomain} placeholder="yourcompany.com" maxLength={253} {...props("domain")} />
          {err("domain")}
        </div>
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required maxLength={5000} {...props("message")} />
        {err("message")}
      </div>
      {/* Honeypot: hidden from people and assistive technology; bots that fill every field give themselves away. */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <button type="submit" className="btn btn--primary" disabled={sending}>
          {sending ? "Sending…" : "Send message"}
        </button>
      </div>
      <div aria-live="polite" ref={resultRef} tabIndex={-1} className="form-result">
        {notice && status === "idle" && <p className="err">{notice}</p>}
        {status === "sent" && (
          <div className="status status--ok" role="status">
            <strong>Thank you, your message has been sent.</strong> Our team will reply to {sentTo}. If it is urgent, call{" "}
            <a className="text-link" href={company.phoneHref}>{company.phone}</a> or message us on{" "}
            <a className="text-link" href={company.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a>.
          </div>
        )}
        {status === "failed" && fallback && (
          <div className="status status--info" role="alert">
            <strong>{notice}</strong> Your details are still in the form, so you can press Send again. Or reach us another way:{" "}
            <a className="text-link" href={fallback.mailto}>email {company.email}</a>, call{" "}
            <a className="text-link" href={company.phoneHref}>{company.phone}</a>, or message us on{" "}
            <a className="text-link" href={company.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a>.
            <div>
              <button type="button" className="btn btn--ghost" onClick={copy}>
                {copied ? "Copied to clipboard" : "Copy message"}
              </button>
            </div>
          </div>
        )}
      </div>
      <p className="note">
        Your message goes to our sales team by email. We use your details only to reply to your enquiry.
      </p>
    </form>
  );
}
