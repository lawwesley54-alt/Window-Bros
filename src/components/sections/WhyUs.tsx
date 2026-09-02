import type { ReactNode } from "react";
import { whyPoints } from "../../config/site";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

const icons: Record<string, ReactNode> = {
  Easy: (
    <path d="M4 12h16M4 6h16M4 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  ),
  Careful: (
    <path
      d="M12 21s-7-4.5-9-9.5C1.5 7.5 4 4 7.5 4 9.5 4 11 5 12 6.5 13 5 14.5 4 16.5 4 20 4 22.5 7.5 21 11.5 19 16.5 12 21 12 21z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
  Reliable: (
    <path
      d="M12 8v4l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "Quality Focused": (
    <path
      d="M12 2l2.6 6.2 6.7.5-5.1 4.4 1.6 6.5L12 16.3 6.2 19.6l1.6-6.5-5.1-4.4 6.7-.5L12 2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
};

export function WhyUs() {
  return (
    <section className="section-pad bg-white">
      <Container className="flex flex-col gap-12">
        <SectionHeading title="Why Homeowners Choose Window Bros" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyPoints.map((point, i) => (
            <Reveal key={point.title} delay={i * 80} className="flex flex-col gap-4 rounded-2xl border border-line p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  {icons[point.title]}
                </svg>
              </div>
              <h3 className="text-h4 text-ink">{point.title}</h3>
              <p className="text-small">{point.description}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
