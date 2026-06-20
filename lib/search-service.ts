import { prisma } from "@/lib/prisma";

export interface BlogSearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImg: string | null;
  createdAt: Date;
  rank: number;
  categorySlug: string;
  categoryName: string;
}

/**
 * Searches the Blog table using PostgreSQL Full Text Search.
 * Uses the database function `search_blogs(search_term text)`.
 * 
 * @param searchTerm The term(s) to search for
 * @param limit Maximum number of results to return (default 10)
 * @returns Array of blog search results with their matched categories
 */
export async function searchBlogs(
  searchTerm: string,
  limit: number = 10
): Promise<BlogSearchResult[]> {
  const query = searchTerm?.trim();
  if (!query) {
    return [];
  }

  try {
    // 1. Fetch full-text search results from PostgreSQL
    const rawFtsResults = await prisma.$queryRaw<any[]>`
      SELECT 
        id, 
        title, 
        slug, 
        excerpt, 
        "featuredImg", 
        "createdAt", 
        rank 
      FROM search_blogs(${query})
    `;

    // 2. Fetch tags matching the search term (contains, case-insensitive)
    // We match the full query, or any of the individual words in it
    const searchWords = query.split(/\s+/).filter((word) => word.length >= 2);
    const tagConditions = [
      { name: { contains: query, mode: "insensitive" as const } },
      ...searchWords.map((word) => ({
        name: { contains: word, mode: "insensitive" as const },
      })),
    ];

    const matchedTags = await prisma.tag.findMany({
      where: {
        OR: tagConditions,
      },
      select: {
        blogs: {
          select: {
            blog: {
              select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                featuredImg: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    // 3. Merge FTS and Tag-matched results
    // We use a Map to merge by Blog ID and manage ranking boosts
    const mergedMap = new Map<string, {
      id: string;
      title: string;
      slug: string;
      excerpt: string | null;
      featuredImg: string | null;
      createdAt: Date;
      rank: number;
    }>();

    // Add FTS results to the map
    if (rawFtsResults && rawFtsResults.length > 0) {
      for (const item of rawFtsResults) {
        mergedMap.set(item.id, {
          id: item.id,
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt,
          featuredImg: item.featuredImg,
          createdAt: new Date(item.createdAt),
          rank: Number(item.rank),
        });
      }
    }

    // Process tag-matched blogs
    for (const tag of matchedTags) {
      for (const relation of tag.blogs) {
        const blog = relation.blog;
        if (!blog) continue;

        const existing = mergedMap.get(blog.id);
        if (existing) {
          // If already matched by FTS, boost the rank (since it matches both text and tags)
          existing.rank = Math.max(existing.rank + 0.5, 0.95);
        } else {
          // Tag match only gets a solid high base rank (0.85) to appear prominently
          mergedMap.set(blog.id, {
            id: blog.id,
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            featuredImg: blog.featuredImg,
            createdAt: new Date(blog.createdAt),
            rank: 0.85,
          });
        }
      }
    }

    const combinedList = Array.from(mergedMap.values());

    if (combinedList.length === 0) {
      return [];
    }

    // Sort by rank descending, then by creation date descending
    combinedList.sort((a, b) => {
      if (Math.abs(b.rank - a.rank) > 0.0001) {
        return b.rank - a.rank;
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    // Take the top results up to the limit
    const topResults = combinedList.slice(0, limit);
    const topIds = topResults.map((r) => r.id);

    // 4. Fetch the categories/tags of the top results to resolve their links correctly
    const blogsWithTags = await prisma.blog.findMany({
      where: {
        id: { in: topIds },
      },
      select: {
        id: true,
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
                parentId: true,
              },
            },
          },
        },
      },
    });

    const tagsLookup = new Map(
      blogsWithTags.map((item) => [item.id, item.tags])
    );

    // Map the results to their final return schema
    return topResults.map((r) => {
      const blogTags = tagsLookup.get(r.id) || [];
      
      // Find the primary category tag (a tag with parentId = null)
      const primaryBlogTag = 
        blogTags.find((bt) => bt.tag && bt.tag.parentId === null) || 
        blogTags[0];

      const categorySlug = primaryBlogTag?.tag?.slug || "general";
      const categoryName = primaryBlogTag?.tag?.name || "General";

      return {
        id: r.id,
        title: r.title,
        slug: r.slug,
        excerpt: r.excerpt,
        featuredImg: r.featuredImg,
        createdAt: r.createdAt,
        rank: r.rank,
        categorySlug,
        categoryName,
      };
    });
  } catch (error) {
    console.error("Error executing search with tags:", error);
    throw error;
  }
}
