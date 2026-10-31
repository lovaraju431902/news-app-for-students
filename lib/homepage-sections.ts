export interface HomepageSectionDefinition {
  id: string;
  label: string;
  description: string;
  requiresVideo?: boolean;
}

export const HOMEPAGE_SECTIONS: HomepageSectionDefinition[] = [
  {
    id: "slide_data",
    label: "Slide Data",
    description: "Hero carousel slider at the top of the homepage",
  },
  {
    id: "right_cards",
    label: "Right Cards",
    description: "Featured cards on top right beside carousel",
  },
  {
    id: "latest_news",
    label: "Latest News",
    description: "Latest breaking headlines (ordered by date, newest first)",
  },
  {
    id: "trending_news",
    label: "Trending News",
    description: "Trending stories with high interest in the right rail",
  },
  {
    id: "technology_news",
    label: "Technology News",
    description: "Tech breakthroughs and articles in the right rail",
  },
  {
    id: "videos",
    label: "Videos",
    description: "Featured video stream & player",
    requiresVideo: true,
  },
  {
    id: "most_read",
    label: "Most Read",
    description: "Top high engagement and most viewed stories",
  },
];

export const VALID_SECTION_IDS = HOMEPAGE_SECTIONS.map((s) => s.id);

export function isValidSection(id: string): boolean {
  return VALID_SECTION_IDS.includes(id);
}

export function getSectionById(id: string): HomepageSectionDefinition | undefined {
  return HOMEPAGE_SECTIONS.find((s) => s.id === id);
}
