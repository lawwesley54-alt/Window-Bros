/**
 * Central Window Bros business configuration.
 *
 * Every placeholder is wrapped in square brackets, e.g. [PHONE].
 * Replace these with real business details before launch — nothing here
 * is invented (no fake review counts, years in business, guarantees,
 * licenses, or prices).
 */

export const business = {
  name: "Window Bros",
  tagline: "Two Brothers, Clean Glass",
  phone: "(512) 995-9966",
  phoneHref: "tel:+15129959966",
  smsHref: "sms:+15129959966",
  email: "broswimdow4@gmail.com",
  primaryCity: "Salado, TX",
  serviceArea: "Salado, TX",
  address: {
    street: "[STREET ADDRESS]",
    city: "Salado",
    state: "TX",
    zip: "[ZIP]",
  },
  social: {
    facebook: "[FACEBOOK URL]",
    instagram: "[INSTAGRAM URL]",
    // Google Business Profile URL — also used as the "Leave us a review"
    // link. Use the direct review-shortcut link from Google Business
    // Profile (Home > "Get more reviews" > copy link) so it opens
    // straight to the review form instead of the profile page.
    google: "[GOOGLE BUSINESS PROFILE URL]",
  },
  hours: "[BUSINESS HOURS]",
} as const;

export const nav = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#quote" },
] as const;

export const owner = {
  name: "Wesley Law",
  school: "Salado High School",
  experience: "Almost 2 years",
  bio: [
    "Window Bros is owned and run by Wesley Law, a Salado High School student who's spent the last two years hustling to build something of his own — one clean window at a time. Wesley works alongside a small crew of friends to get every job done right.",
    "He's saving up for college, and he treats every job like it matters, because it does. Every job comes with a simple promise: if you're not happy with how it looks, the job isn't done yet.",
  ],
} as const;

export const trustPoints = [
  { label: "Professional Service" },
  { label: "Easy Scheduling" },
  { label: "Satisfaction Focused" },
  { label: "Residential Specialists" },
] as const;

export type ServiceKey = "exterior" | "interior" | "screens";

export const services: {
  key: ServiceKey;
  name: string;
  description: string;
  imageKey: keyof typeof import("./images").images;
}[] = [
  {
    key: "exterior",
    name: "Exterior Window Cleaning",
    description: "Professional exterior window cleaning for a clearer view.",
    imageKey: "windowCleaning",
  },
  {
    key: "interior",
    name: "Interior Window Cleaning",
    description: "Careful interior window cleaning for a brighter home.",
    imageKey: "interiorWindows",
  },
  {
    key: "screens",
    name: "Screen Cleaning",
    description: "Remove dust and buildup from window screens.",
    imageKey: "screens",
  },
];

export const whyPoints = [
  {
    title: "Easy",
    description: "Simple quotes and straightforward scheduling.",
  },
  {
    title: "Careful",
    description: "We treat your home and property with respect.",
  },
  {
    title: "Reliable",
    description: "Clear communication from quote to completion.",
  },
  {
    title: "Quality Focused",
    description: "We care about the final result.",
  },
] as const;

export const howItWorks = [
  {
    step: "01",
    title: "Get Your Quote",
    description: "Tell us what you need cleaned.",
  },
  {
    step: "02",
    title: "Pick Your Time",
    description: "Choose a convenient time.",
  },
  {
    step: "03",
    title: "Enjoy Cleaner Windows",
    description: "We clean your windows and leave your home looking better.",
  },
] as const;

export type Review = {
  name: string;
  location: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  photo?: string;
};

/**
 * PLACEHOLDER REVIEWS — replace with real customer reviews.
 * Never publish invented reviews. Each entry mirrors the shape a real
 * review will use (name, location, rating 1–5, text, optional photo).
 */
export const reviews: Review[] = [
  {
    name: "[CUSTOMER NAME]",
    location: "[CUSTOMER LOCATION]",
    rating: 5,
    text: "[Replace with a real customer review.]",
  },
  {
    name: "[CUSTOMER NAME]",
    location: "[CUSTOMER LOCATION]",
    rating: 5,
    text: "[Replace with a real customer review.]",
  },
  {
    name: "[CUSTOMER NAME]",
    location: "[CUSTOMER LOCATION]",
    rating: 5,
    text: "[Replace with a real customer review.]",
  },
];

export const faqs = [
  {
    question: "How much does window cleaning cost?",
    answer:
      "[Pricing depends on the size of your home and the services requested. Contact us for a free, no-obligation quote.]",
  },
  {
    question: "How long does window cleaning take?",
    answer: "Depending on the size of your house, window cleaning typically takes 2 to 4 hours.",
  },
  {
    question: "Do you clean interior windows?",
    answer: "Yes — interior window cleaning is one of our core services.",
  },
  {
    question: "Do you clean window screens?",
    answer:
      "Yes — we take your screens off, wash them down, and put them back in place.",
  },
  {
    question: "How do I get a quote?",
    answer: `Call us at ${business.phone} for a free quote, or fill out the quote form on this page and we'll follow up with you directly.`,
  },
  {
    question: "Can I send a video of my windows for a more accurate quote?",
    answer: `Yes — text a short video of your windows to ${business.phone} and we'll use it to fine-tune your quote.`,
  },
  {
    question: "What areas do you serve?",
    answer: `We proudly serve the ${business.serviceArea} area.`,
  },
  {
    question: "What happens if it rains?",
    answer:
      "If it rains on the day of your scheduled cleaning, we guarantee you'll get one free job.",
  },
] as const;
