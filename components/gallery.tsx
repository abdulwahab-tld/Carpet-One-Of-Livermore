"use client";

import { useRef } from "react";
import { ClickableImage } from "@/components/clickable-image";
import { Eyebrow } from "@/components/eyebrow";
import { gsap, useGSAP } from "@/components/gsap-setup";
import { Reveal } from "@/components/reveal";
import { galleryItems } from "@/lib/content";

export function Gallery() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-gallery-item]", {
        autoAlpha: 0,
        y: 32,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-gallery-grid]",
          start: "top 82%",
          once: true,
        },
      });
    });
    return () => motion.revert();
  }, { scope: rootRef });

  return (
    <section id="gallery" ref={rootRef} className="scroll-mt-24 bg-cream px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow>Gallery</Eyebrow>
            <h2 className="mt-4 font-display text-5xl leading-none md:text-6xl">Flooring inspiration</h2>
            <p className="mt-5 text-base leading-7 text-ink/75">
              A mix of wood-look interiors, carpet tile patterns, living rooms, and commercial spaces. These are representative photographs, not verified Carpet One Of Livermore installations.
            </p>
          </div>
        </Reveal>

        <div data-gallery-grid="" className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, itemIndex) => (
            <ClickableImage
              key={item.src}
              src={item.src}
              alt={item.alt}
              caption={item.caption}
              images={galleryItems}
              index={itemIndex}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="aspect-[4/3] w-full bg-sand"
              showViewCue={false}
              staggerItem
            >
              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-ink/80 via-ink/35 to-transparent px-4 pt-16 pb-4 text-[0.68rem] tracking-[0.16em] text-plaster uppercase">
                {item.caption}
                <span className="shrink-0">View</span>
              </span>
            </ClickableImage>
          ))}
        </div>
      </div>
    </section>
  );
}
