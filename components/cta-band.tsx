"use client";

import Image from "next/image";
import { useRef } from "react";
import { ButtonLink } from "@/components/button-link";
import { gsap, useGSAP } from "@/components/gsap-setup";
import { business } from "@/lib/site";

export function CtaBand() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo("[data-cta-media]", { yPercent: -6 }, {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.from("[data-cta-copy] > *", {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 75%",
          once: true,
        },
      });
    });
    return () => motion.revert();
  }, { scope: rootRef });

  return (
    <section ref={rootRef} className="relative isolate overflow-hidden bg-ink">
      <div data-cta-media="" className="absolute -top-[8%] h-[116%] w-full">
        <Image
          src="/images/cta.jpg"
          alt="Sunlit living room with wood-look flooring, a leather sofa, and a large area rug"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-ink/65" />
      <div data-cta-copy="" className="relative mx-auto max-w-4xl px-5 py-28 text-center text-plaster md:py-36">
        <h2 className="font-display text-5xl leading-none md:text-7xl">
          Ready to Give Your Space a Beautiful New Look?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-plaster/85">
          Explore Bioplanks and Carpet Tile flooring options at Carpet One Of Livermore. Find attractive flooring styles to complement your space.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/#flooring" variant="light">
            Explore Flooring
          </ButtonLink>
          <ButtonLink href={`tel:${business.phoneTel}`} variant="outline">
            Call Us Today
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
