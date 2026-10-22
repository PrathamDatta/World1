"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { asset } from "@/data/assets";
import { company, isGroup, nav, type NavGroup } from "@/data/site";

function Chevron() {
  return (
    <svg viewBox="0 0 10 10" aria-hidden="true" className="chev">
      <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

type Opened = { label: string; by: "hover" | "click" | "key" } | null;

function DesktopGroup({
  group,
  pathname,
  opened,
  setOpened,
}: {
  group: NavGroup;
  pathname: string;
  opened: Opened;
  setOpened: (o: Opened) => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isOpen = opened?.label === group.label;
  const id = `dd-${group.label.replace(/\W+/g, "-").toLowerCase()}`;

  const focusItem = (i: number) => {
    const links = wrap.current?.querySelectorAll<HTMLAnchorElement>(".dd a");
    if (!links?.length) return;
    links[(i + links.length) % links.length].focus();
  };

  return (
    <div
      className="nav-item"
      ref={wrap}
      // Hover only opens for a real mouse: touch/pen taps must not trigger it, otherwise the tap's click would immediately close the menu again.
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        clearTimeout(timer.current);
        if (!isOpen) setOpened({ label: group.label, by: "hover" });
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          if (opened?.label === group.label && opened.by === "hover") setOpened(null);
        }, 180);
      }}
      onBlur={(e) => {
        // Only keyboard focus moving elsewhere closes the menu. A null relatedTarget (pointer press on non-focusable area, or Safari not focusing links on click) is left to the outside-pointerdown handler.
        if (e.relatedTarget && !wrap.current?.contains(e.relatedTarget as Node) && isOpen) setOpened(null);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && isOpen) {
          e.stopPropagation();
          setOpened(null);
          trigger.current?.focus();
        }
        const inMenu = (e.target as HTMLElement).closest(".dd");
        if (inMenu) {
          const links = Array.from(wrap.current?.querySelectorAll<HTMLAnchorElement>(".dd a") ?? []);
          const i = links.indexOf(document.activeElement as HTMLAnchorElement);
          if (e.key === "ArrowDown") { e.preventDefault(); focusItem(i + 1); }
          if (e.key === "ArrowUp") { e.preventDefault(); focusItem(i - 1); }
          if (e.key === "Home") { e.preventDefault(); focusItem(0); }
          if (e.key === "End") { e.preventDefault(); focusItem(-1); }
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        className={`nav-trigger${group.items.some((i) => i.href === pathname) ? " is-current" : ""}`}
        aria-expanded={isOpen}
        aria-controls={id}
        onClick={() => {
          // A click on a menu that hover opened pins it open; a second click closes it.
          if (isOpen && opened?.by === "hover") setOpened({ label: group.label, by: "click" });
          else setOpened(isOpen ? null : { label: group.label, by: "click" });
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpened({ label: group.label, by: "key" });
            requestAnimationFrame(() => focusItem(0));
          }
        }}
      >
        {group.label} <Chevron />
      </button>
      <div className="dd" id={id} data-open={isOpen}>
        <ul className="dd__card">
          {group.items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => setOpened(null)}
              >
                <strong>{item.label}</strong>
                {item.description && <span>{item.description}</span>}
                <i aria-hidden="true">→</i>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Header() {
  // Static hosting serves pages at /about/ (trailing slash); normalise so the active-page state matches either form.
  const rawPath = usePathname();
  const pathname = rawPath.length > 1 ? rawPath.replace(/\/+$/, "") : rawPath;
  const [opened, setOpened] = useState<Opened>(null);
  // Menu state is tied to the pathname it was opened on, so navigating always closes it without an effect.
  const [menu, setMenu] = useState<{ open: boolean; path: string }>({ open: false, path: pathname });
  const [mGroup, setMGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const menuOpen = menu.open && menu.path === pathname;

  const closeAll = useCallback(() => {
    setOpened(null);
    setMenu({ open: false, path: pathname });
  }, [pathname]);

  useEffect(() => {
    const down = (e: PointerEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setOpened(null);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpened(null);
        if (menuOpen) {
          setMenu({ open: false, path: pathname });
          menuBtn.current?.focus();
        }
      }
    };
    const resize = () => {
      if (window.innerWidth >= 1000) setMenu((m) => ({ ...m, open: false }));
    };
    let raf = 0;
    const scroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    scroll();
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", scroll);
      cancelAnimationFrame(raf);
    };
  }, [menuOpen, pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const current = (href: string) => (pathname === href ? ("page" as const) : undefined);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${menuOpen ? " is-menu-open" : ""}`}>
      <div className="wrap site-header__bar" ref={barRef}>
        <Link href="/" className="brand" onClick={closeAll}>
          <Image src={asset("/brand/adinet-logo.png")} alt="" width={74} height={61} priority />
          <span>
            {company.shortName}
            <small>INFOSYSTEMS</small>
          </span>
        </Link>

        <nav className="nav-desktop" aria-label="Primary">
          {nav.map((entry) =>
            isGroup(entry) ? (
              <DesktopGroup key={entry.label} group={entry} pathname={pathname} opened={opened} setOpened={setOpened} />
            ) : (
              <Link key={entry.href} href={entry.href} className="nav-link" aria-current={current(entry.href)} onClick={closeAll}>
                {entry.label}
              </Link>
            ),
          )}
        </nav>

        <Link href="/contact" className="btn btn--primary header-cta" onClick={closeAll}>
          Contact sales
        </Link>
        <button
          ref={menuBtn}
          type="button"
          className="menu-btn"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenu({ open: !menuOpen, path: pathname })}
        >
          <span className="menu-btn__bars" aria-hidden="true" />
        </button>
      </div>

      <nav className="m-panel" id="mobile-nav" aria-label="Mobile" data-open={menuOpen}>
        <div className="wrap">
          {nav.map((entry) =>
            isGroup(entry) ? (
              <div key={entry.label} className="m-group">
                <button
                  type="button"
                  className="m-link m-trigger"
                  aria-expanded={mGroup === entry.label}
                  aria-controls={`m-${entry.label.replace(/\W+/g, "-")}`}
                  onClick={() => setMGroup(mGroup === entry.label ? null : entry.label)}
                >
                  {entry.label} <Chevron />
                </button>
                <div className="m-sub" id={`m-${entry.label.replace(/\W+/g, "-")}`} data-open={mGroup === entry.label}>
                  <ul>
                    {entry.items.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className="m-link m-link--sub" onClick={closeAll} aria-current={current(item.href)}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link key={entry.href} href={entry.href} className="m-link" onClick={closeAll} aria-current={current(entry.href)}>
                {entry.label}
              </Link>
            ),
          )}
          <Link href="/contact" className="btn btn--primary m-cta" onClick={closeAll}>
            Contact sales
          </Link>
        </div>
      </nav>
    </header>
  );
}
