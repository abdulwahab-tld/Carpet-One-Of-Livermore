"use client";

import Image from "next/image";
import { useRef } from "react";
import { ButtonLink } from "@/components/button-link";
import { gsap, prefersReducedMotion, useGSAP } from "@/components/gsap-setup";

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    timeline
      .fromTo("[data-hero-media]", { scale: 1.08 }, { scale: 1, duration: 1.7 })
      .fromTo(
        "[data-hero-copy] > *",
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 },
        0.15,
      );

    // Continuous scrub can cause motion sickness — skip only this when reduced.
    if (prefersReducedMotion()) return;

    gsap.fromTo(
      "[data-hero-media]",
      { yPercent: 0 },
      {
        yPercent: 10,
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  }, { scope: rootRef });

  return (
    <section id="top" ref={rootRef} className="relative isolate min-h-[calc(100svh-5rem)] overflow-hidden bg-ink">
      <div data-hero-media="" className="absolute -top-[10%] h-[120%] w-full">
        <Image
          src="/images/hero.jpg"
          alt="Open living room with pale wood-look flooring, a floating stair, and a neutral sectional"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/55 to-ink/20" />

      <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl items-end px-5 pt-24 pb-16 md:px-8 md:pb-20">
        <div data-hero-copy="" className="max-w-3xl">
          <p className="text-xs tracking-[0.32em] text-brass uppercase">Flooring in Livermore</p>
          <p className="mt-5 font-display text-4xl text-plaster md:text-6xl">Living Floors</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.05] text-plaster md:text-6xl">
            Transform Your Space with Beautiful Flooring Solutions
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-plaster/85 md:text-lg">
            Discover beautiful flooring solutions with Bioplanks and Carpet Tile from Living Floors. Explore stylish flooring options designed to enhance the appearance, comfort, and character of your space.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/#flooring" variant="light">
              Explore Our Flooring
            </ButtonLink>
            <ButtonLink href="/#contact" variant="outline">
              Request a Free Estimate
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
