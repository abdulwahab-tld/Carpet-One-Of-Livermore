"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/components/gsap-setup";

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

    // Only translate — never pre-hide with autoAlpha. Opacity 0 on tall
    // sections leaves empty page-colored holes that look like broken layout.
    gsap.fromTo(
      el,
      { y: 36 },
      {
        y: 0,
        duration: 0.85,
        delay,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
          immediateRender: false,
        },
      },
    );

    ScrollTrigger.refresh();
  }, { scope: ref, dependencies: [delay], revertOnUpdate: true });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
