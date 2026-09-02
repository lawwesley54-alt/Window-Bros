import { useRef, useState, type MouseEvent, type TouchEvent } from "react";
import { images } from "../../config/images";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { Img } from "../ui/Img";

/**
 * Draggable before/after slider. Uses the client-confirmed before/after
 * photo pair of the same window.
 */
export function BeforeAfter() {
  const [position, setPosition] = useState(50);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  };

  return (
    <section className="section-pad bg-bg-subtle">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="See The Difference"
          title="Before &amp; After"
          subtitle="Drag the slider to compare."
        />

        <Reveal
          ref={trackRef as never}
          className="relative mx-auto aspect-[16/10] w-full max-w-3xl touch-none select-none overflow-hidden rounded-3xl bg-bg-muted shadow-lift"
          onMouseDown={(e: MouseEvent) => {
            dragging.current = true;
            setFromClientX(e.clientX);
          }}
          onMouseMove={(e: MouseEvent) => {
            if (dragging.current) setFromClientX(e.clientX);
          }}
          onMouseUp={() => (dragging.current = false)}
          onMouseLeave={() => (dragging.current = false)}
          onTouchStart={(e: TouchEvent) => setFromClientX(e.touches[0].clientX)}
          onTouchMove={(e: TouchEvent) => setFromClientX(e.touches[0].clientX)}
        >
          <div className="absolute inset-0">
            <Img
              src={images.beforeAfterAfter.src}
              alt={images.beforeAfterAfter.alt}
              className="h-full w-full object-cover"
            />
            <span className="absolute right-4 top-4 rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold text-white">
              After
            </span>
          </div>

          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <Img
              src={images.beforeAfterBefore.src}
              alt={images.beforeAfterBefore.alt}
              className="h-full w-full object-cover"
            />
            <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold text-white">
              Before
            </span>
          </div>

          <div
            className="absolute inset-y-0 z-10 flex w-0.5 -translate-x-1/2 items-center justify-center bg-white"
            style={{ left: `${position}%` }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lift">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M8 6L2 12l6 6M16 6l6 6-6 6"
                  stroke="var(--color-ink)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            aria-label="Before and after comparison slider"
            className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
          />
        </Reveal>
      </Container>
    </section>
  );
}
