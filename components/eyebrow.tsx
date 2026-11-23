export function Eyebrow({
  children,
  light = false,
}: {
  children: string;
  light?: boolean;
}) {
  return (
    <p
      className={`text-xs font-medium tracking-[0.28em] uppercase ${light ? "text-brass" : "text-brass-deep"}`}
    >
      {children}
    </p>
  );
}
