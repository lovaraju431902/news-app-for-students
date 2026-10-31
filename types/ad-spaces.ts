export type AdSpaceId =
  | "header"
  | "index_top"
  | "index_bottom"
  | "post_details_top"
  | "post_details_bottom"
  | "posts_top"
  | "posts_bottom"
  | "sidebar_1"
  | "sidebar_2"
  | "in_article_1"
  | "in_article_2";

export interface BannerConfig {
  width: string;
  height: string;
  adCode: string;
  adUrl?: string;
  imageUrl?: string;
}

export interface AdSpaceItem {
  id: AdSpaceId;
  name: string;
  language: string;
  desktop: BannerConfig;
  mobile: BannerConfig;
  isActive: boolean;
  updatedAt: string;
}

export const AD_SPACE_DEFINITIONS: Array<{
  id: AdSpaceId;
  name: string;
  defaultDesktop: { w: string; h: string };
  defaultMobile: { w: string; h: string };
}> = [
    { id: "header", name: "Header", defaultDesktop: { w: "800", h: "130" }, defaultMobile: { w: "300", h: "250" } },
    { id: "index_top", name: "Index (Top)", defaultDesktop: { w: "728", h: "90" }, defaultMobile: { w: "300", h: "250" } },
    { id: "index_bottom", name: "Index (Bottom)", defaultDesktop: { w: "728", h: "90" }, defaultMobile: { w: "300", h: "250" } },
    { id: "post_details_top", name: "Post Details (Top)", defaultDesktop: { w: "728", h: "90" }, defaultMobile: { w: "300", h: "250" } },
    { id: "post_details_bottom", name: "Post Details (Bottom)", defaultDesktop: { w: "728", h: "90" }, defaultMobile: { w: "300", h: "250" } },
    { id: "posts_top", name: "Posts (Top)", defaultDesktop: { w: "728", h: "90" }, defaultMobile: { w: "300", h: "250" } },
    { id: "posts_bottom", name: "Posts (Bottom)", defaultDesktop: { w: "728", h: "90" }, defaultMobile: { w: "300", h: "250" } },
    { id: "sidebar_1", name: "Sidebar-1", defaultDesktop: { w: "300", h: "250" }, defaultMobile: { w: "300", h: "250" } },
    { id: "sidebar_2", name: "Sidebar-2", defaultDesktop: { w: "300", h: "600" }, defaultMobile: { w: "300", h: "250" } },
    { id: "in_article_1", name: "In-Article-1", defaultDesktop: { w: "728", h: "90" }, defaultMobile: { w: "300", h: "250" } },
    { id: "in_article_2", name: "In-Article-2", defaultDesktop: { w: "728", h: "90" }, defaultMobile: { w: "300", h: "250" } },
  ];


