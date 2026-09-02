import { reviews } from "../../config/site";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < rating ? "var(--color-gold)" : "none"}
          stroke={i < rating ? "var(--color-gold)" : "var(--color-line)"}
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M12 2l2.9 6.4 6.8.6-5.2 4.7 1.6 6.8L12 16.9 5.9 20.5l1.6-6.8-5.2-4.7 6.8-.6L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function Reviews() {
  return (
    <section id="reviews" className="section-pad bg-white">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Customer Reviews"
          title="What Homeowners Are Saying"
          subtitle="Real feedback from Window Bros customers."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal
              key={`${review.name}-${i}`}
              delay={i * 80}
              className="card flex flex-col gap-4 p-7"
            >
              <Stars rating={review.rating} />
              <p className="text-body italic">&ldquo;{review.text}&rdquo;</p>
              <div className="mt-auto flex items-center gap-3 pt-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                  {review.name.replace(/[[\]]/g, "").charAt(0) || "?"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{review.name}</p>
                  <p className="text-xs text-ink-faint">{review.location}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
