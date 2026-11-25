import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { LightboxProvider } from "@/components/image-lightbox";
import { business, getSiteUrl, localBusinessJsonLd } from "@/lib/site";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

const siteUrl = getSiteUrl();
const description =
  "Discover Bioplanks and carpet tile flooring in Livermore with Living Floors. Explore modern flooring solutions for residential and commercial spaces.";

export const metadata: Metadata = {
  title: {
    default: "Living Floors | Bioplanks & Carpet Tile Flooring",
    template: "%s | Living Floors",
  },
  description,
  applicationName: business.name,
  openGraph: {
    title: "Living Floors | Bioplanks & Carpet Tile Flooring",
    description,
    type: "website",
    locale: "en_US",
    siteName: business.name,
    images: [
      {
        url: "/images/hero.jpg",
        width: 2200,
        height: 1467,
        alt: "Open living room with pale wood-look flooring",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Living Floors | Bioplanks & Carpet Tile Flooring",
    description,
    images: ["/images/hero.jpg"],
  },
  ...(siteUrl
    ? {
        metadataBase: new URL(siteUrl),
        alternates: { canonical: "/" },
      }
    : {}),
};

const jsonLd = localBusinessJsonLd(siteUrl);

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full`}>
      <body
        className="min-h-full bg-plaster font-sans text-ink antialiased"
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[70] focus:bg-plaster focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <LightboxProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </LightboxProvider>
      </body>
    </html>
  );
}
