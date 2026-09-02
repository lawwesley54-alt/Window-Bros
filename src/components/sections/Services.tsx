import { services } from "../../config/site";
import { images } from "../../config/images";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { Img } from "../ui/Img";

export function Services() {
  return (
    <section id="services" className="section-pad bg-white">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Our Services"
          title="What We Clean"
          subtitle="Simple, professional window cleaning for your home."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const image = images[service.imageKey];
            return (
              <Reveal key={service.key} delay={i * 80} className="card group flex flex-col overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden bg-bg-muted">
                  <Img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <h3 className="text-h4 text-ink">{service.name}</h3>
                  <p className="text-small flex-1">{service.description}</p>
                  <a
                    href="#quote"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-dark"
                  >
                    Learn More
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
