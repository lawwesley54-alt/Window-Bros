import { business, nav } from "../../config/site";
import { Container } from "../ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
          <span className="text-lg font-bold tracking-tight">
            WINDOW <span className="text-accent-light">BROS</span>
          </span>
          <p className="text-sm leading-relaxed text-white/60">{business.tagline}</p>
          <div className="mt-2 flex gap-3">
            {[
              { label: "Facebook", href: business.social.facebook },
              { label: "Instagram", href: business.social.instagram },
              { label: "Google", href: business.social.google },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-xs text-white/70 transition-colors hover:border-white/40 hover:text-white"
                aria-label={`Window Bros on ${s.label} (placeholder link)`}
              >
                {s.label[0]}
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer">
          <h3 className="mb-4 text-sm font-semibold text-white/50">Menu</h3>
          <ul className="flex flex-col gap-3">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm text-white/75 hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-white/50">Contact</h3>
          <ul className="flex flex-col gap-3 text-sm text-white/75">
            <li>
              <a href={business.phoneHref} className="hover:text-white">
                {business.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${business.email}`} className="hover:text-white">
                {business.email}
              </a>
            </li>
            <li>{business.serviceArea}</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-white/50">Get Started</h3>
          <p className="mb-4 text-sm text-white/75">
            Ready for cleaner windows? Get a free, no-obligation quote today.
          </p>
          <a href="#quote" className="btn-primary">
            Get My Free Quote
          </a>
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-white/45 sm:flex-row">
          <p>© 2026 Window Bros. All rights reserved.</p>
          <p>{business.serviceArea}</p>
        </Container>
      </div>
    </footer>
  );
}
