import { About } from "@/components/about";
import { Benefits } from "@/components/benefits";
import { ContactSection } from "@/components/contact-section";
import { CtaBand } from "@/components/cta-band";
import { Faq } from "@/components/faq";
import { FlooringShowcase } from "@/components/flooring-showcase";
import { Gallery } from "@/components/gallery";
import { Hero } from "@/components/hero";
import { Testimonials } from "@/components/testimonials";
import { WhyChoose } from "@/components/why-choose";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <FlooringShowcase />
      <WhyChoose />
      <Gallery />
      <Benefits />
      <Testimonials />
      <Faq />
      <ContactSection />
      <CtaBand />
    </>
  );
}
