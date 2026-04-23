const BASE_URL = import.meta.env.BASE_URL ?? "/";

const hasProtocol = (value: string) => /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value);

export function withBase(path: string): string {
  if (!path) return path;
  if (hasProtocol(path) || path.startsWith("#") || path.startsWith("?")) return path;

  const normalizedBase = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;
  const baseWithoutTrailingSlash = normalizedBase.slice(0, -1);

  if (path === normalizedBase || path === baseWithoutTrailingSlash) return normalizedBase;
  if (path.startsWith(normalizedBase)) return path;

  if (path === "/") return normalizedBase;

  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${normalizedBase}${normalizedPath}`;
}

export function withoutBase(pathname: string): string {
  if (!pathname) return "/";

  const normalizedBase = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;
  const baseWithoutTrailingSlash = normalizedBase.slice(0, -1);

  if (pathname === baseWithoutTrailingSlash || pathname === normalizedBase) return "/";
  if (!pathname.startsWith(baseWithoutTrailingSlash)) return pathname;

  const trimmedPath = pathname.slice(baseWithoutTrailingSlash.length);
  return trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`;
}
