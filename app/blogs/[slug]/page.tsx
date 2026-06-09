import { notFound } from "next/navigation";
import { getBlogBySlugAction } from "../../actions/blogs";
import BlogContentRenderer from "@/components/BlogContentRenderer";

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
  
  return <BlogContentRenderer blog={result.blog as any} />;
}
