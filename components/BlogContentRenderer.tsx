"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, BookOpen, ArrowLeft } from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";

interface Tag {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImg: string | null;
  createdAt: Date;
  updatedAt: Date;
  tags: {
    tag: Tag;
  }[];
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
          dangerouslySetInnerHTML={{ __html: htmlContent.substring(lastIndex, matchIndex) }}
        />
      );
    }

    const attrs = (match[1] || "") + " " + (match[2] || "");
    const langMatch = /class="[^"]*(?:lang|language)-([^"\s]*)/.exec(attrs);
    const lang = langMatch ? langMatch[1] : "tsx";
    const codeText = decodeHtml(match[3]);

    elements.push(
      <div key={`code-${keyIndex++}`} className="w-full max-w-3xl my-6 font-sans">
        <CodeBlock
          code={codeText}
          language={lang}
          title={lang ? `code.${lang === "typescript" ? "ts" : lang === "javascript" ? "js" : lang}` : "snippet"}
          showLineNumbers={true}
          highlightLines={[]}
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
        dangerouslySetInnerHTML={{ __html: htmlContent.substring(lastIndex) }}
      />
    );
  }

  return elements;
}

const ADMIN_MAPPING: Record<string, { name: string; image: string }> = {
  "part-time-income": {
    name: "Sai Kiran",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353613/create_a_kannada_indian_guy_202606131454_zrxvhu.jpg"
  },
  "share-market": {
    name: "Nikhil Reddy",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353607/create_a_indian_guy_only_202606131454_mxkbx8.jpg"
  },
  "business": {
    name: "Sai Kiran",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353613/create_a_kannada_indian_guy_202606131454_zrxvhu.jpg"
  },
  // "career-jobs": {
  //   name: "Harsha Vardhan",
  //   image: "https://res.cloudinary.com/tryonai/image/upload/v1781353603/create_a_tamil_indian_guy_202606131451_tjp86m.jpg"
  // },

  "youtube-growth": {
    name: "Pavan Kumar",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/create_a_telugu_indian_student_202606131451_b2ginx.jpg"
  },
  "instagram": {
    name: "Pavan Kumar",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/create_a_telugu_indian_student_202606131451_b2ginx.jpg"
  },
  "mobile-hacks": {
    name: "Karthikeya",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/create_a_kannada_indian_guy_202606131452_cnz5j9.jpg"
  },
  "ai-tools": {
    name: "Rohith Reddy",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/Professional_headshot_of_an_Indian_202606131520_d80zaw.jpg"
  },
  "marketing": {
    name: "Varun Teja",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353605/create_a_telugu_young_star_202606131443_pjkkeu.jpg"
  },
  "startup-ideas": {
    name: "Nikhil Reddy",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353607/create_a_indian_guy_only_202606131454_mxkbx8.jpg"
  },
  "technology": {
    name: "Rohith Reddy",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/Professional_headshot_of_an_Indian_202606131520_d80zaw.jpg"
  },
  "apps-websites": {
    name: "Karthikeya",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/create_a_kannada_indian_guy_202606131452_cnz5j9.jpg"
  },
  "facebook": {
    name: "Varun Teja",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353605/create_a_telugu_young_star_202606131443_pjkkeu.jpg"
  },
  "current-affairs": {
    name: "Kusuma",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353603/create_a_telugu_indian_student_202606131442_qicxhk.jpg"
  },
  "govt-jobs-updates": {
    name: "Rakesh Naidu",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353598/Change_the_aspect_ratio_to_202606131731_vkfzsi.jpg"
  },
  "files-materials": {
    name: "Bhargavi",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353599/create_a_indian_student_only_202606131457_mvyu44.jpg"
  },
  "internships": {
    name: "Harsha Vardhan",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353603/create_a_tamil_indian_guy_202606131451_tjp86m.jpg"
  },
  "scholarships": {
    name: "Keerthana Reddy",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353613/create_a_telugu_indian_student_202606131452_efm1aq.jpg"
  },
  "editing": {
    name: "Rakesh Naidu",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353598/Change_the_aspect_ratio_to_202606131731_vkfzsi.jpg"
  }
};

export default function BlogContentRenderer({ blog, inline = false }: { blog: Blog; inline?: boolean }) {
  const [imageError, setImageError] = useState(false);
  const [adminImgError, setAdminImgError] = useState(false);

  const getReadingTime = (content: string) => {
    const cleanText = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const words = cleanText ? cleanText.split(" ").length : 0;
    return Math.max(1, Math.ceil(words / 200));
  };

  const getAdminInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Find matching admin details based on blog tags
  let adminInfo = {
    name: "Admin",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353613/create_a_kannada_indian_guy_202606131454_zrxvhu.jpg" // default
  };

  for (const { tag } of blog.tags) {
    const normalizedSlug = tag.slug?.toLowerCase();
    if (normalizedSlug) {
      const lookupKey = normalizedSlug === "career-jobs" ? "carrer-jobs" : normalizedSlug;
      if (ADMIN_MAPPING[lookupKey]) {
        adminInfo = ADMIN_MAPPING[lookupKey];
        break;
      }
    }
  }

  return (
    <article className={cn(
      "text-zinc-900 dark:text-zinc-150 font-sans selection:bg-blue-500/20",
      inline ? "" : "min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-16"
    )}>

      {!inline && (
        /* Top sticky action header */
        <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/blogs"
            className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-650 dark:text-zinc-400 flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Blogs
          </Link>
          <span className="text-xs text-zinc-400 font-mono">Published Article</span>
        </header>
      )}

      {/* Main post container */}
      <div className={cn(
        "pt-8",
        inline ? "w-full max-w-none" : "max-w-4xl mx-auto px-4 md:px-8"
      )}>

        {/* Breadcrumb / Tags info */}
        <div className="flex flex-wrap gap-1.5 items-center mb-4">
          {blog.tags.map(({ tag }) => (
            <Link
              key={tag.id}
              href={`/blogs?tag=${tag.id}`}
              className={cn(
                "text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-colors",
                tag.parentId
                  ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/15"
              )}
            >
              {tag.name}
            </Link>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight mb-6">
          {blog.title}
        </h1>

        {/* Post Metadata with Author Details */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs text-zinc-550 dark:text-zinc-400 border-y border-zinc-200 dark:border-zinc-800 py-3.5 mb-8">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
              {!adminImgError && adminInfo.image ? (
                <Image
                  src={adminInfo.image}
                  alt={adminInfo.name}
                  fill
                  className="object-cover"
                  sizes="32px"
                  onError={() => setAdminImgError(true)}
                />
              ) : (
                <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-350">
                  {getAdminInitials(adminInfo.name)}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-bold leading-none mb-0.5">Author</span>
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">{adminInfo.name}</span>
            </div>
          </div>

          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700 font-light">|</span>

          <div className="flex items-center gap-1.5 py-1">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <span>
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700 font-light">|</span>

          <div className="flex items-center gap-1.5 py-1">
            <BookOpen className="w-4 h-4 text-zinc-400" />
            <span>{getReadingTime(blog.content)} minute read</span>
          </div>
        </div>

        {/* Featured Image */}
        {blog.featuredImg && !imageError && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8">
            <Image
              src={blog.featuredImg}
              alt={blog.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
        )}

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="text-lg md:text-xl font-medium text-zinc-650 dark:text-zinc-300 leading-relaxed italic border-l-4 border-blue-500 pl-4 my-6">
            {blog.excerpt}
          </p>
        )}

        {/* Rich HTML Content */}
        <div
          className="article-preview-content prose max-w-none text-zinc-800 dark:text-zinc-200 leading-relaxed text-base md:text-lg
            [&_h1]:text-2xl [&_h1]:md:text-3xl [&_h1]:font-extrabold [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:tracking-tight [&_h1]:text-zinc-900 [&_h1]:dark:text-white
            [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-extrabold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-zinc-900 [&_h2]:dark:text-zinc-100
            [&_h3]:text-lg [&_h3]:md:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-zinc-850 [&_h3]:dark:text-zinc-200
            [&_p]:mb-6 [&_p]:leading-relaxed
            [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:py-3.5 [&_blockquote]:px-5 [&_blockquote]:rounded-r-xl [&_blockquote]:bg-blue-50/50 [&_blockquote]:dark:bg-blue-950/20 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-zinc-650 [&_blockquote]:dark:text-zinc-400 [&_blockquote]:text-base [&_blockquote]:md:text-lg
            
            [&_mark]:px-1 [&_mark]:py-0.5 [&_mark]:rounded-md
            
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-1.5
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-1.5
            [&_li]:text-zinc-855 [&_li]:dark:text-zinc-300
            
            [&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:hover:underline [&_a]:transition-colors
            
            [&_code]:bg-zinc-100 [&_code]:dark:bg-zinc-900 [&_code]:text-red-500 [&_code]:dark:text-red-400 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm
            
            [&_img]:rounded-xl [&_img]:border [&_img]:border-zinc-200 [&_img]:dark:border-zinc-800 [&_img]:my-6
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
            
            [&_video]:rounded-xl [&_video]:border [&_video]:border-zinc-200 [&_video]:dark:border-zinc-800 [&_video]:my-6 [&_video]:shadow-md"
        >
          {renderContentWithCodeBlocks(blog.content)}
        </div>

        {/* Clear floats just in case */}
        {!inline && (
          <div className="clear-both pt-8 mt-12 border-t border-zinc-200 dark:border-zinc-800 text-center">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-850 hover:bg-zinc-800 dark:hover:bg-zinc-750 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Explore More Articles
            </Link>
          </div>
        )}

      </div>
    </article>
  );
}
