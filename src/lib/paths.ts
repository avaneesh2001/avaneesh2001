// The deploy base (e.g. "/avaneesh2001/") comes from `base` in astro.config.mjs,
// so content files can use root-relative paths like "/projects/".
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const isInternal = (href: string) => href.startsWith("/") && !href.startsWith("//");

/** Prefix an internal root-relative path with the deploy base; leave external links alone. */
export function withBase(href: string): string {
  if (!isInternal(href)) return href;
  if (BASE && (href === BASE || href.startsWith(`${BASE}/`))) return href;
  return `${BASE}${href}`;
}

/** Strip the deploy base from a pathname so it can be compared with content paths. */
export function withoutBase(pathname: string): string {
  if (!pathname) return "/";
  let path = pathname;
  if (BASE && (path === BASE || path.startsWith(`${BASE}/`))) path = path.slice(BASE.length);
  return path.startsWith("/") ? path : `/${path}`;
}
