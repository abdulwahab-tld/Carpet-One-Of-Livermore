"use client";

import Link from "next/link";
import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { useHoverLift } from "@/components/use-hover-lift";

const variants = {
  solid: "bg-ink text-plaster hover:bg-walnut",
  light: "bg-plaster text-ink hover:bg-cream",
  outline: "border border-plaster/80 text-plaster hover:bg-plaster hover:text-ink",
  outlineDark: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-plaster",
} as const;

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  external?: boolean;
};

export function ButtonLink({
  href,
  children,
  variant = "solid",
  className = "",
  external = false,
}: ButtonLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  useHoverLift(ref);
  const classNames = `inline-flex min-h-12 items-center justify-center px-6 text-sm tracking-wide transition-colors duration-300 ${variants[variant]} ${className}`;
  const isExternal =
    external || href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http");

  if (isExternal) {
    return (
      <a
        ref={ref}
        href={href}
        className={classNames}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link ref={ref} href={href} className={classNames}>
      {children}
    </Link>
  );
}

export function MotionButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLButtonElement>(null);
  useHoverLift(ref);
  return <button ref={ref} className={className} {...props} />;
}
