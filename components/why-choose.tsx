import { Eyebrow } from "@/components/eyebrow";
import { LiftCard } from "@/components/lift-card";
import { Reveal } from "@/components/reveal";
import { whyPoints } from "@/lib/content";

const icons = [
  "M4 18h16M7 18V9h10v9M4 9l8-5 8 5",
  "M5 5h6v6H5V5Zm8 0h6v6h-6V5ZM5 15h6v4H5v-4Zm8 0h6v4h-6v-4Z",
  "M4 20V10l8-6 8 6v10H4Zm5 0v-6h6v6",
  "M8 19v-1.2c0-1.8 1.4-3 3.2-3s3.2 1.2 3.2 3V19M11.2 11.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Zm6.2 7.8v-.8c0-1.2.8-2.2 2-2.4M17.2 11a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z",
];

export function WhyChoose() {
  return (
    <section id="why" className="scroll-mt-24 bg-walnut text-plaster">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-28">
        <Reveal>
          <Eyebrow light>Why explore here</Eyebrow>
          <h2 className="mt-4 max-w-xl font-display text-5xl leading-none md:text-6xl">
            A clearer way to compare flooring.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {whyPoints.map((point, index) => (
            <Reveal key={point.number} delay={index * 0.08}>
              <LiftCard className="border-t border-plaster/20 pt-6">
                <div className="flex items-center justify-between">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-brass" strokeWidth="1.4" aria-hidden="true">
                    <path d={icons[index]} />
                  </svg>
                  <span className="font-display text-3xl text-brass">{point.number}</span>
                </div>
                <h3 className="mt-6 font-display text-3xl leading-tight">{point.title}</h3>
                <p className="mt-3 text-sm leading-6 text-plaster/75">{point.text}</p>
              </LiftCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
