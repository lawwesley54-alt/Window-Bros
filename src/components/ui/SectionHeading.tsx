import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <Reveal className={`flex flex-col gap-3 ${alignClass}`}>
      {eyebrow && (
        <span className={`text-eyebrow ${light ? "text-accent-light" : ""}`}>{eyebrow}</span>
      )}
      <h2 className={`text-h2 max-w-2xl ${light ? "text-white" : "text-ink"}`}>{title}</h2>
      {subtitle && (
        <p className={`text-body-lg max-w-xl ${light ? "text-white/75" : ""}`}>{subtitle}</p>
      )}
    </Reveal>
  );
}
