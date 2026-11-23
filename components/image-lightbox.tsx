"use client";

import { createPortal } from "react-dom";
import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/components/gsap-setup";

export type LightboxImage = {
  src: string;
  alt: string;
  caption?: string;
};

type Session = {
  id: number;
  images: LightboxImage[];
  index: number;
};

type LightboxContextValue = {
  open: (images: readonly LightboxImage[], index?: number) => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightbox() {
  const value = useContext(LightboxContext);
  if (!value) {
    throw new Error("useLightbox must be used within LightboxProvider");
  }
  return value;
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  const open = useCallback((images: readonly LightboxImage[], index = 0) => {
    if (images.length === 0) return;
    const nextIndex = ((index % images.length) + images.length) % images.length;
    setSession({ id: Date.now(), images: images.map((image) => ({ ...image })), index: nextIndex });
  }, []);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <LightboxContext.Provider value={value}>
      {children}
      {session ? <LightboxView key={session.id} session={session} onExited={() => setSession(null)} /> : null}
    </LightboxContext.Provider>
  );
}

function LightboxView({ session, onExited }: { session: Session; onExited: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(<LightboxStage session={session} onExited={onExited} />, document.body);
}

function LightboxStage({ session, onExited }: { session: Session; onExited: () => void }) {
  const [index, setIndex] = useState(session.index);
  const titleId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const direction = useRef(1);
  const swapped = useRef(false);
  const closing = useRef(false);
  const pointerStart = useRef<number | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const active = session.images[index];

  useEffect(() => {
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus.current?.focus();
    };
  }, []);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      onExited();
      return;
    }
    gsap.timeline({ onComplete: onExited })
      .to(frameRef.current, { autoAlpha: 0, scale: 0.96, duration: 0.32, ease: "power2.in" })
      .to(backdropRef.current, { autoAlpha: 0, duration: 0.28, ease: "power2.in" }, 0);
  }, [onExited]);

  const step = useCallback((delta: number) => {
    direction.current = delta > 0 ? 1 : -1;
    setIndex((current) => (current + delta + session.images.length) % session.images.length);
  }, [session.images.length]);

  useEffect(() => {
    const node = rootRef.current;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "Tab" && node) {
        const items = Array.from(node.querySelectorAll<HTMLElement>("button"));
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close, step]);

  useGSAP(() => {
    const backdrop = backdropRef.current;
    const frame = frameRef.current;
    if (!backdrop || !frame) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set([backdrop, frame], { autoAlpha: 1, scale: 1 });
      return;
    }
    gsap.fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
    gsap.fromTo(frame, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.55, ease: "power3.out" });
  }, { scope: rootRef });

  useGSAP(() => {
    if (!swapped.current) {
      swapped.current = true;
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !photoRef.current) return;
    gsap.fromTo(
      photoRef.current,
      { autoAlpha: 0, x: 32 * direction.current },
      { autoAlpha: 1, x: 0, duration: 0.45, ease: "power3.out" },
    );
  }, { dependencies: [index], scope: frameRef });

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-10"
    >
      <div ref={backdropRef} className="absolute inset-0 bg-ink/92" onClick={close} />
      <div
        ref={frameRef}
        className="relative z-10 flex w-full max-w-6xl flex-col"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => {
          if ((event.target as HTMLElement).closest("button")) return;
          pointerStart.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (pointerStart.current === null) return;
          const delta = event.clientX - pointerStart.current;
          pointerStart.current = null;
          if (session.images.length < 2) return;
          if (delta > 48) step(-1);
          if (delta < -48) step(1);
        }}
      >
        <div ref={photoRef} className="relative h-[72vh] w-full">
          <Image
            key={active.src}
            src={active.src}
            alt={active.alt}
            fill
            sizes="92vw"
            className="object-contain"
            priority
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-plaster">
          <p id={titleId} className="text-sm">
            {active.caption ?? active.alt}
            {session.images.length > 1 ? (
              <span className="ml-3 text-plaster/60">
                {index + 1} / {session.images.length}
              </span>
            ) : null}
          </p>
          <div className="flex gap-2">
            {session.images.length > 1 ? (
              <>
                <button type="button" className="min-h-11 border border-plaster/40 px-4 text-sm" onClick={() => step(-1)}>
                  Previous
                </button>
                <button type="button" className="min-h-11 border border-plaster/40 px-4 text-sm" onClick={() => step(1)}>
                  Next
                </button>
              </>
            ) : null}
            <button ref={closeRef} type="button" className="min-h-11 bg-plaster px-4 text-sm text-ink" onClick={close}>
              Close
            </button>
          </div>
        </div>
        <p className="sr-only">Use the arrow keys to browse and Escape to close. Swipe sideways on a touch screen.</p>
      </div>
    </div>
  );
}
