export function formatBlogDate(date: Date | string | null | undefined): string {
  if (!date) return "Recently";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function calculateReadTime(content: string | null | undefined): string {
  if (!content) return "3 min read";
  const plainText = content.replace(/<[^>]*>/g, " ").trim();
  const words = plainText ? plainText.split(/\s+/).length : 0;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

// Color palette mapping for categories
export const CATEGORY_COLORS: Record<string, { bg: string; text: string; full: string }> = {
  "part-time-income": { bg: "bg-emerald-600", text: "text-emerald-600", full: "bg-emerald-600 text-white" },
  "share-market": { bg: "bg-blue-600", text: "text-blue-600", full: "bg-blue-600 text-white" },
  "ai-prompts": { bg: "bg-indigo-600", text: "text-indigo-600", full: "bg-indigo-600 text-white" },
  "carrer-jobs": { bg: "bg-violet-600", text: "text-violet-600", full: "bg-violet-600 text-white" },
  "youtube-growth": { bg: "bg-red-600", text: "text-red-600", full: "bg-red-600 text-white" },
  "instagram": { bg: "bg-pink-600", text: "text-pink-600", full: "bg-pink-600 text-white" },
  "mobile-hacks": { bg: "bg-cyan-600", text: "text-cyan-600", full: "bg-cyan-600 text-white" },
  "ai-tools": { bg: "bg-purple-600", text: "text-purple-600", full: "bg-purple-600 text-white" },
  "marketing": { bg: "bg-amber-600", text: "text-amber-600", full: "bg-amber-600 text-white" },
  "startup-ideas": { bg: "bg-orange-600", text: "text-orange-600", full: "bg-orange-600 text-white" },
  "technology": { bg: "bg-teal-600", text: "text-teal-600", full: "bg-teal-600 text-white" },
  "apps-websites": { bg: "bg-sky-600", text: "text-sky-600", full: "bg-sky-600 text-white" },
  "facebook": { bg: "bg-blue-700", text: "text-blue-700", full: "bg-blue-700 text-white" },
  "editing": { bg: "bg-rose-600", text: "text-rose-600", full: "bg-rose-600 text-white" },
  "govt-jobs-updates": { bg: "bg-yellow-600", text: "text-yellow-600", full: "bg-yellow-600 text-white" },
  "files-materials": { bg: "bg-zinc-700", text: "text-zinc-700", full: "bg-zinc-700 text-white" },
  "internships": { bg: "bg-lime-600", text: "text-lime-600", full: "bg-lime-600 text-white" },
  "scholarships": { bg: "bg-fuchsia-600", text: "text-fuchsia-600", full: "bg-fuchsia-600 text-white" },
  "current-affairs": { bg: "bg-amber-700", text: "text-amber-700", full: "bg-amber-700 text-white" },
};

export function getCategoryBadge(categorySlug?: string, categoryName?: string) {
  const slug = categorySlug || "news";
  const label = categoryName || "Students Hub";
  const colorObj = CATEGORY_COLORS[slug] || { bg: "bg-blue-600", text: "text-blue-600", full: "bg-blue-600 text-white" };

  return {
    label,
    color: colorObj.bg,
    colorClass: colorObj.full,
  };
}

export function extractBlogCategory(blog: any): { slug: string; name: string } {
  if (blog?.tags && Array.isArray(blog.tags)) {
    // Look for parent tag first (parentId: null)
    const parentTag = blog.tags.find((bt: any) => bt.tag && !bt.tag.parentId);
    if (parentTag?.tag) {
      return { slug: parentTag.tag.slug, name: parentTag.tag.name };
    }
    // Fallback to first tag
    if (blog.tags[0]?.tag) {
      return { slug: blog.tags[0].tag.slug, name: blog.tags[0].tag.name };
    }
  }
  return { slug: "general", name: "News" };
}
