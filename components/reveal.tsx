"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/components/gsap-setup";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(el, { autoAlpha: 1, y: 0 });
    });
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(el, {
        autoAlpha: 0,
        y: 28,
        duration: 0.85,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      });
    });
    return () => motion.revert();
  }, { scope: ref, dependencies: [delay] });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
