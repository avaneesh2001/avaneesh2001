import type { APIRoute } from "astro";
import { getContentFile } from "@lib/content";
import { withBase } from "@lib/paths";
import type { SiteContent } from "../types/content";

// Built from the navigation so new pages are listed automatically, plus pages clipped to a file.
const attachedPages = ["/activities/japan/"];

export const GET: APIRoute = ({ site }) => {
  const { navigation_links } = getContentFile<SiteContent>("site");
  const lastModified = new Date().toISOString().slice(0, 10);
  const urls = [...navigation_links.filter((link) => link.href.startsWith("/")).map((link) => link.href), ...attachedPages]
    .map((href) => new URL(withBase(href), site).href);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc><lastmod>${lastModified}</lastmod></url>`).join("\n")}
</urlset>
`;

  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
