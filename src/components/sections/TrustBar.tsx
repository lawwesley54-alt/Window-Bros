import { trustPoints } from "../../config/site";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-accent">
      <path
        d="M20 6.5L9 17.5l-5-5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrustBar() {
  return (
    <section className="border-b border-line bg-bg-subtle" aria-label="Why homeowners trust Window Bros">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-5 py-8 sm:grid-cols-4 sm:py-10">
        {trustPoints.map((point, i) => (
          <Reveal
            key={point.label}
            delay={i * 60}
            className="flex items-center gap-2.5 text-sm font-semibold text-ink sm:justify-center"
          >
            <CheckIcon />
            <span>{point.label}</span>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
