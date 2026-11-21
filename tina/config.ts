import { defineConfig, type Collection, type TinaField } from "tinacms";

/*
 * Local-only TinaCMS editor for the TOML files in data/.
 * Run `npm run cms`, then open http://localhost:4321/avaneesh2001/admin/index.html
 * Edits are written straight to data/*.toml; commit and push them as usual.
 * No Tina Cloud account is used, and the editor is never deployed.
 */

const ACCENTS = ["sapphire", "emerald", "jade", "amethyst", "garnet", "amber", "gold", "teal"];

// ---- small field helpers ----
const text = (name: string, label: string, extra: Partial<TinaField> = {}): TinaField =>
  ({ type: "string", name, label, ...extra }) as TinaField;
const longText = (name: string, label: string, description?: string): TinaField =>
  ({ type: "string", name, label, description, ui: { component: "textarea" } }) as TinaField;
const textList = (name: string, label: string, description?: string): TinaField =>
  ({ type: "string", name, label, description, list: true }) as TinaField;
const image = (name: string, label: string, description?: string): TinaField =>
  ({ type: "image", name, label, description }) as TinaField;
const accent = (name = "accent", label = "Accent colour"): TinaField =>
  ({ type: "string", name, label, options: ACCENTS }) as TinaField;
const group = (name: string, label: string, fields: TinaField[]): TinaField =>
  ({ type: "object", name, label, fields }) as TinaField;
const groupList = (name: string, label: string, titleField: string, fields: TinaField[]): TinaField =>
  ({
    type: "object",
    name,
    label,
    list: true,
    ui: { itemProps: (item: Record<string, string>) => ({ label: item?.[titleField] || "New item" }) },
    fields,
  }) as TinaField;
const link = (name: string, label: string) => groupList(name, label, "label", [text("label", "Label"), text("href", "URL", { description: "Internal pages start with /, e.g. /projects/" })]);
const pageIntro = [text("page_title", "Page title"), longText("page_intro", "Page intro")];

// Each content file is a single document, so collections can't create or delete files.
const singleFile = (name: string, label: string, fields: TinaField[]): Collection => ({
  name,
  label,
  path: "data",
  format: "toml",
  match: { include: name },
  ui: { allowedActions: { create: false, delete: false } },
  fields,
});

const imageHelp = "Upload or pick a file. Images are resized and converted to WebP when the site builds.";

export default defineConfig({
  branch: "main",
  clientId: null,
  token: null,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
    basePath: "avaneesh2001",
  },

  // Images live in src/assets so Astro can optimise them; a picked file is stored as "/images/x.jpg".
  media: {
    tina: {
      publicFolder: "src/assets",
      mediaRoot: "",
    },
  },

  schema: {
    collections: [
      singleFile("home", "Home page", [
        group("hero", "Hero", [
          text("hero_headline", "Headline"),
          longText("hero_subheadline", "Subheadline"),
          text("primary_cta_label", "Primary button label"),
          text("primary_cta_href", "Primary button link"),
          text("secondary_cta_label", "Second button label"),
          text("secondary_cta_href", "Second button link"),
          text("linkedin_cta_label", "Third button label"),
          text("linkedin_cta_href", "Third button link"),
        ]),
        group("hero_archive_card", "Current focus card", [
          text("label", "Card title"),
          text("line_one", "Line 1"),
          text("line_two", "Line 2"),
          text("line_three", "Line 3"),
        ]),
        group("about_scroll", "About me", [
          text("eyebrow", "Eyebrow"),
          text("headline", "Headline"),
          longText("body", "Body", "Each line becomes its own paragraph."),
          text("side_note", "Side note"),
        ]),
        group("contact_card", "Contact card", [
          text("eyebrow", "Eyebrow"),
          text("headline", "Headline"),
          text("description", "Description"),
          text("email_label", "Email label"),
          text("email_href", "Email link (mailto:)"),
          text("linkedin_label", "LinkedIn label"),
          text("linkedin_href", "LinkedIn link"),
          text("github_label", "GitHub label"),
          text("github_href", "GitHub link"),
        ]),
        groupList("selected_impact_items", "Highlights at a glance", "title", [text("title", "Title"), longText("description", "Description")]),
        groupList("section_preview_cards", "Explore the archive cards", "title", [
          text("title", "Title"),
          text("description", "Description"),
          text("href", "Link"),
          accent(),
        ]),
      ]),

      singleFile("experience", "Experience", [
        ...pageIntro,
        groupList("experience_entries", "Roles", "role_title", [
          text("role_title", "Role title"),
          text("organization_name", "Company"),
          image("organization_logo", "Company logo", imageHelp),
          { type: "number", name: "organization_logo_height", label: "Logo height (px)", description: "Default 26. Use ~40 for stacked logos." } as TinaField,
          text("location", "Location"),
          text("duration", "Dates", { description: "Month Year – Month Year, e.g. Sep 2023 – Jun 2026" }),
          longText("role_summary", "Summary"),
          accent(),
          textList("visible_bullets", "Highlights (always shown)"),
          textList("detailed_bullets", "Detailed bullets (in “Read deeper notes”)"),
          longText("optional_longer_explanation", "Longer explanation"),
          image("optional_image", "Image (optional)", imageHelp),
        ]),
      ]),

      singleFile("projects", "Projects", [
        ...pageIntro,
        groupList("featured_projects", "Featured projects", "project_title", [
          text("project_title", "Title"),
          longText("short_description", "Short description"),
          longText("impact_statement", "Impact"),
          textList("technology_tags", "Technology tags"),
          image("optional_image", "Preview image", imageHelp),
          text("optional_image_alt", "Image description (for screen readers)"),
          image("optional_video", "Demo video (mp4 or webm)", "Shown instead of the image when set. Keep it short and compressed (a few MB)."),
          link("project_links", "Links"),
        ]),
        groupList("project_archive", "Other projects", "title", [
          text("title", "Title"),
          longText("brief_description", "Description"),
          text("github_link", "Link"),
        ]),
      ]),

      singleFile("skills", "Skills", [
        ...pageIntro,
        groupList("skill_groups", "Skill groups", "group_name", [
          text("group_name", "Group name"),
          accent(),
          groupList("skills", "Skills", "skill_name", [
            text("skill_name", "Skill"),
            text("tag", "Tag on the chip (optional)", { description: "Replaces the where-used tag, e.g. IELTS 8.0 or JLPT N5" }),
            longText("short_context", "How you used it"),
            textList("related_experience", "Related experience", "Exactly “Role · Company”, e.g. Senior Engineer · Qualcomm"),
            textList("related_projects", "Related projects", "Exact project title from the Projects page"),
            textList("related_education", "Related education", "Exact institution name from the Education page"),
            textList("related_activities", "Related activities", "Exact activity title from the Activities page"),
          ]),
        ]),
      ]),

      singleFile("education", "Education", [
        ...pageIntro,
        group("education_details", "Degree", [
          text("institution_name", "Institution"),
          text("degree_name", "Degree"),
          text("study_period", "Dates"),
          text("short_highlight", "Highlight"),
          image("optional_image", "Photo", imageHelp),
          text("optional_image_alt", "Photo description (for screen readers)"),
          groupList("additional_points", "Points", "point", [text("point", "Point"), textList("subpoints", "Sub-points (shown as tags)")]),
        ]),
      ]),

      singleFile("achievements", "Achievements", [
        ...pageIntro,
        groupList("achievement_entries", "Achievements", "title", [
          text("title", "Title"),
          longText("short_description", "Short description"),
          image("optional_image", "Image", imageHelp),
          text("optional_image_caption", "Image caption"),
          longText("optional_context", "Context"),
          text("date", "Date", { description: "e.g. May 2018 or 2023" }),
        ]),
      ]),

      singleFile("activities", "Activities", [
        ...pageIntro,
        groupList("activities", "Activities", "title", [
          text("title", "Title"),
          text("category", "Category", { description: "Activities are grouped by category, e.g. Leadership" }),
          accent("color_tag", "Colour"),
          longText("short_description", "Description"),
          text("date", "Date", { description: "e.g. May 2018, or 2022 & 2023" }),
          text("story_href", "Story page link (optional)", { description: "e.g. /activities/japan/" }),
          text("story_label", "Story link text"),
          groupList("image_entries", "Photos", "caption", [image("path", "Photo", imageHelp), text("caption", "Caption")]),
          textList("images", "Photos without captions (legacy)"),
        ]),
      ]),

      singleFile("japan", "Japan field notes", [
        text("title", "Title"),
        text("eyebrow", "Eyebrow"),
        longText("intro", "Intro", "Each line becomes its own paragraph."),
        text("map_note", "Note under the map"),
        text("afterword_title", "Afterword title"),
        longText("afterword", "Afterword"),
        groupList("stops", "Stops (numbered pins, in the order you went)", "name", [
          text("name", "Place"),
          text("headline", "Headline"),
          text("area", "Area", { description: "e.g. Ikebukuro, Tokyo" }),
          { type: "boolean", name: "off_route", label: "Not sure when in the trip", description: "Shows a hollow pin left off the dashed route line." } as TinaField,
          { type: "boolean", name: "via_aqua_line", label: "Got here across the bay on the Aqua-Line", description: "The route into this stop follows the tunnel and bridge." } as TinaField,
          { type: "number", name: "lon", label: "Longitude", description: "Decimal degrees, e.g. 139.703" } as TinaField,
          { type: "number", name: "lat", label: "Latitude", description: "Decimal degrees, e.g. 35.733" } as TinaField,
          longText("story", "Story"),
          image("image", "Photo", imageHelp),
          text("image_caption", "Photo caption"),
          text("link_label", "Link text", { description: "e.g. Watch ASIMO on YouTube" }),
          text("link_href", "Link URL"),
        ]),
      ]),

      singleFile("site", "Site settings", [
        group("profile", "Profile", [
          text("name", "Name"),
          text("professional_identity", "Tagline under the name"),
          text("email", "Email"),
          text("resume_url", "Resume link"),
        ]),
        groupList("navigation_links", "Navigation (folder tabs, in order)", "label", [
          text("label", "Label"),
          text("href", "URL", { description: "Internal pages start with /, e.g. /projects/" }),
          accent("accent", "Tab colour"),
        ]),
        link("footer_links", "Footer links"),
        group("seo", "Search & link previews", [
          text("home_title", "Home page title (search results)"),
          text("job_title", "Job title"),
          text("employer", "Employer"),
          text("location", "Location"),
          text("alumni_of", "University"),
          text("og_image", "Preview image path (in public/)"),
          text("og_image_alt", "Preview image description"),
          textList("same_as", "Profile links (LinkedIn, GitHub…)"),
          textList("knows_about", "Topics you work on"),
          textList("awards", "Awards"),
        ]),
      ]),
    ],
  },
});
