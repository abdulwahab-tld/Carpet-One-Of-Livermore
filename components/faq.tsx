"use client";

import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "@/components/eyebrow";
import { gsap, useGSAP } from "@/components/gsap-setup";
import { Reveal } from "@/components/reveal";
import { faqs } from "@/lib/content";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faqs" className="scroll-mt-24 bg-cream px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <Eyebrow>FAQs</Eyebrow>
          <h2 className="mt-4 font-display text-5xl leading-none md:text-6xl">
            Questions, answered simply.
          </h2>
          <p className="mt-5 text-sm leading-6 text-ink/70">
            Answers describe the flooring categories offered by Living Floors. For availability, call or send an estimate request.
          </p>
        </Reveal>
        <div className="lg:col-span-7 lg:col-start-6">
          {faqs.map((item, index) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              index={index}
              open={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({
  question,
  answer,
  index,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const [rendered, setRendered] = useState(open);
  const panelRef = useRef<HTMLDivElement>(null);
  const skipIntro = useRef(open);
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  useEffect(() => {
    if (open) setRendered(true);
  }, [open]);

  useGSAP(() => {
    const panel = panelRef.current;
    if (!panel || !rendered) return;
    if (skipIntro.current) {
      skipIntro.current = false;
      gsap.set(panel, { height: "auto", autoAlpha: 1, clearProps: "overflow" });
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (open) {
      if (reduce) {
        gsap.set(panel, { height: "auto", autoAlpha: 1 });
        return;
      }
      gsap.fromTo(
        panel,
        { height: 0, autoAlpha: 0 },
        { height: "auto", autoAlpha: 1, duration: 0.35, ease: "power2.out" },
      );
      return;
    }
    if (reduce) {
      setRendered(false);
      return;
    }
    gsap.to(panel, {
      height: 0,
      autoAlpha: 0,
      duration: 0.28,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(panel, { clearProps: "height,opacity,visibility" });
        setRendered(false);
      },
    });
  }, { dependencies: [open, rendered] });

  return (
    <div className="border-b border-ink/10">
      <h3>
        <button
          id={buttonId}
          type="button"
          className="flex w-full items-center justify-between gap-6 py-5 text-left"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className="font-display text-2xl leading-snug md:text-3xl">{question}</span>
          <span className="text-brass-deep" aria-hidden="true">
            {open ? "–" : "+"}
          </span>
        </button>
      </h3>
      {rendered ? (
        <div id={panelId} ref={panelRef} role="region" aria-labelledby={buttonId} className="overflow-hidden">
          <p className="pb-5 text-sm leading-6 text-ink/75">{answer}</p>
        </div>
      ) : null}
    </div>
  );
}
