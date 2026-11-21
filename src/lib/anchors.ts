/** Turn a title into a stable URL fragment, e.g. "Senior Engineer · Qualcomm" → "senior-engineer-qualcomm". */
export function toAnchor(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The label skills use to refer to an experience entry. */
export const experienceLabel = (entry: { role_title: string; organization_name: string }) =>
  `${entry.role_title} · ${entry.organization_name.replace(/\s+Software Systems$/, "")}`;
