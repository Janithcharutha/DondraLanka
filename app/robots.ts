import type { MetadataRoute } from 'next/types'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: "https://www.dondralanka.com/sitemap.xml",
  };
}