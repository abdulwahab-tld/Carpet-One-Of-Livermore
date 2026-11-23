"use client";

import { useRef, type ReactNode } from "react";
import { canHoverFine, gsap, useGSAP } from "@/components/gsap-setup";

export function LiftCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP((_, contextSafe) => {
    const track = contextSafe ?? ((callback: () => void) => callback);
    const card = ref.current;
    if (!card || !canHoverFine()) return;

    const y = gsap.quickTo(card, "y", { duration: 0.4, ease: "power2.out" });
    const enter = track(() => {
      y(-4);
      gsap.to(card, { boxShadow: "0 16px 36px rgba(28, 25, 22, 0.12)", duration: 0.4, ease: "power2.out" });
    });
    const leave = track(() => {
      y(0);
      gsap.to(card, { boxShadow: "0 0 0 rgba(28, 25, 22, 0)", duration: 0.35, ease: "power2.out" });
    });
    card.addEventListener("mouseenter", enter);
    card.addEventListener("mouseleave", leave);
    return () => {
      card.removeEventListener("mouseenter", enter);
      card.removeEventListener("mouseleave", leave);
    };
  }, { scope: ref });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
