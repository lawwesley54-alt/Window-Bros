import { images } from "../../config/images";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";
import { Img } from "../ui/Img";

export function PhotoBreak() {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <Img
        src={images.cta.src}
        alt={images.cta.alt}
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />

      <Container className="relative flex min-h-[50vh] flex-col items-center justify-center gap-6 py-24 text-center">
        <Reveal className="flex flex-col items-center gap-6">
          <h2 className="text-h2 max-w-2xl text-white">Clearer Windows. Better Views.</h2>
          <a href="#quote" className="btn-primary !px-8 !text-base">
            Get a Free Quote
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
