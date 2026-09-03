import { owner } from "../../config/site";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

const facts = [
  { label: owner.school },
  { label: `${owner.experience} Washing Windows` },
  { label: "Satisfaction Guaranteed" },
];

export function About() {
  const initials = owner.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <section id="about" className="section-pad border-t border-line bg-bg-subtle">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[auto_1fr]">
          <Reveal className="flex flex-col items-center gap-4 lg:items-start">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-accent-soft text-2xl font-bold text-accent">
              {initials}
            </div>
            <div className="text-center lg:text-left">
              <p className="text-h4 text-ink">{owner.name}</p>
              <p className="text-small">Owner, Window Bros</p>
            </div>
          </Reveal>

          <div className="flex flex-col gap-6">
            <SectionHeading align="left" eyebrow="About Us" title="Meet Wesley" />

            <Reveal delay={80} className="flex flex-col gap-4">
              {owner.bio.map((paragraph) => (
                <p key={paragraph} className="text-body">
                  {paragraph}
                </p>
              ))}
            </Reveal>

            <Reveal delay={140} className="flex flex-wrap gap-3 pt-2">
              {facts.map((fact) => (
                <span
                  key={fact.label}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
                >
                  {fact.label}
                </span>
              ))}
            </Reveal>

            <Reveal delay={200} className="pt-2">
              <a href="#quote" className="btn-primary">
                Get My Free Quote
              </a>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
