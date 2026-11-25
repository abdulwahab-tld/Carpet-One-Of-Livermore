"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { canHoverFine, gsap, useGSAP } from "@/components/gsap-setup";
import { useHoverLift } from "@/components/use-hover-lift";
import { business, flooringLinks, navLinks } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [mountedMenu, setMountedMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const menuId = useId();
  const servicesMenuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesPanelRef = useRef<HTMLDivElement>(null);
  const linksBeforeServices = navLinks.slice(0, 2);
  const linksAfterServices = navLinks.slice(2);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) setMountedMenu(true);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!servicesOpen) return;
    const onPointer = (event: PointerEvent) => {
      if (event.target instanceof Node && servicesRef.current?.contains(event.target)) return;
      setServicesOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [servicesOpen]);

  useGSAP((_, contextSafe) => {
    const track = contextSafe ?? ((callback: () => void) => callback);
    if (!canHoverFine()) return;
    const links = gsap.utils.toArray<HTMLElement>("[data-nav-link]");
    const cleanups: Array<() => void> = [];
    links.forEach((link) => {
      const line = link.querySelector("[data-nav-line]");
      if (!line) return;
      gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
      const enter = track(() => gsap.to(line, { scaleX: 1, duration: 0.35, ease: "power2.out" }));
      const leave = track(() => gsap.to(line, { scaleX: 0, duration: 0.28, ease: "power2.in" }));
      link.addEventListener("mouseenter", enter);
      link.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        link.removeEventListener("mouseenter", enter);
        link.removeEventListener("mouseleave", leave);
      });
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, { scope: headerRef });

  useGSAP(() => {
    const menu = menuRef.current;
    if (!menu || !mountedMenu) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (open) {
      if (reduce) {
        gsap.set(menu, { height: "auto", autoAlpha: 1 });
        return;
      }
      gsap.fromTo(menu, { height: 0, autoAlpha: 0 }, { height: "auto", autoAlpha: 1, duration: 0.4, ease: "power3.out" });
      gsap.fromTo(
        menu.querySelectorAll("a"),
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, delay: 0.08, ease: "power2.out", clearProps: "transform,opacity" },
      );
      return;
    }
    if (reduce) {
      setMountedMenu(false);
      return;
    }
    gsap.to(menu, {
      height: 0,
      autoAlpha: 0,
      duration: 0.28,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(menu, { clearProps: "height,opacity,visibility" });
        setMountedMenu(false);
      },
    });
  }, { scope: headerRef, dependencies: [open, mountedMenu] });

  useGSAP(() => {
    const panel = servicesPanelRef.current;
    if (!panel || !servicesOpen) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(panel, { autoAlpha: 1, y: 0 });
      return;
    }
    gsap.fromTo(panel, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out" });
  }, { scope: headerRef, dependencies: [servicesOpen], revertOnUpdate: true });

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? "border-ink/10 bg-plaster/95 backdrop-blur-md" : "border-transparent bg-plaster"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        <Link href="/#top" className="min-w-0">
          <span className="block font-display text-2xl leading-none tracking-tight text-ink md:text-3xl">
            {business.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-5 xl:gap-7 lg:flex" aria-label="Primary">
          {linksBeforeServices.map((link) => (
            <NavItem key={link.href} href={link.href} label={link.label} />
          ))}
          <div
            ref={servicesRef}
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              data-nav-link=""
              className="relative flex items-center gap-1 text-sm text-ink/80"
              aria-expanded={servicesOpen}
              aria-controls={servicesMenuId}
              onClick={() => setServicesOpen((value) => !value)}
            >
              Services
              <svg viewBox="0 0 12 12" className={`h-3 w-3 transition-transform ${servicesOpen ? "rotate-180" : ""}`} aria-hidden="true">
                <path d="M2 4.5 6 8l4-3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span data-nav-line="" className="absolute -bottom-1 left-0 h-px w-full bg-walnut" />
            </button>
            {servicesOpen ? (
              <div ref={servicesPanelRef} id={servicesMenuId} className="absolute top-full left-0 z-20 min-w-56 pt-3">
                <div className="border border-ink/10 bg-plaster py-2 shadow-[0_16px_40px_rgba(28,25,22,0.12)]">
                  {flooringLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm text-ink/80 transition-colors hover:bg-cream hover:text-ink"
                      onClick={() => setServicesOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          {linksAfterServices.map((link) => (
            <NavItem key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <HeaderEstimate />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-ink/15 lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
              <span className={`h-px bg-ink transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px bg-ink transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {mountedMenu ? (
        <nav
          ref={menuRef}
          id={menuId}
          aria-label="Mobile"
          className="overflow-hidden border-t border-ink/10 bg-ink text-plaster lg:hidden"
        >
          <div className="flex flex-col gap-1 px-5 py-6">
            {linksBeforeServices.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 font-display text-4xl"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <p className="pt-3 text-xs tracking-[0.18em] text-brass uppercase">Services</p>
            {flooringLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 font-display text-3xl"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {linksAfterServices.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 font-display text-4xl"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a href={`tel:${business.phoneTel}`} className="mt-4 text-sm text-brass" onClick={() => setOpen(false)}>
              {business.phoneDisplay}
            </a>
            <Link
              href="/#contact"
              className="mt-4 inline-flex min-h-12 items-center justify-center bg-plaster px-5 text-sm text-ink"
              onClick={() => setOpen(false)}
            >
              Request a Free Estimate
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} data-nav-link="" className="relative text-sm text-ink/80">
      {label}
      <span data-nav-line="" className="absolute -bottom-1 left-0 h-px w-full bg-walnut" />
    </Link>
  );
}

function HeaderEstimate() {
  const ref = useRef<HTMLAnchorElement>(null);
  useHoverLift(ref);

  return (
    <Link
      ref={ref}
      href="/#contact"
      className="hidden min-h-11 items-center bg-ink px-5 text-sm tracking-wide text-plaster transition-colors duration-300 hover:bg-walnut sm:inline-flex"
    >
      Request a Free Estimate
    </Link>
  );
}
