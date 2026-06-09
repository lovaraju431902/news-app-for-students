import { notFound } from "next/navigation";
import { getBlogBySlugAction } from "../../actions/blogs";
import BlogContentRenderer from "@/components/BlogContentRenderer";

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { category, slug } = await params;

  const result = await getBlogBySlugAction(slug);

  if (!result.success || !result.blog) {
    notFound();
  }

  const blog = result.blog;

  // Verify that the blog has a root/parent tag matching the category parameter in the URL
  const matchesCategory = blog.tags.some(
    (bt: any) => bt.tag && !bt.tag.parentId && bt.tag.slug === category
  );

  if (!matchesCategory) {
    notFound();
  }

  return <BlogContentRenderer blog={blog as any} />;
}
