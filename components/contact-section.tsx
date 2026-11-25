import { ContactForm } from "@/components/contact-form";
import { Eyebrow } from "@/components/eyebrow";
import { Reveal } from "@/components/reveal";
import { business, directionsHref, mapEmbedSrc } from "@/lib/site";

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 bg-plaster px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <Reveal>
          <Eyebrow>Contact</Eyebrow>
          <h2 className="mt-4 font-display text-5xl leading-none md:text-6xl">
            Request a free estimate
          </h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-ink/75">
            Tell us about the space and the flooring you want to explore. Your message is sent to sales@carpetonel.com.
          </p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </Reveal>

        <Reveal delay={0.12} className="flex h-full flex-col bg-ink p-8 text-plaster md:p-10">
          <h3 className="font-display text-4xl">{business.name}</h3>
          <dl className="mt-8 space-y-5 text-sm">
            <div>
              <dt className="text-xs tracking-[0.18em] text-brass uppercase">Phone</dt>
              <dd className="mt-1">
                <a href={`tel:${business.phoneTel}`} className="hover:text-brass">
                  {business.phoneDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.18em] text-brass uppercase">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${business.email}`} className="hover:text-brass">
                  {business.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.18em] text-brass uppercase">Location</dt>
              <dd className="mt-1">
                {business.street}
                <br />
                {business.city}, {business.region} {business.postalCode}
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.18em] text-brass uppercase">Hours</dt>
              <dd className="mt-1">
                {business.hours.map((row) => (
                  <span key={row.days} className="block">
                    {row.days}: {row.time}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex text-sm text-brass underline-offset-4 hover:underline"
          >
            Get directions
          </a>
          <div className="mt-8 min-h-72 flex-1 overflow-hidden">
            <iframe
              title={`Map showing ${business.name} at 1917 First Street, Livermore, California`}
              src={mapEmbedSrc}
              className="h-full min-h-72 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
