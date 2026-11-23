"use client";

import type { RefObject } from "react";
import { canHoverFine, gsap, useGSAP } from "@/components/gsap-setup";

export function useHoverLift<T extends HTMLElement>(
  ref: RefObject<T | null>,
  distance = -3,
) {
  useGSAP(() => {
    const el = ref.current;
    if (!el || !canHoverFine()) return;

    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power2.out" });
    const enter = () => y(distance);
    const leave = () => y(0);
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, { dependencies: [distance], revertOnUpdate: true });
}
