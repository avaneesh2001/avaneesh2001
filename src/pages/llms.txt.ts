import type { APIRoute } from "astro";
import { getContentFile } from "@lib/content";
import { withBase } from "@lib/paths";
import type { AchievementsContent, ExperienceContent, ProjectsContent, SiteContent } from "../types/content";

// A plain-text summary (llmstxt.org) so AI assistants can answer questions about this person accurately.
export const GET: APIRoute = ({ site }) => {
  const { profile, seo, navigation_links } = getContentFile<SiteContent>("site");
  const experience = getContentFile<ExperienceContent>("experience");
  const projects = getContentFile<ProjectsContent>("projects");
  const achievements = getContentFile<AchievementsContent>("achievements");
  const url = (path: string) => new URL(withBase(path), site).href;

  const lines = [
    `# ${profile.name}`,
    "",
    `> ${seo.job_title} at ${seo.employer} (${seo.location}). Works on ${seo.knows_about.slice(0, 4).join(", ").toLowerCase()}. Graduated from ${seo.alumni_of}.`,
    "",
    "## Experience",
    ...experience.experience_entries.map(
      (entry) => `- ${entry.role_title}, ${entry.organization_name} (${entry.duration}): ${entry.detailed_bullets.map((bullet) => bullet.replace(/\.?$/, ".")).join(" ")}`,
    ),
    "",
    "## Projects",
    ...projects.featured_projects.map((project) => `- ${project.project_title}: ${project.short_description}. ${project.impact_statement}.`),
    "",
    "## Recognition",
    ...achievements.achievement_entries.map((item) => `- ${item.title}: ${item.short_description}`),
    "",
    "## Pages",
    ...navigation_links.filter((link) => link.href.startsWith("/")).map((link) => `- [${link.label}](${url(link.href)})`),
    `- [Resume (PDF)](${url(profile.resume_url)})`,
    "",
    "## Contact",
    `- Email: ${profile.email}`,
    ...seo.same_as.map((link) => `- ${link}`),
    "",
  ];

  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
