import type { NavigationLink } from "../types/content";
import { withoutBase } from "./paths";

/** Two-digit file number used on tabs, the phone bar and each sheet, e.g. 2 → "02". */
export const fileNumber = (index: number) => String(index + 1).padStart(2, "0");

const isCurrent = (href: string, currentPath: string) => {
  const path = withoutBase(href);
  if (path === "/") return currentPath === "/";
  return currentPath === path || currentPath.startsWith(`${path.replace(/\/$/, "")}/`);
};

/**
 * Where the current page sits in the folder: its tab, the files before and after it,
 * and the total. `index` is -1 for pages that aren't in the navigation (e.g. 404).
 */
export function folderPosition(links: NavigationLink[], pathname: string) {
  const currentPath = withoutBase(pathname);
  const index = links.findIndex((link) => isCurrent(link.href, currentPath));
  return {
    index,
    current: index >= 0 ? links[index] : undefined,
    previous: index > 0 ? links[index - 1] : undefined,
    next: index >= 0 && index < links.length - 1 ? links[index + 1] : undefined,
    total: links.length,
  };
}
