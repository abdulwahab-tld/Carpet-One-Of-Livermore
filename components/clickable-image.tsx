"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { canHoverFine, gsap, prefersReducedMotion, quickScale, useGSAP } from "@/components/gsap-setup";
import { useLightbox, type LightboxImage } from "@/components/image-lightbox";

type ClickableImageProps = {
  src: string;
  alt: string;
  sizes: string;
  images?: readonly LightboxImage[];
  index?: number;
  caption?: string;
  priority?: boolean;
  parallax?: boolean;
  showViewCue?: boolean;
  className?: string;
  imageClassName?: string;
  staggerItem?: boolean;
  children?: ReactNode;
};

export function ClickableImage({
  src,
  alt,
  sizes,
  images,
  index = 0,
  caption,
  priority = false,
  parallax = false,
  showViewCue = true,
  className = "",
  imageClassName = "",
  staggerItem = false,
  children,
}: ClickableImageProps) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const { open } = useLightbox();
  const slides = images ?? [{ src, alt, caption }];

  useGSAP((_, contextSafe) => {
    const track = contextSafe ?? ((callback: () => void) => callback);
    const root = rootRef.current;
    const img = root?.querySelector("img");
    if (!root || !img) return;
    const cue = root.querySelector("[data-view-cue]");
    const cleanups: Array<() => void> = [];

    if (parallax && !prefersReducedMotion()) {
      gsap.set(img, { scaleX: 1.12, scaleY: 1.12 });
      gsap.fromTo(img, { yPercent: -6 }, {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    if (canHoverFine()) {
      const base = parallax && !prefersReducedMotion() ? 1.12 : 1;
      const scale = quickScale(img, { duration: 0.8, ease: "power2.out" });
      const x = gsap.quickTo(img, "x", { duration: 0.7, ease: "power2.out" });
      const y = gsap.quickTo(img, "y", { duration: 0.7, ease: "power2.out" });
      if (cue) gsap.set(cue, { autoAlpha: 0, y: 8 });

      const enter = track(() => {
        scale(base + 0.06);
        if (cue) gsap.to(cue, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" });
      });
      const leave = track(() => {
        scale(base);
        if (!(parallax && !prefersReducedMotion())) {
          x(0);
          y(0);
        }
        if (cue) gsap.to(cue, { autoAlpha: 0, y: 8, duration: 0.25, ease: "power2.in" });
      });
      const move = (event: PointerEvent) => {
        if (parallax && !prefersReducedMotion()) return;
        const rect = root.getBoundingClientRect();
        const dx = (event.clientX - rect.left) / rect.width - 0.5;
        const dy = (event.clientY - rect.top) / rect.height - 0.5;
        x(dx * -14);
        y(dy * -10);
      };

      root.addEventListener("mouseenter", enter);
      root.addEventListener("mouseleave", leave);
      root.addEventListener("pointermove", move);
      cleanups.push(() => {
        root.removeEventListener("mouseenter", enter);
        root.removeEventListener("mouseleave", leave);
        root.removeEventListener("pointermove", move);
      });
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  }, { scope: rootRef, dependencies: [parallax, src], revertOnUpdate: true });

  return (
    <button
      ref={rootRef}
      type="button"
      data-gallery-item={staggerItem ? "" : undefined}
      className={`relative block overflow-hidden text-left ${className}`}
      onClick={() => open(slides, index)}
      aria-label={`View larger photo: ${alt}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover ${imageClassName}`}
      />
      {children}
      {showViewCue ? (
        <span
          data-view-cue=""
          aria-hidden="true"
          className="pointer-events-none absolute top-4 left-4 z-10 border border-plaster/50 bg-ink/55 px-3 py-1 text-[0.68rem] tracking-[0.18em] text-plaster uppercase opacity-0 [@media(hover:none)]:opacity-100"
        >
          View
        </span>
      ) : null}
    </button>
  );
}
