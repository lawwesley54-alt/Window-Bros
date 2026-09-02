import { business } from "../../config/site";

/**
 * Fixed bottom CTA bar shown only on small screens. Adds bottom padding
 * to <body> at the App level so it never covers footer content or forms.
 */
export function MobileCTABar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-white/95 p-3 backdrop-blur-md [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <a
        href={business.phoneHref}
        className="btn-secondary flex-1 !px-3"
        aria-label={`Call Window Bros at ${business.phone}`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6.6 10.8c1.3 2.6 3.4 4.6 6 5.9l2-2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 .9v3.4c0 .5-.4 1-1 1C10.4 20.4 3.6 13.6 3.6 5c0-.5.4-1 1-1H8c.5 0 .9.4.9 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.3 1l-2 2.3z"
            fill="currentColor"
          />
        </svg>
        Call
      </a>
      <a href="#quote" className="btn-primary flex-[2]">
        Get Free Quote
      </a>
    </div>
  );
}
