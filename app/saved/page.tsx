import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import Topbar from "@/components/Homescreen/topbar";
import Header from "@/components/Homescreen/header";
import Navbar from "@/components/Homescreen/Navbar";
import Footer from "@/components/Homescreen/footer";
import { SavedBlogsView } from "./SavedBlogsView";

export const metadata = {
  title: "Saved Articles | Students Hub",
  description: "View and manage all your bookmarked and saved articles.",
};

export default async function SavedBlogsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login?callbackUrl=/saved");
  }

  const user = session.user;

  // Initial fetch of saved blogs for this user
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      blog: {
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      },
    },
  });

  const initialBlogs = bookmarks.map((b) => ({
    id: b.blog.id,
    title: b.blog.title,
    slug: b.blog.slug,
    excerpt: b.blog.excerpt,
    featuredImg: b.blog.featuredImg,
    createdAt: b.blog.createdAt.toISOString(),
    savedAt: b.createdAt.toISOString(),
    tags: b.blog.tags.map((t) => ({
      tag: {
        id: t.tag.id,
        name: t.tag.name,
        slug: t.tag.slug,
      },
    })),
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col font-sans">
      <Topbar />
      <Header />
      <Navbar />

      <main className="flex-grow py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <SavedBlogsView initialBlogs={initialBlogs} />
      </main>

      <Footer />
    </div>
  );
}
