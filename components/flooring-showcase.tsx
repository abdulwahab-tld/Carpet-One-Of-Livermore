"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Eyebrow } from "@/components/eyebrow";
import { gsap, useGSAP } from "@/components/gsap-setup";
import { useLightbox, type LightboxImage } from "@/components/image-lightbox";
import { Reveal } from "@/components/reveal";

const services = [
  {
    href: "/flooring/bioplanks",
    title: "Stylish & Modern Bioplanks Flooring",
    text: "Discover Bioplanks flooring solutions that bring style and character to your interiors. Explore attractive designs and finishes to find flooring that complements your home or commercial space.",
    image: "/images/bioplanks-feature.jpg",
    alt: "Hallway with wide light wood-look planks and a walnut sideboard",
    label: "Bioplanks",
    className: "lg:col-span-7",
  },
  {
    href: "/flooring/carpet-tile",
    title: "Versatile & Stylish Carpet Tile Flooring",
    text: "Enhance your interiors with attractive carpet tile flooring. Explore different patterns, textures, and designs to create comfortable and visually appealing spaces for residential and commercial environments.",
    image: "/images/carpet-feature.jpg",
    alt: "Office lounge with geometric grey carpet tiles and leather seating",
    label: "Carpet tile",
    className: "lg:col-span-5",
  },
] as const;

const slides: LightboxImage[] = services.map((service) => ({
  src: service.image,
  alt: service.alt,
  caption: service.label,
}));

export function FlooringShowcase() {
  return (
    <section id="flooring" className="scroll-mt-24 bg-plaster px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <Eyebrow>Flooring</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-5xl leading-none md:text-6xl">
            Two flooring categories. Distinct ways to finish a room.
          </h2>
        </Reveal>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-12">
          {services.map((service, index) => (
            <Reveal key={service.href} delay={index * 0.12} className={`h-full ${service.className}`}>
              <FlooringCard index={index} service={service} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlooringCard({
  service,
  index,
}: {
  service: (typeof services)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const { open } = useLightbox();

  useGSAP(() => {
    const card = cardRef.current;
    const image = card?.querySelector("img");
    if (!card || !image) return;
    const shade = card.querySelector("[data-card-shade]");
    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
      const scale = gsap.quickTo(image, "scale", { duration: 0.8, ease: "power2.out" });
      const y = gsap.quickTo(card, "y", { duration: 0.45, ease: "power2.out" });
      const enter = () => {
        scale(1.06);
        y(-6);
        gsap.to(card, { boxShadow: "0 22px 50px rgba(28, 25, 22, 0.18)", duration: 0.45, ease: "power2.out" });
        if (shade) gsap.to(shade, { opacity: 0.72, duration: 0.45, ease: "power2.out" });
      };
      const leave = () => {
        scale(1);
        y(0);
        gsap.to(card, { boxShadow: "0 0 0 rgba(28, 25, 22, 0)", duration: 0.4, ease: "power2.out" });
        if (shade) gsap.to(shade, { opacity: 1, duration: 0.4, ease: "power2.out" });
      };
      card.addEventListener("mouseenter", enter);
      card.addEventListener("mouseleave", leave);
      return () => {
        card.removeEventListener("mouseenter", enter);
        card.removeEventListener("mouseleave", leave);
      };
    });
    return () => motion.revert();
  }, { scope: cardRef });

  return (
    <article ref={cardRef} className="group relative h-full min-h-[34rem] overflow-hidden bg-ink lg:min-h-[40rem]">
      <button
        type="button"
        className="absolute inset-0 z-0"
        aria-label={`View larger photo: ${service.alt}`}
        onClick={() => open(slides, index)}
      >
        <Image
          src={service.image}
          alt={service.alt}
          fill
          sizes={index === 0 ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 40vw, 100vw"}
          className="object-cover object-center"
        />
      </button>
      <div data-card-shade="" className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-ink via-ink/35 to-ink/10" />
      <div className="pointer-events-none relative z-10 flex h-full min-h-[34rem] flex-col justify-end p-7 text-plaster md:p-9 lg:min-h-[40rem]">
        <p className="text-xs tracking-[0.24em] text-brass uppercase">{service.label}</p>
        <h3 className="mt-3 max-w-md font-display text-4xl leading-tight md:text-5xl">{service.title}</h3>
        <p className="mt-4 max-w-md text-sm leading-6 text-plaster/85">{service.text}</p>
        <Link
          href={service.href}
          className="pointer-events-auto mt-6 inline-flex min-h-11 w-fit items-center border border-plaster/50 px-5 text-sm transition-colors duration-300 hover:bg-plaster hover:text-ink"
        >
          Learn More
        </Link>
      </div>
    </article>
  );
}
