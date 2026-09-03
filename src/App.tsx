import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { MobileCTABar } from "./components/layout/MobileCTABar";
import { Hero } from "./components/sections/Hero";
import { TrustBar } from "./components/sections/TrustBar";
import { Services } from "./components/sections/Services";
import { BeforeAfter } from "./components/sections/BeforeAfter";
import { WhyUs } from "./components/sections/WhyUs";
import { About } from "./components/sections/About";
import { HowItWorks } from "./components/sections/HowItWorks";
import { PhotoBreak } from "./components/sections/PhotoBreak";
import { Reviews } from "./components/sections/Reviews";
import { ServiceArea } from "./components/sections/ServiceArea";
import { QuoteForm } from "./components/sections/QuoteForm";
import { FAQ } from "./components/sections/FAQ";
import { FinalCTA } from "./components/sections/FinalCTA";

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main" className="pb-20 lg:pb-0">
        <Hero />
        <TrustBar />
        <Services />
        <BeforeAfter />
        <WhyUs />
        <About />
        <HowItWorks />
        <PhotoBreak />
        <Reviews />
        <ServiceArea />
        <QuoteForm />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <MobileCTABar />
    </>
  );
}
