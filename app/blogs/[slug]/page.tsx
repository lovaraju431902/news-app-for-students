import { notFound } from "next/navigation";
import { getBlogBySlugAction } from "../../actions/blogs";
import BlogContentRenderer from "@/components/BlogContentRenderer";
import { getAccessLevel } from "@/lib/subscription/access";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const result = await getBlogBySlugAction(slug);
  
  if (!result.success || !result.blog) {
    notFound();
  }

  const blog = result.blog;
  const access = await getAccessLevel();
  const isLocked = Boolean(blog.isPremium && !access.hasActiveSubscription);
  
  return (
    <BlogContentRenderer
      blog={blog as any}
      isLocked={isLocked}
      currentPath={`/blogs/${slug}`}
      isAuthenticated={access.isAuthenticated}
    />
  );
}
