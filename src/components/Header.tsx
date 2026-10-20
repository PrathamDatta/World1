"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { company, isGroup, nav } from "@/data/site";

function Chevron() {
  return (
    <svg viewBox="0 0 10 10" aria-hidden="true">
      <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setOpenGroup(null);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenGroup(null);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  const go = () => {
    setOpenGroup(null);
    setMenuOpen(false);
  };
  const current = (href: string) => (pathname === href ? "page" : undefined);

  return (
    <header className="site-header">
      <div className="wrap site-header__bar" ref={barRef}>
        <Link href="/" className="brand" onClick={go} aria-label={`${company.name} home`}>
          <Image src="/brand/adinet-logo.png" alt="" width={74} height={61} priority />
          <span>
            {company.shortName}
            <small>{company.location}</small>
          </span>
        </Link>

        <nav className="nav-desktop" aria-label="Primary">
          {nav.map((entry) =>
            isGroup(entry) ? (
              <div
                className="nav-item"
                key={entry.label}
                onMouseEnter={() => setOpenGroup(entry.label)}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <button
                  type="button"
                  className={`nav-trigger${entry.items.some((i) => i.href === pathname) ? " is-current" : ""}`}
                  aria-expanded={openGroup === entry.label}
                  aria-controls={`dd-${entry.label}`}
                  onClick={() => setOpenGroup(openGroup === entry.label ? null : entry.label)}
                >
                  {entry.label} <Chevron />
                </button>
                {openGroup === entry.label && (
                  <div className="dropdown" id={`dd-${entry.label}`}>
                    {entry.items.map((item) => (
                      <Link key={item.href} href={item.href} onClick={go} aria-current={current(item.href)}>
                        <strong>{item.label}</strong>
                        {item.description && <span>{item.description}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={entry.href} href={entry.href} className="nav-link" aria-current={current(entry.href)} onClick={go}>
                {entry.label}
              </Link>
            ),
          )}
        </nav>

        <Link href="/contact" className="btn btn--primary header-cta" onClick={go}>
          Contact sales
        </Link>
        <button
          type="button"
          className="menu-btn"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            {menuOpen ? (
              <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav className="nav-mobile" id="mobile-nav" aria-label="Mobile">
          <div className="wrap">
            {nav.map((entry) =>
              isGroup(entry) ? (
                <div key={entry.label}>
                  <div className="group-label">{entry.label}</div>
                  {entry.items.map((item) => (
                    <Link key={item.href} href={item.href} onClick={go} aria-current={current(item.href)}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link key={entry.href} href={entry.href} onClick={go} aria-current={current(entry.href)}>
                  {entry.label}
                </Link>
              ),
            )}
            <Link href="/contact" className="btn btn--primary" onClick={go}>
              Contact sales
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
