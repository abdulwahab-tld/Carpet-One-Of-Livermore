import { ClickableImage } from "@/components/clickable-image";
import { Eyebrow } from "@/components/eyebrow";
import { Reveal } from "@/components/reveal";
import type { LightboxImage } from "@/components/image-lightbox";

const bioplanks = [
  "Modern and attractive flooring appearance.",
  "Available in different design styles and finishes.",
  "Helps complement contemporary interior designs.",
];

const carpetTile = [
  "Available in different patterns and designs.",
  "Offers creative flooring arrangement possibilities.",
  "Suitable for a variety of interior environments.",
];

const benefitImages: LightboxImage[] = [
  {
    src: "/images/benefits-bioplanks.jpg",
    alt: "Attic bedroom with warm wood-look flooring and a sloped wood ceiling",
    caption: "Bioplanks flooring",
  },
  {
    src: "/images/benefits-carpet.jpg",
    alt: "Commercial meeting room with carpet visible around a conference table",
    caption: "Carpet tile flooring",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="scroll-mt-24 bg-plaster">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <Reveal className="bg-cream px-5 py-20 md:px-12">
          <Eyebrow>Bioplanks flooring</Eyebrow>
          <h2 className="mt-4 font-display text-5xl leading-none">Wood-inspired, room by room.</h2>
          <ClickableImage
            src={benefitImages[0].src}
            alt={benefitImages[0].alt}
            caption={benefitImages[0].caption}
            images={benefitImages}
            index={0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="mt-8 aspect-[16/10] w-full"
          />
          <ul className="mt-8 space-y-4">
            {bioplanks.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-ink/80">
                <span className="mt-2 h-px w-6 shrink-0 bg-brass" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.12} className="bg-ink px-5 py-20 text-plaster md:px-12">
          <Eyebrow light>Carpet tile flooring</Eyebrow>
          <h2 className="mt-4 font-display text-5xl leading-none">Pattern, texture, and arrangement.</h2>
          <ClickableImage
            src={benefitImages[1].src}
            alt={benefitImages[1].alt}
            caption={benefitImages[1].caption}
            images={benefitImages}
            index={1}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="mt-8 aspect-[16/10] w-full"
          />
          <ul className="mt-8 space-y-4">
            {carpetTile.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-plaster/80">
                <span className="mt-2 h-px w-6 shrink-0 bg-brass" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
