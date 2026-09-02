import { business } from "../../config/site";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";

export function FinalCTA() {
  return (
    <section className="section-pad bg-accent">
      <Container className="flex flex-col items-center gap-6 text-center">
        <Reveal className="flex flex-col items-center gap-6">
          <h2 className="text-h2 max-w-xl text-white">Ready for Cleaner Windows?</h2>
          <p className="max-w-md text-body-lg text-white/85">
            Get a free quote from Window Bros today.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#quote" className="btn bg-white !px-8 !text-base text-accent hover:bg-white/90">
              Get My Free Quote
            </a>
            <a href={business.phoneHref} className="btn-ghost-light !px-8 !text-base">
              Call {business.phone}
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
