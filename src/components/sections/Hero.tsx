import { images } from "../../config/images";
import { Img } from "../ui/Img";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <Img
          src={images.hero.src}
          alt={images.hero.alt}
          className="h-full w-full object-cover opacity-70"
          style={{ objectPosition: images.hero.position }}
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent" />
      </div>

      <Container className="relative flex min-h-[86vh] flex-col justify-end gap-8 py-16 sm:min-h-[80vh] sm:py-20 lg:min-h-[88vh] lg:justify-center lg:py-32">
        <Reveal className="flex max-w-2xl flex-col gap-6">
          <span className="text-eyebrow text-accent-light">Residential Window Cleaning</span>
          <h1 className="text-h1 text-white">Crystal-Clear Windows. Zero Hassle.</h1>
          <p className="max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">
            I provide professional window cleaning for homeowners who want cleaner windows
            without the hassle.
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <a href="#quote" className="btn-primary justify-center !px-8 !text-base">
              Get My Free Quote
            </a>
            <a href="#services" className="btn-ghost-light justify-center !px-8 !text-base">
              See My Services
            </a>
          </div>

          <p className="pt-2 text-sm font-medium tracking-wide text-white/60">
            Local &bull; Reliable &bull; Satisfaction Focused
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
