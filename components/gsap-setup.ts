"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { TweenTarget, TweenVars } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function canHoverFine() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

// quickTo() cannot reset the scale shorthand. It warns and leaves the zoom at 1.
export function quickScale(target: TweenTarget, vars?: TweenVars) {
  const options = { duration: 0.8, ease: "power2.out", ...vars };
  const scaleX = gsap.quickTo(target, "scaleX", options);
  const scaleY = gsap.quickTo(target, "scaleY", options);
  return (value: number) => {
    scaleX(value);
    scaleY(value);
  };
}

export { gsap, ScrollTrigger, useGSAP };
