import { useState, type ChangeEvent, type FormEvent } from "react";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

type ServiceOption = "exterior" | "interior" | "screens" | "hardWater" | "notSure";

type FormState = {
  name: string;
  phone: string;
  email: string;
  address: string;
  windowCount: string;
  stories: string;
  services: ServiceOption[];
  preferredDate: string;
  notes: string;
};

type FormErrors = Partial<Record<keyof Omit<FormState, "services" | "notes">, string>> & {
  services?: string;
};

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  address: "",
  windowCount: "",
  stories: "",
  services: [],
  preferredDate: "",
  notes: "",
};

const serviceOptions: { key: ServiceOption; label: string }[] = [
  { key: "exterior", label: "Exterior Windows" },
  { key: "interior", label: "Interior Windows" },
  { key: "screens", label: "Screens" },
  { key: "hardWater", label: "Hard Water Stain Removal" },
  { key: "notSure", label: "Not Sure" },
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[\d\s()+.-]{7,20}$/;

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.phone.trim()) errors.phone = "Please enter your phone number.";
  else if (!phonePattern.test(values.phone)) errors.phone = "Please enter a valid phone number.";
  if (!values.email.trim()) errors.email = "Please enter your email.";
  else if (!emailPattern.test(values.email)) errors.email = "Please enter a valid email address.";
  if (!values.address.trim()) errors.address = "Please enter your address.";
  if (values.services.length === 0) errors.services = "Please select at least one option.";
  return errors;
}

/**
 * Quote request form. Not wired to a backend — onSubmit simulates
 * success locally. To connect a real backend or form service (e.g. an
 * API route, Formspree, or a CRM webhook), replace the body of
 * `submitQuoteRequest` below with a real network call.
 */
async function submitQuoteRequest(values: FormState): Promise<void> {
  console.info("Quote request ready to send:", values);
  await new Promise((resolve) => setTimeout(resolve, 600));
}

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-ink-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const errorInputClass = "border-red-400 focus-visible:outline-red-500";
const labelClass = "mb-1.5 block text-sm font-semibold text-ink";
const errorTextClass = "mt-1.5 text-sm text-red-600";

export function QuoteForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const field = <K extends keyof FormState>(key: K) => ({
    value: values[key] as never,
    onChange: (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => setValues((prev) => ({ ...prev, [key]: e.target.value })),
  });

  const toggleService = (key: ServiceOption) => {
    setValues((prev) => ({
      ...prev,
      services: prev.services.includes(key)
        ? prev.services.filter((s) => s !== key)
        : [...prev.services, key],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstKey = Object.keys(nextErrors)[0];
      document.getElementById(`quote-${firstKey}`)?.focus();
      return;
    }
    setStatus("submitting");
    await submitQuoteRequest(values);
    setStatus("success");
  };

  if (status === "success") {
    return (
      <section id="quote" className="section-pad bg-white">
        <Container>
          <Reveal className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl border border-line bg-bg-subtle p-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M20 6.5L9 17.5l-5-5"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-h3 text-ink">Thanks — your quote request is in!</h2>
            <p className="text-body">
              We&rsquo;ll be in touch soon to confirm details and get you scheduled.
            </p>
            <button
              type="button"
              className="btn-secondary mt-2"
              onClick={() => {
                setValues(initialState);
                setStatus("idle");
              }}
            >
              Submit Another Request
            </button>
          </Reveal>
        </Container>
      </section>
    );
  }

  return (
    <section id="quote" className="section-pad bg-white">
      <Container>
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            eyebrow="Free Quote"
            title="Let's Get Your Windows Looking Their Best"
            subtitle="Tell us a bit about your home and we'll follow up with a free quote."
          />

          <Reveal delay={100}>
            <form
              noValidate
              onSubmit={handleSubmit}
              className="mt-10 flex flex-col gap-5 rounded-3xl border border-line bg-bg-subtle p-6 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="quote-name" className={labelClass}>
                    Name <span className="text-accent">*</span>
                  </label>
                  <input
                    id="quote-name"
                    type="text"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "quote-name-error" : undefined}
                    className={`${inputClass} ${errors.name ? errorInputClass : ""}`}
                    {...field("name")}
                  />
                  {errors.name && (
                    <p id="quote-name-error" className={errorTextClass}>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="quote-phone" className={labelClass}>
                    Phone <span className="text-accent">*</span>
                  </label>
                  <input
                    id="quote-phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "quote-phone-error" : undefined}
                    className={`${inputClass} ${errors.phone ? errorInputClass : ""}`}
                    {...field("phone")}
                  />
                  {errors.phone && (
                    <p id="quote-phone-error" className={errorTextClass}>
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="quote-email" className={labelClass}>
                  Email <span className="text-accent">*</span>
                </label>
                <input
                  id="quote-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "quote-email-error" : undefined}
                  className={`${inputClass} ${errors.email ? errorInputClass : ""}`}
                  {...field("email")}
                />
                {errors.email && (
                  <p id="quote-email-error" className={errorTextClass}>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="quote-address" className={labelClass}>
                  Address <span className="text-accent">*</span>
                </label>
                <input
                  id="quote-address"
                  type="text"
                  autoComplete="street-address"
                  aria-invalid={!!errors.address}
                  aria-describedby={errors.address ? "quote-address-error" : undefined}
                  className={`${inputClass} ${errors.address ? errorInputClass : ""}`}
                  {...field("address")}
                />
                {errors.address && (
                  <p id="quote-address-error" className={errorTextClass}>
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="quote-windowCount" className={labelClass}>
                    Number of Windows
                  </label>
                  <input
                    id="quote-windowCount"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    className={inputClass}
                    {...field("windowCount")}
                  />
                </div>
                <div>
                  <label htmlFor="quote-stories" className={labelClass}>
                    Number of Stories
                  </label>
                  <select id="quote-stories" className={inputClass} {...field("stories")}>
                    <option value="">Select...</option>
                    <option value="1">1 Story</option>
                    <option value="2">2 Stories</option>
                    <option value="3+">3+ Stories</option>
                  </select>
                </div>
              </div>

              <fieldset>
                <legend className={labelClass}>
                  Services Needed <span className="text-accent">*</span>
                </legend>
                <div
                  id="quote-services"
                  className="grid grid-cols-2 gap-3 sm:grid-cols-3"
                  aria-invalid={!!errors.services}
                  aria-describedby={errors.services ? "quote-services-error" : undefined}
                >
                  {serviceOptions.map((option) => (
                    <label
                      key={option.key}
                      className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-medium text-ink has-[:checked]:border-accent has-[:checked]:bg-accent-soft"
                    >
                      <input
                        type="checkbox"
                        checked={values.services.includes(option.key)}
                        onChange={() => toggleService(option.key)}
                        className="h-4 w-4 shrink-0 accent-[var(--color-accent)]"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
                {errors.services && (
                  <p id="quote-services-error" className={errorTextClass}>
                    {errors.services}
                  </p>
                )}
              </fieldset>

              <div>
                <label htmlFor="quote-preferredDate" className={labelClass}>
                  Preferred Date
                </label>
                <input
                  id="quote-preferredDate"
                  type="date"
                  className={inputClass}
                  {...field("preferredDate")}
                />
              </div>

              <div>
                <label htmlFor="quote-notes" className={labelClass}>
                  Additional Notes
                </label>
                <textarea
                  id="quote-notes"
                  rows={4}
                  className={`${inputClass} resize-y`}
                  placeholder="Anything else we should know?"
                  {...field("notes")}
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-primary mt-2 w-full !text-base disabled:opacity-60"
              >
                {status === "submitting" ? "Sending..." : "Get My Free Quote"}
              </button>
              <p className="text-center text-xs text-ink-faint">
                We&rsquo;ll never share your information. No spam, ever.
              </p>
            </form>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
