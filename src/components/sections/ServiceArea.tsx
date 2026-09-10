import { business } from "../../config/site";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

export function ServiceArea() {
  return (
    <section className="section-pad bg-bg-subtle">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <SectionHeading
            align="left"
            eyebrow="Where I Work"
            title="Proudly Serving Local Homeowners"
            subtitle={
              business.primaryCity === business.serviceArea
                ? `I proudly serve homeowners in ${business.primaryCity}.`
                : `I'm based in ${business.primaryCity} and serve homeowners throughout ${business.serviceArea}.`
            }
          />

          <Reveal delay={100} className="card flex flex-col gap-5 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 21s7-6.2 7-11.5A7 7 0 105 9.5C5 14.8 12 21 12 21z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-faint">Based In</p>
                <p className="text-h4 text-ink">{business.primaryCity}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M4 12l6 6L20 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-faint">Service Area</p>
                <p className="text-h4 text-ink">{business.serviceArea}</p>
              </div>
            </div>

            <a href="#quote" className="btn-primary mt-2 justify-center">
              Check If I Serve Your Area
            </a>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
