"use client";

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

type Errors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

export default function ContactForm({ defaultDomain = "" }: { defaultDomain?: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [mailto, setMailto] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const next: Errors = {};
    if (get("name").length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(get("email"))) next.email = "Please enter a valid email address.";
    if (get("phone") && !/^[+()\d\s-]{7,20}$/.test(get("phone"))) next.phone = "Please enter a valid phone number.";
    if (get("message").length < 10) next.message = "Please tell us a little about what you need (at least 10 characters).";
    setErrors(next);
    if (Object.keys(next).length) {
      setMailto("");
      const first = Object.keys(next)[0];
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
    const href = `mailto:${company.email}?subject=${encodeURIComponent(`Website enquiry: ${get("interest")}`)}&body=${encodeURIComponent(lines.filter((l): l is string => l !== false).join("\n"))}`;
    setMailto(href);
    window.location.href = href;
  }

  const fieldProps = (k: keyof Errors) => ({
    "aria-invalid": errors[k] ? (true as const) : undefined,
    "aria-describedby": errors[k] ? `${k}-err` : undefined,
  });
  const err = (k: keyof Errors) =>
    errors[k] ? <p className="err" id={`${k}-err`}>{errors[k]}</p> : null;

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" autoComplete="name" required {...fieldProps("name")} />
          {err("name")}
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required {...fieldProps("email")} />
          {err("email")}
        </div>
        <div className="field">
          <label htmlFor="phone">Phone <span className="opt">(optional)</span></label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" {...fieldProps("phone")} />
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
        <textarea id="message" name="message" required {...fieldProps("message")} />
        {err("message")}
      </div>
      <div>
        <button type="submit" className="btn btn--primary">Prepare email to sales</button>
      </div>
      <div aria-live="polite">
        {mailto && (
          <div className="status status--ok">
            Your email app should now open with your enquiry addressed to {company.email}. If nothing opened,{" "}
            <a href={mailto}>click here to open it</a> or write to us directly at{" "}
            <a href={`mailto:${company.email}`}>{company.email}</a>.
          </div>
        )}
      </div>
      <p className="note">
        This form prepares an email in your own mail app; nothing is stored or sent by this website.
      </p>
    </form>
  );
}
