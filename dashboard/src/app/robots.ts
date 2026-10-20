import type { MetadataRoute } from "next";

/** The dashboard is not for search engines; the landing page and docs are. */
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
