export type AccentName = "sapphire" | "emerald" | "jade" | "amethyst" | "garnet" | "amber" | "gold" | "teal";

export interface NavigationLink {
  label: string;
  href: string;
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
      short_context: string;
      related_projects: string[];
      related_experience: string[];
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
    optional_context: string;
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
    additional_points?: Array<{
      point: string;
    }>;
  };
}
