"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
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

type Field = "name" | "email" | "phone" | "message";
type Errors = Partial<Record<Field, string>>;

function validate(field: Field, value: string): string | undefined {
  const v = value.trim();
  if (field === "name" && v.length < 2) return "Please enter your name.";
  if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Please enter a valid email address.";
  if (field === "phone" && v && !/^[+()\d\s-]{7,20}$/.test(v)) return "Please enter a valid phone number.";
  if (field === "message" && v.length < 10) return "Please tell us a little about what you need (at least 10 characters).";
  return undefined;
}

export default function ContactForm() {
  const defaultDomain = (useSearchParams().get("domain") ?? "").slice(0, 253);
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<{ mailto: string; body: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const check = (field: Field, value: string) =>
    setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const next: Errors = {};
    (["name", "email", "phone", "message"] as Field[]).forEach((k) => {
      const err = validate(k, get(k));
      if (err) next[k] = err;
    });
    setErrors(next);
    setCopied(false);
    const first = Object.keys(next)[0];
    if (first) {
      setResult(null);
      (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    const lines: (string | false)[] = [
      `Name: ${get("name")}`,
      `Email: ${get("email")}`,
      get("phone") && `Phone: ${get("phone")}`,
      get("company") && `Company: ${get("company")}`,
      `Interested in: ${get("interest")}`,
      get("domain") && `Domain: ${get("domain")}`,
      "",
      get("message"),
    ];
    const body = lines.filter((l): l is string => l !== false).join("\n");
    const mailto = `mailto:${company.email}?subject=${encodeURIComponent(`Website enquiry: ${get("interest")}`)}&body=${encodeURIComponent(body)}`;
    setResult({ mailto, body });
    window.location.href = mailto;
  }

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(`To: ${company.email}\n\n${result.body}`);
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

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" autoComplete="name" required {...props("name")} />
          {err("name")}
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required {...props("email")} />
          {err("email")}
        </div>
        <div className="field">
          <label htmlFor="phone">Phone <span className="opt">(optional)</span></label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" {...props("phone")} />
          {err("phone")}
        </div>
        <div className="field">
          <label htmlFor="company">Company <span className="opt">(optional)</span></label>
          <input id="company" name="company" autoComplete="organization" />
        </div>
        <div className="field">
          <label htmlFor="interest">I am interested in</label>
          <select id="interest" name="interest" defaultValue={defaultDomain ? interests[0] : interests[interests.length - 1]}>
            {interests.map((i) => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="domain">Domain name <span className="opt">(optional)</span></label>
          <input id="domain" name="domain" defaultValue={defaultDomain} placeholder="yourcompany.com" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required {...props("message")} />
        {err("message")}
      </div>
      <div>
        <button type="submit" className="btn btn--primary">Prepare email to sales</button>
      </div>
      <div aria-live="polite">
        {result && (
          <div className="status status--ok">
            Your email app should now open with your enquiry addressed to {company.email}. If nothing opened,{" "}
            <a className="text-link" href={result.mailto}>open it here</a>, copy the message to paste into any
            email, or message us on{" "}
            <a className="text-link" href={company.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a>.
            <div>
              <button type="button" className="btn btn--ghost" onClick={copy}>
                {copied ? "Copied to clipboard" : "Copy message"}
              </button>
            </div>
          </div>
        )}
      </div>
      <p className="note">This form prepares an email in your own mail app; nothing is stored or sent by this website.</p>
    </form>
  );
}
