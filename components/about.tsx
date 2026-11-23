import { ButtonLink } from "@/components/button-link";
import { ClickableImage } from "@/components/clickable-image";
import { Eyebrow } from "@/components/eyebrow";
import { Reveal } from "@/components/reveal";

export function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-cream px-5 pt-24 pb-12 md:px-8 md:pt-32 md:pb-16">
      <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="relative lg:col-span-6">
          <ClickableImage
            src="/images/about.jpg"
            alt="Contemporary living room with warm wood-look flooring, a grey sectional, and a textured rug"
            sizes="(min-width: 1024px) 46vw, 100vw"
            caption="Interior inspiration"
            parallax
            className="aspect-[4/5] w-full bg-sand"
          />
          <p className="mt-4 text-xs tracking-[0.2em] text-stone uppercase">
            Interior inspiration, not a verified installation
          </p>
        </Reveal>

        <div className="lg:col-span-5 lg:col-start-8">
          <Reveal>
            <Eyebrow>About us</Eyebrow>
            <h2 className="mt-4 font-display text-5xl leading-[0.95] text-ink md:text-7xl">
              Beautiful Floors. Better Living.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 space-y-5 text-base leading-7 text-ink/80">
              <p>
                The floor is the largest surface in a room. Choosing it carefully changes how a space looks, how comfortable it feels, and how well it works every day.
              </p>
              <p>
                Carpet One Of Livermore focuses on two flooring categories: Bioplanks flooring and carpet tile flooring. Both offer attractive designs and a variety of looks for different interior styles.
              </p>
              <p>
                Whether you are shaping a home or a commercial interior, you can compare finishes, patterns, and arrangements before you decide.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-8">
              <ButtonLink href="/#flooring">Explore Our Flooring</ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
