"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/components/gsap-setup";

export default function Template({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(ref.current, {
        autoAlpha: 0,
        y: 16,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => ScrollTrigger.refresh(),
      });
    });
    return () => motion.revert();
  }, { scope: ref });

  return <div ref={ref}>{children}</div>;
}
