"use client";

import Link from "next/link";
import { useState } from "react";

const DOMAIN_RE = /^(?=.{3,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/;

export default function DomainSearch() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const d = value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
    if (!DOMAIN_RE.test(d)) {
      setSubmitted("");
      setError("Enter a domain name such as yourcompany.com or yourcompany.co.in.");
      return;
    }
    setError("");
    setSubmitted(d);
  }

  return (
    <div>
      <form className="domain-form" onSubmit={onSubmit} noValidate aria-label="Domain enquiry">
        <div className="input-wrap">
          <label htmlFor="domain" className="prefix">www.</label>
          <input
            id="domain"
            name="domain"
            type="text"
            inputMode="url"
            autoComplete="off"
            placeholder="yourcompany.com"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby="domain-msg"
          />
        </div>
        <button type="submit" className="btn btn--primary">Check with our team</button>
      </form>
      <div id="domain-msg" aria-live="polite" style={{ marginTop: 14 }}>
        {error && <p className="err" style={{ color: "var(--red-dark)", fontWeight: 600 }}>{error}</p>}
        {submitted && (
          <div className="status status--info">
            <p style={{ margin: 0 }}>
              <strong>{submitted}</strong> looks like a valid name. Live availability lookup is not connected on this
              website yet, so send it to our team and we will confirm availability and registration details.
            </p>
            <p style={{ margin: "10px 0 0" }}>
              <Link className="text-link" href={`/contact?domain=${encodeURIComponent(submitted)}`}>
                Send {submitted} to our team
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
