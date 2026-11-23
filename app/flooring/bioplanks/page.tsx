import type { Metadata } from "next";
import { FlooringDetail } from "@/components/flooring-detail";
import { getSiteUrl } from "@/lib/site";

const description =
  "Explore stylish Bioplanks flooring in Livermore. Compare wood-inspired designs and finishes for residential and commercial interiors at Carpet One Of Livermore.";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Bioplanks Flooring in Livermore",
  description,
  openGraph: {
    title: "Bioplanks Flooring in Livermore",
    description,
    images: [
      {
        url: "/images/bioplanks-detail.jpg",
        alt: "Bedroom with light wood-look plank flooring",
      },
    ],
  },
  ...(siteUrl ? { alternates: { canonical: "/flooring/bioplanks" } } : {}),
};

export default function BioplanksPage() {
  return (
    <FlooringDetail
      tone="warm"
      eyebrow="Bioplanks flooring in Livermore"
      title="Stylish & Modern Bioplanks Flooring"
      lede="Discover Bioplanks flooring solutions that bring style and character to your interiors. Explore attractive designs and finishes to find flooring that complements your home or commercial space."
      paragraphs={[
        "Bioplanks flooring is a wood-inspired option for people who want a modern floor that works with contemporary rooms. Designs and finishes vary, so the useful next step is to compare the looks that fit your space.",
        "Carpet One Of Livermore can walk through Bioplanks options for a residential room or a commercial interior. Tell us how the space is used and the style you want the floor to complement.",
      ]}
      points={[
        "Modern and attractive flooring appearance.",
        "Available in different design styles and finishes.",
        "Helps complement contemporary interior designs.",
      ]}
      image={{
        src: "/images/bioplanks-detail.jpg",
        alt: "Bedroom with light wood-look plank flooring, a low bed, and a window bench",
      }}
      secondary={{
        src: "/images/bioplanks-detail-2.jpg",
        alt: "Green sofa above a light wood-look floor",
      }}
    />
  );
}
