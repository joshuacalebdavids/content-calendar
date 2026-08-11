export const CONTENT_STATUSES = [
  "idea",
  "drafting",
  "review",
  "scheduled",
  "published",
] as const;

export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const CONTENT_FORMATS = [
  "Reel",
  "Carousel",
  "Post",
  "Story",
  "Newsletter",
] as const;

export type ContentFormat = (typeof CONTENT_FORMATS)[number];

export const PLATFORMS = [
  "Instagram",
  "LinkedIn",
  "TikTok",
  "YouTube",
  "Newsletter",
] as const;

export type Platform = (typeof PLATFORMS)[number];

export interface ContentItem {
  id: string;
  title: string;
  summary: string;
  publishDate: string;
  status: ContentStatus;
  format: ContentFormat;
  platforms: Platform[];
  pillar: string;
  hook: string;
  caption: string;
  productionNotes: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
}
