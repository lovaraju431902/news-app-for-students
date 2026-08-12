"use client";

import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  FileText,
  Eye,
  Code2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowLeft,
  Settings,
  Flame,
  Globe,
  Plus,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  getTagsAction,
  createTagAction,
  createBlogAction,
  getBlogByIdAction,
  updateBlogAction,
  seedMainCategoriesAction
} from "@/app/actions/blogs";
import { MediaPicker } from "@/components/ui/media-picker";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const MAIN_CATEGORY_SLUGS = [
  "part-time-income",
  "share-market",
  "ai-prompts",
  "carrer-jobs",
  "youtube-growth",
  "instagram",
  "mobile-hacks",
  "ai-tools",
  "marketing",
  "startup-ideas",
  "technology",
  "apps-websites",
  "facebook",
  "editing",
  "govt-jobs-updates",
  "files-materials",
  "internships",
  "scholarships",
  "current-affairs"
];

// Dynamically import editor with SSR disabled
const RichEditor = dynamic(() => import("@/components/RichEditor/Editor"), {
  ssr: false,
});

const INITIAL_CONTENT = `
<h1>The Future of Antigravity Web Architectures</h1>
<p>In the rapidly evolving landscape of modern web development, creating rich, interactive, and responsive user interfaces has transitioned from being a premium differentiator to an absolute standard. As frameworks iterate, the boundary between editing content and previewing it continues to dissolve.</p>

<div class="side-by-side-wrapper my-6 overflow-hidden">
  <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80" data-width="48" data-alignment="left" alt="News room workspace" />
  <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80" data-width="48" data-alignment="left" alt="Space tech image" />
</div>
<p style="clear: both;">Above are two side-by-side images. Setting both of their alignments to left and their widths to 48% allows them to stack horizontally. We clear floats afterward to continue reading.</p>

<blockquote>"True styling is not about decorating text; it is about structuring information so that it speaks to the user intuitively."</blockquote>

<h2>Rich Video Streaming & Portrait Shorts</h2>
<p>You can embed video clips with customizable dimensions, layouts, and custom thumbnails. Below are sample videos (a landscape video centered, and a portrait shorts video floated left):</p>

<div data-custom-video="" data-src="https://www.youtube.com/watch?v=aqz-KE-bpKQ" data-thumbnail="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" data-video-type="long" data-width="80" data-alignment="center" class="my-6 overflow-hidden rounded-lg mx-auto" style="width: 80%;">
  <iframe src="https://www.youtube.com/embed/aqz-KE-bpKQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" class="w-full aspect-video block object-cover bg-black border-0 rounded-lg"></iframe>
</div>

<div data-custom-video="" data-src="https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-in-a-futuristic-city-38991-large.mp4" data-thumbnail="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80" data-video-type="shorts" data-width="35" data-alignment="left" class="my-6 overflow-hidden rounded-lg float-left mr-6 mb-4" style="width: 35%;">
  <video src="https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-in-a-futuristic-city-38991-large.mp4" poster="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80" controls="" class="w-full aspect-[9/16] max-w-[320px] mx-auto block object-cover bg-black"></video>
</div>

<p>The vertical video on the left represents a <strong>Shorts layout</strong>. It behaves like a floated element, so paragraphs wrap around it. The video features a custom thumbnail loaded dynamically from an external URL, and can be played directly inside the preview layout. You can clear floats after to reset column alignments.</p>

<h2 style="clear: both;">Interactive Code Blocks in Preview</h2>
<p>Using our custom code block integration, developers can showcase beautiful syntax-highlighted code snippets directly inside articles. The following snippet illustrates how code is rendered in the preview column:</p>

<pre><code class="language-tsx">import React from "react";
 
function HelloWorld() {
  return (
    &lt;div className="p-4 rounded-lg bg-primary text-primary-foreground"&gt;
      &lt;h1&gt;Hello, World!&lt;/h1&gt;
      &lt;p&gt;This is a simple React component.&lt;/p&gt;
    &lt;/div&gt;
  );
}
 
export default HelloWorld;</code></pre>

<p>Try testing it yourself! Insert links, apply bold, italic, or blockquote formatting, and look at the live preview below or on the side to see the formatting reflect in real-time.</p>
`;

function preprocessHtmlContent(html: string): string {
  if (!html) return html;
  const fontSizeRegex = /font-size\s*:\s*([\d\.]+(?:px|pt|em|rem|%|vw|vh))/gi;
  return html.replace(fontSizeRegex, (match, val) => {
    return `--original-font-size: ${val}; font-size: min(var(--original-font-size), max(14px, calc(var(--original-font-size) * var(--inline-font-scale, 1))))`;
  });
}

function renderContentWithCodeBlocks(htmlContent: string) {
  const regex = /<pre([^>]*)><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  const decodeHtml = (html: string) => {
    return html
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
  };

  let keyIndex = 0;
  while ((match = regex.exec(htmlContent)) !== null) {
    const matchIndex = match.index;

    if (matchIndex > lastIndex) {
      elements.push(
        <div
          key={`text-${keyIndex++}`}
          dangerouslySetInnerHTML={{ __html: preprocessHtmlContent(htmlContent.substring(lastIndex, matchIndex)) }}
        />
      );
    }

    const attrs = (match[1] || "") + " " + (match[2] || "");
    const langMatch = /class="[^"]*(?:lang|language)-([^"\s]*)/.exec(attrs);
    const lang = langMatch ? langMatch[1] : "tsx";

    const codeText = decodeHtml(match[3]);
    const isTsxDemo = codeText.includes("HelloWorld");

    elements.push(
      <div key={`code-${keyIndex++}`} className="w-full max-w-3xl my-6 font-sans">
        <CodeBlock
          code={codeText}
          language={lang}
          title={isTsxDemo ? "HelloWorld.tsx" : lang ? `code.${lang === "typescript" ? "ts" : lang === "javascript" ? "js" : lang}` : "snippet"}
          showLineNumbers={true}
          highlightLines={isTsxDemo ? [6] : []}
          variant="terminal"
        />
      </div>
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < htmlContent.length) {
    elements.push(
      <div
        key={`text-${keyIndex++}`}
        dangerouslySetInnerHTML={{ __html: preprocessHtmlContent(htmlContent.substring(lastIndex)) }}
      />
    );
  }

  return elements;
}

function RichEditorPageContent() {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "both">("both");
  const [fontFamily, setFontFamily] = useState<"serif" | "sans">("serif");
  const [stats, setStats] = useState({ words: 0, characters: 0, readTime: 0 });
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [showStyleControls, setShowStyleControls] = useState(true);

  // Publishing & Metadata States
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImg, setFeaturedImg] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [mainCategoryId, setMainCategoryId] = useState<string>("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [newTagParentId, setNewTagParentId] = useState("");
  const [publishMessage, setPublishMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const keywordList = seoKeywords ? seoKeywords.split(",").map(k => k.trim()).filter(Boolean) : [];

  const removeKeyword = (kwToRemove: string) => {
    const newList = keywordList.filter(k => k !== kwToRemove);
    setSeoKeywords(newList.join(", "));
  };

  const addKeyword = (newKw: string) => {
    const trimmed = newKw.trim();
    if (!trimmed) return;
    const parts = trimmed.split(",").map(p => p.trim()).filter(Boolean);
    const updated = Array.from(new Set([...keywordList, ...parts]));
    setSeoKeywords(updated.join(", "));
  };

  const handleAutoGenerateKeywords = () => {
    const keywordsSet = new Set<string>();

    if (title.trim()) {
      const cleanTitle = title.replace(/[^\w\s-]/g, "").toLowerCase();
      keywordsSet.add(cleanTitle.trim());

      const words = cleanTitle.split(/\s+/).filter(w => w.length > 3);
      words.forEach(w => keywordsSet.add(w));
    }

    if (mainCategoryId) {
      const cat = dbTags.find(t => t.id === mainCategoryId);
      if (cat) {
        keywordsSet.add(cat.name.toLowerCase());
      }
    }

    if (title.toLowerCase().includes("earn") || title.toLowerCase().includes("money") || title.toLowerCase().includes("income") || title.toLowerCase().includes("instagram")) {
      keywordsSet.add("how to earn money");
      keywordsSet.add("earn money online");
      keywordsSet.add("earning tips");
      keywordsSet.add("instagram money");
      keywordsSet.add("earn from instagram");
    }
    if (title.toLowerCase().includes("telugu") || title.toLowerCase().includes("student")) {
      keywordsSet.add("telugu students");
      keywordsSet.add("earning tips for telugu students");
    }

    const merged = Array.from(keywordsSet);
    setSeoKeywords(merged.join(", "));
  };

  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [isEditMode, setIsEditMode] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      await seedMainCategoriesAction();
      const result = await getTagsAction();
      if (!result.success) throw new Error(result.error || "Failed to load tags.");
      return result.tags || [];
    },
  });

  const dbTags = tagsData || [];

  const { data: blogToEdit } = useQuery({
    queryKey: ["blog-edit", editId],
    queryFn: async () => {
      if (!editId) return null;
      const res = await getBlogByIdAction(editId);
      if (!res.success) throw new Error(res.error || "Failed to load blog.");
      return res.blog;
    },
    enabled: !!editId,
  });

  useEffect(() => {
    if (blogToEdit) {
      setTitle(blogToEdit.title);
      setSlug(blogToEdit.slug);
      setExcerpt(blogToEdit.excerpt || "");
      setFeaturedImg(blogToEdit.featuredImg || "");
      setContent(blogToEdit.content);
      setSeoKeywords((blogToEdit as any).seoKeywords || "");

      const blogTagIds = blogToEdit.tags.map((bt: any) => bt.tagId);
      const mainTag = blogToEdit.tags.find((bt: any) =>
        bt.tag && !bt.tag.parentId && MAIN_CATEGORY_SLUGS.includes(bt.tag.slug)
      );

      if (mainTag) {
        setMainCategoryId(mainTag.tagId);
        const subTagIds = blogToEdit.tags
          .filter((bt: any) => bt.tagId !== mainTag.tagId)
          .map((bt: any) => bt.tagId);
        setSelectedTagIds(subTagIds);
      } else {
        setMainCategoryId("");
        setSelectedTagIds(blogTagIds);
      }
      setIsEditMode(true);
    } else if (!editId) {
      setIsEditMode(false);
      setTitle("");
      setSlug("");
      setExcerpt("");
      setFeaturedImg("");
      setContent(INITIAL_CONTENT);
      setSeoKeywords("");
      setMainCategoryId("");
      setSelectedTagIds([]);
    }
  }, [blogToEdit, editId]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    const generatedSlug = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(generatedSlug);
  };

  const handleAutoFillTitle = () => {
    const h1Match = /<h1[^>]*>(.*?)<\/h1>/i.exec(content);
    if (h1Match) {
      const plainTitle = h1Match[1].replace(/<[^>]*>/g, "").trim();
      handleTitleChange(plainTitle);
    }
  };

  const createTagMutation = useMutation({
    mutationFn: async (tagName: string) => {
      if (!tagName.trim() || !mainCategoryId) return;
      const res = await createTagAction(tagName, mainCategoryId);
      if (!res.success) throw new Error(res.error || "Failed to create tag.");
      return res.tag;
    },
    onSuccess: (newTag) => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
      if (newTag) {
        setSelectedTagIds((prev) => [...prev, newTag.id]);
      }
      setNewTagName("");
    },
    onError: (err: any) => {
      alert(err.message || "Failed to create tag.");
    },
  });

  const handleCreateTag = () => {
    createTagMutation.mutate(newTagName);
  };

  const publishMutation = useMutation({
    mutationFn: async () => {
      if (!title.trim()) throw new Error("Please enter a blog title.");
      if (!slug.trim()) throw new Error("Please enter a slug.");
      if (!content.trim()) throw new Error("Blog content is empty.");
      if (!mainCategoryId) throw new Error("Please select a compulsory Main Category.");

      const tagIds = [mainCategoryId, ...selectedTagIds].filter(Boolean);

      let res;
      if (isEditMode && editId) {
        res = await updateBlogAction(editId, {
          title,
          slug,
          content,
          excerpt,
          featuredImg,
          tagIds,
          seoKeywords,
        });
      } else {
        res = await createBlogAction({
          title,
          slug,
          content,
          excerpt,
          featuredImg,
          tagIds,
          seoKeywords,
        });
      }

      if (!res.success) throw new Error(res.error || "Failed to save blog post.");
      return res.blog;
    },
    onSuccess: (blog) => {
      if (blog) {
        setPublishedId(blog.id);
      }
      setPublishMessage({
        type: "success",
        text: isEditMode
          ? "Blog post updated successfully!"
          : "Blog post published successfully!"
      });
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onError: (err: any) => {
      setPublishMessage({ type: "error", text: err.message });
    },
  });

  const handlePublish = () => {
    setPublishMessage(null);
    setPublishedId(null);
    publishMutation.mutate();
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        if (activeTab === "both") {
          setActiveTab("edit");
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

  useEffect(() => {
    const cleanText = content
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const words = cleanText ? cleanText.split(" ").length : 0;
    const characters = cleanText.length;
    const readTime = Math.max(1, Math.ceil(words / 200));

    setStats({ words, characters, readTime });
  }, [content]);

  const copyHtmlMarkup = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    } catch (err) {
      console.error("Failed to copy HTML", err);
    }
  };

  const copyJsonRepresentation = async () => {
    try {
      const mockJson = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Rich editor document contents in JSON format." }],
          },
        ],
      };
      await navigator.clipboard.writeText(JSON.stringify(mockJson, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } catch (err) {
      console.error("Failed to copy JSON", err);
    }
  };

  const loadSample = () => {
    setContent(INITIAL_CONTENT);
  };

  const clearEditor = () => {
    setContent("");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">

      {/* HEADER BAR */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-600 dark:text-zinc-400"
            title="Back to Admin Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/10 text-blue-500 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                Publishing Tool
              </span>
              <span className="flex items-center gap-1 text-xs text-amber-500 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full">
                <Flame className="w-3 h-3" /> Live Sync
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight mt-0.5 text-zinc-900 dark:text-white">
              NewsRoom Article Composer
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={loadSample}
            className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            Load Sample
          </button>

          <button
            type="button"
            onClick={clearEditor}
            className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-500" />
            Reset Editor
          </button>

          <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 self-center hidden sm:block mx-1" />

          {/* HTML Copy Button */}
          <button
            type="button"
            onClick={copyHtmlMarkup}
            className="px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-blue-500/15"
          >
            {copiedHtml ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                Copied HTML!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy HTML Markup
              </>
            )}
          </button>

          {/* Publish Settings Sheet Drawer */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-500/15"
              >
                <Globe className="w-3.5 h-3.5" />
                Publish Settings
              </button>
            </SheetTrigger>

            <SheetContent className="w-full sm:w-[480px] sm:max-w-[480px] overflow-y-auto border-l border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-950 p-6 flex flex-col gap-6 font-sans">
              <SheetHeader className="p-0 border-b border-zinc-100 dark:border-zinc-850 pb-4">
                <SheetTitle className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-500" />
                  Publishing Settings
                </SheetTitle>
                <SheetDescription className="text-xs text-zinc-400">
                  Configure article metadata, tags, SEO keywords, and publish instantly.
                </SheetDescription>
              </SheetHeader>

              {/* Form Content */}
              <div className="space-y-4 flex-1">
                {/* Title and Auto Fill */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Blog Title
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoFillTitle}
                      className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-0.5"
                    >
                      <Sparkles className="w-3 h-3" />
                      Auto-fill from H1
                    </button>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter blog title"
                    className="w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-850 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Slug (URL Slug)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. future-of-web-dev"
                    className="w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-850 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Featured Image */}
                <div className="space-y-1.5">
                  <MediaPicker
                    label="Featured Image (.WebP)"
                    type="image"
                    value={featuredImg}
                    onChange={(url) => setFeaturedImg(url)}
                    placeholder="Click or drag featured image (Auto-converted to .WebP)"
                    helperText="High-performance .WebP format with lazy loading for fast page speeds."
                  />
                </div>

                {/* Excerpt */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Excerpt / Summary
                  </label>
                  <textarea
                    rows={3}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Write a brief article description..."
                    className="w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-850 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* SEO Keywords Tag Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      SEO Keywords / Meta Tags
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoGenerateKeywords}
                      className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-0.5"
                    >
                      <Sparkles className="w-3 h-3" />
                      Auto-generate
                    </button>
                  </div>

                  {keywordList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 p-2 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-900/10">
                      {keywordList.map((kw, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-blue-100/50 dark:border-blue-900/30"
                        >
                          {kw}
                          <button
                            type="button"
                            onClick={() => removeKeyword(kw)}
                            className="hover:text-red-500 font-bold ml-0.5 transition-colors focus:outline-none"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Type keyword and press Enter or use commas..."
                    className="w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-850 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        const val = e.currentTarget.value;
                        if (val) {
                          addKeyword(val);
                          e.currentTarget.value = "";
                        }
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.currentTarget.value;
                      if (val) {
                        addKeyword(val);
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                  <span className="text-[10px] text-zinc-400 block leading-normal">
                    Enter keywords separated by commas or press Enter.
                  </span>
                </div>

                {/* Database Tags selection */}
                <div className="space-y-4">
                  {/* Compulsory Main Category Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                      Main Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={mainCategoryId}
                      onChange={(e) => {
                        const newMainId = e.target.value;
                        setMainCategoryId(newMainId);
                        const newMainTag = dbTags.find(t => t.id === newMainId);
                        const childIds = newMainTag?.children?.map((c: any) => c.id) || [];
                        setSelectedTagIds(prev => prev.filter(id => childIds.includes(id)));
                      }}
                      className="w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-850 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Select Main Category --</option>
                      {dbTags
                        .filter(t => !t.parentId && MAIN_CATEGORY_SLUGS.includes(t.slug))
                        .map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Subtags selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                      Select Subtags
                    </label>

                    {!mainCategoryId ? (
                      <div className="text-xs text-zinc-500 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50 dark:bg-zinc-900/40 text-center">
                        Please select a Main Category first to view or add subtags.
                      </div>
                    ) : (() => {
                      const selectedMainTag = dbTags.find(t => t.id === mainCategoryId);
                      const childTags = selectedMainTag?.children || [];

                      if (childTags.length === 0) {
                        return (
                          <div className="text-xs text-zinc-500 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50 dark:bg-zinc-900/40 text-center">
                            No subtags created under "{selectedMainTag?.name}" yet.
                          </div>
                        );
                      }

                      return (
                        <div className="max-h-[160px] overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 space-y-2 bg-zinc-50/50 dark:bg-zinc-900/30">
                          {childTags.map((child: any) => {
                            const isChildSelected = selectedTagIds.includes(child.id);
                            return (
                              <label key={child.id} className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={isChildSelected}
                                  onChange={() => {
                                    setSelectedTagIds(prev =>
                                      prev.includes(child.id)
                                        ? prev.filter(id => id !== child.id)
                                        : [...prev, child.id]
                                    );
                                  }}
                                  className="rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                                />
                                <span className="text-xs text-zinc-800 dark:text-zinc-200">
                                  {child.name}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Create Tag Inline Panel */}
                  {mainCategoryId && (
                    <div className="border-t border-zinc-200 dark:border-zinc-850 pt-4 space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                        Create New Subtag under "{dbTags.find(t => t.id === mainCategoryId)?.name}"
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Subtag Name"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          className="flex-1 px-3 py-1.5 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={handleCreateTag}
                          disabled={createTagMutation.isPending}
                          className="px-4 py-1.5 bg-zinc-900 dark:bg-zinc-800 text-white rounded-lg text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center shrink-0 disabled:opacity-50 gap-1"
                        >
                          {createTagMutation.isPending ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              Add Subtag
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Publish trigger and feedback alerts */}
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-850 flex flex-col gap-3 mt-4">
                  {publishMessage && (
                    <div className={cn(
                      "p-3.5 rounded-xl text-xs font-medium border flex flex-col gap-1.5",
                      publishMessage.type === "success"
                        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/5 border-rose-500/20 text-rose-600 dark:text-rose-400"
                    )}>
                      <span>{publishMessage.text}</span>
                      {publishMessage.type === "success" && (
                        <div className="flex gap-2 mt-1">
                          {publishedId && (() => {
                            const categorySlug = dbTags.find(t => t.id === mainCategoryId)?.slug || "uncategorized";
                            return (
                              <Link
                                href={`/${categorySlug}/${slug}`}
                                className="text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors inline-block"
                              >
                                View Live Post
                              </Link>
                            );
                          })()}
                          <Link
                            href="/admin"
                            className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 px-3 py-1.5 rounded-lg transition-colors inline-block"
                          >
                            Go to Dashboard
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={publishMutation.isPending}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10"
                  >
                    {publishMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {isEditMode ? "Updating..." : "Publishing..."}
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4" />
                        {isEditMode ? "Update Blog Post" : "Publish Blog Post"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

        </div>
      </header>

      {/* WORKSPACE AREA */}
      <main className="flex-1 flex flex-col p-4 lg:p-6 max-w-[1600px] w-full mx-auto gap-4">

        {/* VIEW SEGMENT BAR (For Responsive screens) */}
        <div className="flex items-center justify-between bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl shadow-sm">
          {/* Stats indicators */}
          <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              <strong>{stats.words}</strong> words
            </span>
            <span className="hidden sm:inline-block">|</span>
            <span className="hidden sm:flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              <strong>{stats.characters}</strong> chars
            </span>
            <span>|</span>
            <span>Est. read: <strong>{stats.readTime}</strong> min</span>
          </div>

          {/* View Toggles & Font settings */}
          <div className="flex items-center gap-3">
            {/* Typography Controls Toggle */}
            <button
              type="button"
              onClick={() => setShowStyleControls(!showStyleControls)}
              className={`p-2 border rounded-lg transition-colors flex items-center justify-center ${showStyleControls
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-500"
                  : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200/50 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                }`}
              title="Toggle Typography Adjustment Panel"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            {/* Font Toggle */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
              <button
                type="button"
                onClick={() => setFontFamily("serif")}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold font-serif transition-colors ${fontFamily === "serif"
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-blue-500"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-800"
                  }`}
                title="Serif Font Preview"
              >
                Serif
              </button>
              <button
                type="button"
                onClick={() => setFontFamily("sans")}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold font-sans transition-colors ${fontFamily === "sans"
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-blue-500"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-800"
                  }`}
                title="Sans-serif Font Preview"
              >
                Sans
              </button>
            </div>

            {/* Layout Toggles (Visible on desktop) */}
            <div className="hidden lg:flex items-center bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors ${activeTab === "edit"
                  ? "bg-white dark:bg-zinc-850 shadow-sm text-blue-500"
                  : "text-zinc-600 dark:text-zinc-400"
                  }`}
              >
                Editor Only
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("both")}
                className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors ${activeTab === "both"
                  ? "bg-white dark:bg-zinc-850 shadow-sm text-blue-500"
                  : "text-zinc-600 dark:text-zinc-400"
                  }`}
              >
                Split View
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors ${activeTab === "preview"
                  ? "bg-white dark:bg-zinc-850 shadow-sm text-blue-500"
                  : "text-zinc-600 dark:text-zinc-400"
                  }`}
              >
                Preview Only
              </button>
            </div>

            {/* Layout Toggles (Visible on mobile/tablet) */}
            <div className="lg:hidden flex items-center bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${activeTab === "edit"
                  ? "bg-white dark:bg-zinc-850 shadow-sm text-blue-500"
                  : "text-zinc-600 dark:text-zinc-400"
                  }`}
              >
                Editor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${activeTab === "preview"
                  ? "bg-white dark:bg-zinc-850 shadow-sm text-blue-500"
                  : "text-zinc-600 dark:text-zinc-400"
                  }`}
              >
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* DYNAMIC TYPOGRAPHY CONTROLS (Font Size & Line Height) */}
        {showStyleControls && (
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-6 py-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Typography Settings
                </h3>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  Dynamically adjust content font size and line-spacing for the editor & live preview.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 flex-1 justify-end">
              <div className="flex items-center gap-3 min-w-[200px] flex-1 sm:flex-initial">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 select-none w-18 shrink-0">Text Size:</span>
                <input
                  type="range"
                  min="12"
                  max="32"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <span className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-300 w-10 text-right shrink-0">{fontSize}px</span>
              </div>

              <div className="flex items-center gap-3 min-w-[200px] flex-1 sm:flex-initial">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 select-none w-18 shrink-0">Line Height:</span>
                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <span className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-300 w-8 text-right shrink-0">{lineHeight}</span>
              </div>
            </div>
          </div>
        )}

        {/* WORKSPACE PANELS */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 items-stretch">

          {/* EDITOR COLUMN */}
          {(activeTab === "edit" || activeTab === "both") && (
            <div className={`flex flex-col h-full ${activeTab === "edit" ? "lg:col-span-2" : ""}`}>
              <div className="flex items-center gap-2 mb-2 ml-1">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Rich Text Workspace
                </span>
              </div>
              <RichEditor
                content={content}
                onChange={setContent}
                fontSize={fontSize}
                lineHeight={lineHeight}
              />
            </div>
          )}

          {/* LIVE PREVIEW COLUMN */}
          {(activeTab === "preview" || activeTab === "both") && (
            <div className={`flex flex-col h-full ${activeTab === "preview" ? "lg:col-span-2" : ""}`}>
              <div className="flex items-center justify-between mb-2 ml-1">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Live Article View
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 flex items-center gap-1 font-mono">
                  <Settings className="w-3 h-3" /> Styles Applied
                </span>
              </div>

              {/* Mock Newspaper Layout */}
              <div className="flex-1 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl p-8 overflow-y-auto max-h-[750px] shadow-sm select-text">
                <div
                  className={`max-w-3xl mx-auto ${fontFamily === "serif" ? "font-serif" : "font-sans"
                    }`}
                >
                  <div className="border-b-2 border-zinc-900 dark:border-zinc-800 pb-4 mb-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2">
                      <span>World News</span>
                      <span>•</span>
                      <span>Technology</span>
                    </div>
                    <div className="text-xs text-zinc-400 dark:text-zinc-400">
                      Published by Students Voice Editorial
                    </div>
                  </div>

                  <div
                    style={{
                      "--editor-line-height": lineHeight,
                      "--editor-font-size": `${fontSize}px`,
                    } as React.CSSProperties}
                    className="article-preview-content prose max-w-none text-zinc-800 dark:text-zinc-200 leading-relaxed
                      [&_h1]:[font-size:calc(var(--responsive-font-size,16px)*1.875)]
                      [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-4 [&_h1]:tracking-tight [&_h1]:text-zinc-900 [&_h1]:dark:text-white
                      [&_h2]:[font-size:calc(var(--responsive-font-size,16px)*1.5)]
                      [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-zinc-900 [&_h2]:dark:text-zinc-100
                      [&_h3]:[font-size:calc(var(--responsive-font-size,16px)*1.25)]
                      [&_h3]:font-bold [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-zinc-800 [&_h3]:dark:text-zinc-200
                      [&_p]:mb-5 [&_p]:[font-size:var(--responsive-font-size,16px)] [&_p]:[line-height:var(--editor-line-height,1.6)]
                      [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:py-3.5 [&_blockquote]:px-5 [&_blockquote]:rounded-r-xl [&_blockquote]:bg-blue-50/50 [&_blockquote]:dark:bg-blue-950/20 [&_blockquote]:italic [&_blockquote]:my-5 [&_blockquote]:text-zinc-600 [&_blockquote]:dark:text-zinc-350 [&_blockquote]:[font-size:calc(var(--responsive-font-size,16px)*1.125)] [&_blockquote]:[line-height:var(--editor-line-height,1.6)]
                      [&_.callout-box]:[font-size:var(--responsive-font-size,16px)] [&_.callout-box]:[line-height:var(--editor-line-height,1.6)]
                      [&_mark]:px-1 [&_mark]:py-0.5 [&_mark]:rounded-md
                      [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:space-y-1
                      [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:space-y-1
                      [&_li]:text-zinc-800 [&_li]:dark:text-zinc-350 [&_li]:[font-size:var(--responsive-font-size,16px)] [&_li]:[line-height:var(--editor-line-height,1.6)]
                      [&_a]:text-blue-500 [&_a]:hover:text-blue-600 [&_a]:underline [&_a]:transition-colors
                      [&_code]:bg-zinc-100 [&_code]:dark:bg-zinc-900 [&_code]:text-red-500 [&_code]:dark:text-red-400 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm
                      [&_img]:rounded-lg [&_img]:border [&_img]:border-zinc-200 [&_img]:dark:border-zinc-800 [&_img]:my-6
                      [&_img[data-alignment='left']]:float-left 
                      [&_img[data-alignment='left']]:mr-6 
                      [&_img[data-alignment='left']]:mb-4
                      [&_img[data-alignment='right']]:float-right 
                      [&_img[data-alignment='right']]:ml-6 
                      [&_img[data-alignment='right']]:mb-4
                      [&_img[data-alignment='center']]:block 
                      [&_img[data-alignment='center']]:mx-auto 
                      [&_img[data-alignment='center']]:my-6
                      [&_img[data-alignment='center']]:float-none
                      [&_img[data-alignment='center']]:clear-both
                      [&_div[data-custom-video]]:my-6
                      [&_div[data-custom-video][data-alignment='left']]:float-left
                      [&_div[data-custom-video][data-alignment='left']]:mr-6
                      [&_div[data-custom-video][data-alignment='left']]:mb-4
                      [&_div[data-custom-video][data-alignment='right']]:float-right
                      [&_div[data-custom-video][data-alignment='right']]:ml-6
                      [&_div[data-custom-video][data-alignment='right']]:mb-4
                      [&_div[data-custom-video][data-alignment='center']]:block
                      [&_div[data-custom-video][data-alignment='center']]:mx-auto
                      [&_div[data-custom-video][data-alignment='center']]:clear-both
                      [&_video]:rounded-xl [&_video]:border [&_video]:border-zinc-200 [&_video]:dark:border-zinc-800 [&_video]:my-6 [&_video]:shadow-md
                      [&_table]:w-full [&_table]:my-6 [&_table]:border-collapse [&_table]:text-sm
                      [&_th]:p-3 [&_th]:text-left [&_td]:p-3 [&_td]:text-left"
                  >
                    {renderContentWithCodeBlocks(content)}
                  </div>

                  <div className="clear-both pt-8 mt-8 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 text-center font-mono">
                    -- End of Preview Document --
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function RichEditorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-sm font-semibold">Loading Composer...</span>
        </div>
      </div>
    }>
      <RichEditorPageContent />
    </Suspense>
  );
}
