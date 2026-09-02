import { howItWorks } from "../../config/site";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-pad bg-bg-subtle">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Simple Process"
          title="How It Works"
          subtitle="From quote to clean windows in three easy steps."
        />

        <div className="relative grid gap-8 sm:grid-cols-3 sm:gap-6">
          <div
            className="absolute top-6 right-[16.5%] left-[16.5%] hidden h-px bg-line sm:block"
            aria-hidden="true"
          />
          {howItWorks.map((step, i) => (
            <Reveal key={step.step} delay={i * 100} className="relative flex flex-col items-center gap-4 text-center">
              <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
                {step.step}
              </span>
              <h3 className="text-h4 text-ink">{step.title}</h3>
              <p className="text-small max-w-[220px]">{step.description}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="flex justify-center pt-2">
          <a href="#quote" className="btn-primary !px-8">
            Get My Free Quote
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
