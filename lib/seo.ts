import type { Metadata } from "next/types";

const SITE_NAME = "DONDRA LANKA";
const SITE_URL = "https://www.dondralanka.com";
const DEFAULT_OG_IMAGE = "/og-image.jpg";

type BuildMetadataArgs = {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  keywords = [],
  noIndex = false,
}: BuildMetadataArgs): Metadata {
  const fullUrl = `${SITE_URL}${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: image,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`;
}