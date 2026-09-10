import { owner } from "../../config/site";
import { images } from "../../config/images";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { Img } from "../ui/Img";

const facts = [
  { label: owner.school },
  { label: `${owner.experience} Washing Windows` },
  { label: "Satisfaction Guaranteed" },
];

export function About() {
  return (
    <section id="about" className="section-pad border-t border-line bg-bg-subtle">
      <Container>
        <div className="grid items-start gap-8 lg:grid-cols-[auto_1fr] lg:gap-12">
          <Reveal className="flex flex-col items-center gap-3 lg:items-start">
            <Img
              src={images.owner.src}
              alt={images.owner.alt}
              className="w-56 sm:w-64"
              loading="lazy"
            />
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
