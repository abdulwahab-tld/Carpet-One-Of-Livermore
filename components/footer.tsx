import Link from "next/link";
import { business, flooringLinks, navLinks } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-ink text-plaster">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-4xl leading-none">{business.name}</p>
          <p className="mt-5 max-w-xs text-sm leading-6 text-plaster/75">
            {business.shortDescription}
          </p>
        </div>

        <div>
          <p className="text-xs tracking-[0.22em] text-brass uppercase">Visit</p>
          <ul className="mt-4 space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-plaster/80 hover:text-plaster">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-[0.22em] text-brass uppercase">Flooring</p>
          <ul className="mt-4 space-y-2 text-sm">
            {flooringLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-plaster/80 hover:text-plaster">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-[0.22em] text-brass uppercase">Contact</p>
          <address className="mt-4 space-y-2 text-sm text-plaster/80 not-italic">
            <p>{business.name}</p>
            <p>
              {business.street}
              <br />
              {business.city}, {business.region} {business.postalCode}
            </p>
            <p>
              <a className="hover:text-plaster" href={`tel:${business.phoneTel}`}>
                {business.phoneDisplay}
              </a>
            </p>
            <p>
              <a className="hover:text-plaster" href={`mailto:${business.email}`}>
                {business.email}
              </a>
            </p>
            <p>Mon–Sat 10:00 AM–5:00 PM</p>
            <p>Sunday closed</p>
          </address>
          <div className="mt-5 flex gap-4 text-sm">
            <a
              href={business.facebook}
              className="text-brass hover:text-plaster"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <a
              href={business.linkedin}
              className="text-brass hover:text-plaster"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-5 py-5 text-xs text-plaster/55 md:px-8">
          © 2026 {business.name}. Inspiration photography is representative and is not presented as verified company installations.
        </p>
      </div>
    </footer>
  );
}
