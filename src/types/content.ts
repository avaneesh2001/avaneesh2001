export type AccentName = "sapphire" | "emerald" | "jade" | "amethyst" | "garnet" | "amber" | "gold" | "teal";

export interface NavigationLink {
  label: string;
  href: string;
  /** Colour of this section's folder tab; the page uses the same accent. */
  accent?: AccentName;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SiteContent {
  profile: {
    name: string;
    professional_identity: string;
    email: string;
    resume_url: string;
  };
  navigation_links: NavigationLink[];
  footer_links: FooterLink[];
  seo: {
    home_title: string;
    job_title: string;
    employer: string;
    location: string;
    alumni_of: string;
    og_image: string;
    og_image_alt: string;
    same_as: string[];
    knows_about: string[];
    awards: string[];
  };
}

export interface LinkItem {
  label: string;
  href: string;
}

export interface HomeContent {
  hero: {
    hero_headline: string;
    hero_subheadline: string;
    primary_cta_label: string;
    primary_cta_href: string;
    secondary_cta_label: string;
    secondary_cta_href: string;
    linkedin_cta_label: string;
    linkedin_cta_href: string;
  };
  hero_archive_card: {
    label: string;
    line_one: string;
    line_two: string;
    line_three: string;
  };
  about_scroll: {
    eyebrow: string;
    headline: string;
    body: string;
    side_note: string;
  };
  contact_card: {
    eyebrow: string;
    headline: string;
    description: string;
    email_label: string;
    email_href: string;
    linkedin_label: string;
    linkedin_href: string;
    github_label: string;
    github_href: string;
  };
  selected_impact_items: Array<{
    title: string;
    description: string;
  }>;
  section_preview_cards: Array<{
    title: string;
    description: string;
    href: string;
    accent: AccentName;
  }>;
}

export interface ExperienceContent {
  page_title: string;
  page_intro: string;
  experience_entries: Array<{
    role_title: string;
    organization_name: string;
    location: string;
    duration: string;
    role_summary: string;
    accent: AccentName;
    visible_bullets: string[];
    detailed_bullets: string[];
    optional_longer_explanation: string;
    optional_image: string;
    /** Path under src/assets, e.g. "logos/qualcomm.webp". */
    organization_logo?: string;
    /** Display height in px (default 26); stacked logos need more. */
    organization_logo_height?: number;
  }>;
}

export interface ProjectsContent {
  page_title: string;
  page_intro: string;
  featured_projects: Array<{
    project_title: string;
    short_description: string;
    impact_statement: string;
    technology_tags: string[];
    project_links?: LinkItem[];
    optional_image: string;
    optional_image_alt?: string;
    /** Optional demo video under src/assets (mp4/webm); shown instead of the image. */
    optional_video?: string;
  }>;
  project_archive: Array<{
    title: string;
    brief_description: string;
    github_link: string;
  }>;
}

export interface SkillsContent {
  page_title: string;
  page_intro: string;
  skill_groups: Array<{
    group_name: string;
    accent: AccentName;
    skills: Array<{
      skill_name: string;
      /** Optional chip text shown instead of where the skill was used, e.g. "IELTS 8.0". */
      tag?: string;
      short_context: string;
      /** Must match a project title on the Projects page. */
      related_projects: string[];
      /** Must match "Role · Company" of an Experience entry. */
      related_experience: string[];
      /** Must match an activity title on the Activities page. */
      related_activities?: string[];
      /** Must match an institution name on the Education page. */
      related_education?: string[];
    }>;
  }>;
}

export interface ActivitiesContent {
  page_title: string;
  page_intro: string;
  activities: Array<{
    title: string;
    category: string;
    color_tag?: AccentName;
    short_description: string;
    /** When it happened, e.g. "May 2018" or "2022 & 2023". */
    date?: string;
    /** Optional longer story page, e.g. "/activities/japan/". */
    story_href?: string;
    story_label?: string;
    images?: string[];
    image_entries?: Array<{
      path: string;
      caption?: string;
    }>;
  }>;
}

export interface AchievementsContent {
  page_title: string;
  page_intro: string;
  achievement_entries: Array<{
    title: string;
    short_description: string;
    optional_image: string;
    optional_image_caption?: string;
    optional_context: string;
    /** When it happened, e.g. "May 2018" or "2023". */
    date?: string;
  }>;
}

export interface EducationContent {
  page_title: string;
  page_intro: string;
  education_details: {
    institution_name: string;
    degree_name: string;
    study_period: string;
    short_highlight: string;
    optional_image: string;
    optional_image_alt?: string;
    additional_points?: Array<{
      point: string;
      subpoints?: string[];
    }>;
  };
}

export interface JapanContent {
  title: string;
  eyebrow: string;
  intro: string;
  map_note?: string;
  afterword_title?: string;
  afterword?: string;
  stops: Array<{
    name: string;
    headline: string;
    area: string;
    /** Visited, but not sure when: drawn as a hollow pin off the route line. */
    off_route?: boolean;
    /** The leg into this stop crossed Tokyo Bay on the Aqua-Line (tunnel and bridge). */
    via_aqua_line?: boolean;
    lon: number;
    lat: number;
    story: string;
    image?: string;
    image_caption?: string;
    link_label?: string;
    link_href?: string;
  }>;
}
