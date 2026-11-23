import type { Metadata } from "next";
import { FlooringDetail } from "@/components/flooring-detail";
import { getSiteUrl } from "@/lib/site";

const description =
  "Explore carpet tile flooring in Livermore for homes and commercial spaces. Compare patterns, textures, and arrangements at Carpet One Of Livermore.";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Carpet Tile Flooring in Livermore",
  description,
  openGraph: {
    title: "Carpet Tile Flooring in Livermore",
    description,
    images: [
      {
        url: "/images/carpet-detail.jpg",
        alt: "Grey carpet tiles beneath a teal chair and two red seats",
      },
    ],
  },
  ...(siteUrl ? { alternates: { canonical: "/flooring/carpet-tile" } } : {}),
};

export default function CarpetTilePage() {
  return (
    <FlooringDetail
      tone="ink"
      eyebrow="Carpet tile flooring in Livermore"
      title="Versatile & Stylish Carpet Tile Flooring"
      lede="Enhance your interiors with attractive carpet tile flooring. Explore different patterns, textures, and designs to create comfortable and visually appealing spaces for residential and commercial environments."
      paragraphs={[
        "Carpet tile is modular carpet installed as individual tiles. That makes it possible to arrange patterns and textures in more than one direction, which is useful in both homes and commercial rooms.",
        "Carpet One Of Livermore can help you look through carpet tile styles for the kind of interior you have in mind. Availability changes, so contact the showroom to see current options.",
      ]}
      points={[
        "Available in different patterns and designs.",
        "Offers creative flooring arrangement possibilities.",
        "Suitable for a variety of interior environments.",
      ]}
      image={{
        src: "/images/carpet-detail.jpg",
        alt: "Grey carpet tiles beneath a teal chair and two red seats",
      }}
      photos={[
        {
          src: "/images/carpet-detail.jpg",
          alt: "Grey carpet tiles beneath a teal chair and two red seats",
        },
        {
          src: "/images/carpet-feature.jpg",
          alt: "Office lounge with geometric grey carpet tiles and leather seating",
        },
      ]}
    />
  );
}
