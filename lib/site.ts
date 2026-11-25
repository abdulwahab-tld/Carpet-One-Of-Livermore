export const business = {
  name: "Living Floors",
  phoneDisplay: "(925) 238-3127",
  phoneTel: "+19252383127",
  email: "sales@carpetonel.com",
  street: "1917 First Street",
  city: "Livermore",
  region: "CA",
  postalCode: "94550",
  country: "US",
  mapQuery: "1917 First Street, Livermore, CA 94550",
  hours: [
    { days: "Monday – Saturday", time: "10:00 AM – 5:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
  geo: { latitude: 37.680347, longitude: -121.772158 },
  facebook: "https://www.facebook.com/Carpetoneoflivermore/",
  linkedin: "https://www.linkedin.com/company/carpet-one-of-livermore",
  shortDescription:
    "Bioplanks and carpet tile flooring for homes and commercial spaces in Livermore, California.",
} as const;

export const navLinks = [
  { href: "/#top", label: "Home" },
  { href: "/#about", label: "About Us" },
  { href: "/#flooring", label: "Flooring" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#faqs", label: "FAQs" },
  { href: "/#contact", label: "Contact Us" },
] as const;

export const flooringLinks = [
  { href: "/flooring/bioplanks", label: "Bioplanks Flooring" },
  { href: "/flooring/carpet-tile", label: "Carpet Tile Flooring" },
] as const;

export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

export const mapEmbedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(business.mapQuery)}&z=16&output=embed`;

export const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.mapQuery)}`;

export function localBusinessJsonLd(siteUrl?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FlooringStore",
    name: business.name,
    telephone: "+1-925-238-3127",
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.street,
      addressLocality: business.city,
      addressRegion: business.region,
      postalCode: business.postalCode,
      addressCountry: business.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:00",
        closes: "17:00",
      },
    ],
    areaServed: {
      "@type": "City",
      name: "Livermore",
      address: {
        "@type": "PostalAddress",
        addressRegion: "CA",
        addressCountry: "US",
      },
    },
    sameAs: [business.facebook, business.linkedin],
    ...(siteUrl
      ? { url: siteUrl, image: `${siteUrl}/images/hero.jpg` }
      : {}),
  };
}
