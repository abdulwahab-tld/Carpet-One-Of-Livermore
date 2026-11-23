import { Eyebrow } from "@/components/eyebrow";
import { Reveal } from "@/components/reveal";

export function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-24 bg-sand px-5 py-24 md:px-8">
      <Reveal className="mx-auto max-w-3xl text-center">
        <Eyebrow>Testimonials</Eyebrow>
        <h2 className="mt-4 font-display text-5xl leading-none md:text-6xl">
          Customer testimonials coming soon.
        </h2>
        <p className="mt-6 text-base leading-7 text-ink/75">
          Genuine customer feedback will appear here when it is available. This space is a placeholder, not a review.
        </p>
      </Reveal>
    </section>
  );
}
