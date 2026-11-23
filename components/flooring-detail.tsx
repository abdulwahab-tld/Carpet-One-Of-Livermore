import Link from "next/link";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/button-link";
import { ClickableImage } from "@/components/clickable-image";
import { Eyebrow } from "@/components/eyebrow";
import type { LightboxImage } from "@/components/image-lightbox";
import { Reveal } from "@/components/reveal";
import { business } from "@/lib/site";

type DetailImage = {
  src: string;
  alt: string;
};

type FlooringDetailProps = {
  eyebrow: string;
  title: string;
  lede: string;
  paragraphs: string[];
  points: string[];
  image: DetailImage;
  secondary?: DetailImage;
  photos?: DetailImage[];
  tone: "warm" | "ink";
};

export function FlooringDetail({
  eyebrow,
  title,
  lede,
  paragraphs,
  points,
  image,
  secondary,
  photos,
  tone,
}: FlooringDetailProps) {
  const dark = tone === "ink";
  const slides: LightboxImage[] = (photos ?? [image, ...(secondary ? [secondary] : [])]).map((item) => ({
    src: item.src,
    alt: item.alt,
    caption: eyebrow,
  }));

  return (
    <>
      <section className={`relative min-h-[70vh] overflow-hidden ${dark ? "bg-ink" : "bg-sand"}`}>
        <ClickableImage
          src={image.src}
          alt={image.alt}
          images={slides}
          index={0}
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
        >
          <span className={`pointer-events-none absolute inset-0 ${dark ? "bg-ink/60" : "bg-ink/45"}`} />
        </ClickableImage>
        <div className="pointer-events-none relative z-10 mx-auto flex min-h-[70vh] max-w-7xl items-end px-5 py-16 md:px-8">
          <Reveal>
            <div className="max-w-3xl text-plaster">
              <Eyebrow light>{eyebrow}</Eyebrow>
              <h1 className="mt-4 font-display text-5xl leading-none md:text-7xl">{title}</h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-plaster/85">{lede}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={dark ? "bg-ink text-plaster" : "bg-cream text-ink"}>
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 lg:grid-cols-2 lg:items-center">
          <div className={dark ? "lg:order-2" : undefined}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-base leading-7 first:mt-0 opacity-80">
                {paragraph}
              </p>
            ))}
            <ul className="mt-8 space-y-4">
              {points.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-6">
                  <span className="mt-2 h-px w-6 shrink-0 bg-brass" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/#contact" variant={dark ? "light" : "solid"}>
                Request a Free Estimate
              </ButtonLink>
              <ButtonLink href={`tel:${business.phoneTel}`} variant={dark ? "outline" : "outlineDark"}>
                Call {business.phoneDisplay}
              </ButtonLink>
            </div>
            <Link href="/#flooring" className="mt-6 inline-block text-sm underline-offset-4 hover:underline">
              Back to flooring
            </Link>
          </div>
          {secondary ? (
            <ClickableImage
              src={secondary.src}
              alt={secondary.alt}
              images={slides}
              index={Math.max(slides.findIndex((slide) => slide.src === secondary.src), 0)}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className={`aspect-[4/5] w-full ${dark ? "lg:order-1" : ""}`}
            />
          ) : (
            <Note>{eyebrow} styles can be compared in person. Ask what is currently available to view.</Note>
          )}
        </div>
      </section>
    </>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-end border border-current/15 p-8">
      <p className="font-display text-4xl leading-tight">{children}</p>
    </div>
  );
}
