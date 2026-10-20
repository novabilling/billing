/**
 * Product branding for the dashboard. Set these at build time (Next.js inlines
 * NEXT_PUBLIC_* values) — nothing else in the UI should spell out the product
 * name or point at a fixed logo.
 */
export const brand = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || "PimaBill",
  logo: process.env.NEXT_PUBLIC_BRAND_LOGO || "/logo.png",
  tagline: process.env.NEXT_PUBLIC_BRAND_TAGLINE || "Multi-tenant billing service platform",
  /** Optional CSS colour for the primary accent, e.g. "hsl(160 84% 32%)" or "#0f6b5f". */
  primaryColor: process.env.NEXT_PUBLIC_BRAND_PRIMARY || "",
  /** Lower-case, file-name-safe form of the name, used for exported files. */
  get fileSlug() {
    return this.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "export";
  },
};
