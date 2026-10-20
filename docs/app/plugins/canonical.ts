/** Canonical and og:url for every page, from the docs' public URL (DOCS_URL). */
export default defineNuxtPlugin(() => {
  const route = useRoute();
  const siteUrl = String(useRuntimeConfig().public.siteUrl).replace(/\/$/, "");
  const href = () => `${siteUrl}${route.path === "/" ? "/" : route.path.replace(/\/$/, "")}`;
  useHead({
    link: [{ rel: "canonical", href }],
    meta: [{ property: "og:url", content: href }],
  });
});
