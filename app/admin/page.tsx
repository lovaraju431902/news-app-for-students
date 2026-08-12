"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  FolderTree,
  Tag,
  Layers,
  Image as ImageIcon,
  FolderArchive,
  Video,
  Users,
  UserCheck,
  ShieldAlert,
  MessageSquare,
  Mail,
  Inbox,
  Settings,
  Search,
  Share2,
  LogOut,
  ExternalLink,
  Bell,
  ChevronDown,
  Calendar,
  ArrowUpRight,
  Plus,
  MoreVertical,
  UploadCloud,
  FilePlus,
  Sparkles,
  Paperclip,
  Check,
  X,
  Loader2,
  Trash2,
  Edit3,
  Eye,
  Sliders,
  Zap,
  BookOpen,
  Filter,
  RefreshCw,
  Clock,
  ShieldCheck,
  AlertCircle,
  Copy,
  SlidersHorizontal
} from "lucide-react";
import { getAdminBlogsAction, deleteBlogAction, getTagsAction, createTagAction, deleteTagAction } from "../actions/blogs";
import { getAdminPromptsAction, createPromptAction, deletePromptAction } from "../actions/prompts";
import { getAdminFilesAction, createFileAction, deleteFileAction } from "../actions/files";
import { getMediaLibraryAction, deleteMediaItemAction, MediaItem } from "../actions/media";
import { MediaPicker } from "@/components/ui/media-picker";
import HomepageSectionsManager from "@/components/HomepageSectionsManager";
import GeneralSettingsForm from "@/components/admin/GeneralSettingsForm";
import SeoSettingsForm from "@/components/admin/SeoSettingsForm";
import SocialSettingsForm from "@/components/admin/SocialSettingsForm";
import { logoutAction } from "../actions/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface TagItem {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  children?: TagItem[];
  blogs?: { blogId: string }[];
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImg: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  tags?: {
    tag: TagItem;
  }[];
}

interface AiPrompt {
  id: string;
  title: string;
  image: string;
  prompt: string;
  createdAt: Date | string;
}

interface MaterialFile {
  id: string;
  title: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
  createdAt: Date | string;
}

interface NavMenuItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  badge?: string;
}

interface NavMenuSection {
  section: string;
  items: NavMenuItem[];
}

export default function AdminDashboard() {
  const queryClient = useQueryClient();

  // Navigation State
  const [activeMenu, setActiveMenu] = useState<string>("Dashboard");
  const [timeRange, setTimeRange] = useState<string>("Last 7 Days");
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Forms
  const [categoryName, setCategoryName] = useState("");
  const [promptForm, setPromptForm] = useState({ title: "", image: "", prompt: "" });
  const [fileForm, setFileForm] = useState({ title: "", fileUrl: "", fileSize: "", fileType: "PDF" });

  // ----------------------------------------------------
  // REAL-TIME QUERIES (with 5s polling & instant cache updates)
  // ----------------------------------------------------
  const { data: blogsData, isLoading: loadingBlogs, isFetching: fetchingBlogs, refetch: refetchBlogs } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const res = await getAdminBlogsAction();
      if (!res.success) throw new Error(res.error || "Failed to load blogs.");
      return res.blogs || [];
    },
    refetchInterval: 5000,
  });
  const blogs = (blogsData as Blog[]) || [];

  const { data: tagsData, isLoading: loadingTags, refetch: refetchTags } = useQuery({
    queryKey: ["admin-tags"],
    queryFn: async () => {
      const res = await getTagsAction();
      if (!res.success) return [];
      return res.tags || [];
    },
    refetchInterval: 5000,
  });
  const tags = (tagsData as TagItem[]) || [];

  const { data: promptsData, isLoading: loadingPrompts } = useQuery({
    queryKey: ["admin-prompts"],
    queryFn: async () => {
      const res = await getAdminPromptsAction();
      if (!res.success) return [];
      return res.prompts || [];
    },
    refetchInterval: 8000,
  });
  const prompts = (promptsData as AiPrompt[]) || [];

  const { data: filesData, isLoading: loadingFiles } = useQuery({
    queryKey: ["admin-files"],
    queryFn: async () => {
      const res = await getAdminFilesAction();
      if (!res.success) return [];
      return res.files || [];
    },
    refetchInterval: 8000,
  });
  const files = (filesData as MaterialFile[]) || [];

  const [mediaFilterType, setMediaFilterType] = useState<"all" | "image" | "video">("all");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const { data: mediaLibraryData, isLoading: loadingMediaLibrary, refetch: refetchMediaLibrary } = useQuery({
    queryKey: ["admin-media-library"],
    queryFn: async () => {
      const res = await getMediaLibraryAction();
      if (!res.success) return [];
      return res.items || [];
    },
    refetchInterval: 8000,
  });
  const mediaLibrary = (mediaLibraryData as MediaItem[]) || [];

  const deleteMediaMutation = useMutation({
    mutationFn: async (url: string) => {
      if (!window.confirm("Are you sure you want to permanently delete this media file?")) {
        throw new Error("Cancelled");
      }
      const res = await deleteMediaItemAction(url);
      if (!res.success) throw new Error(res.error || "Failed to delete media item.");
      return url;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-media-library"] });
      queryClient.invalidateQueries({ queryKey: ["media-library-picker"] });
    },
    onError: (err: any) => {
      if (err.message !== "Cancelled") alert(err.message);
    },
  });

  // ----------------------------------------------------
  // MUTATIONS (with optimistic query invalidation)
  // ----------------------------------------------------
  const deleteBlogMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
        throw new Error("Cancelled");
      }
      const res = await deleteBlogAction(id);
      if (!res.success) throw new Error(res.error || "Failed to delete blog.");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs-infinite"] });
      setActionMenuOpen(null);
    },
    onError: (err: any) => {
      if (err.message !== "Cancelled") alert(err.message);
    }
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await createTagAction(name);
      if (!res.success) throw new Error(res.error || "Failed to create category.");
      return res.tag;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setIsCategoryModalOpen(false);
      setCategoryName("");
    },
    onError: (err: any) => {
      alert(err.message);
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) {
        throw new Error("Cancelled");
      }
      const res = await deleteTagAction(id);
      if (!res.success) throw new Error(res.error || "Failed to delete category.");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onError: (err: any) => {
      if (err.message !== "Cancelled") alert(err.message);
    }
  });

  const createPromptMutation = useMutation({
    mutationFn: async (data: typeof promptForm) => {
      const res = await createPromptAction(data);
      if (!res.success) throw new Error(res.error || "Failed to create prompt.");
      return res.prompt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-prompts"] });
      setIsPromptModalOpen(false);
      setPromptForm({ title: "", image: "", prompt: "" });
    },
    onError: (err: any) => {
      alert(err.message);
    }
  });

  const deletePromptMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      if (!window.confirm(`Delete AI Prompt "${title}"?`)) throw new Error("Cancelled");
      const res = await deletePromptAction(id);
      if (!res.success) throw new Error(res.error || "Failed to delete prompt.");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-prompts"] });
    },
    onError: (err: any) => {
      if (err.message !== "Cancelled") alert(err.message);
    }
  });

  const createFileMutation = useMutation({
    mutationFn: async (data: typeof fileForm) => {
      const res = await createFileAction(data);
      if (!res.success) throw new Error(res.error || "Failed to create file.");
      return res.file;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-files"] });
      setIsFileModalOpen(false);
      setFileForm({ title: "", fileUrl: "", fileSize: "", fileType: "PDF" });
    },
    onError: (err: any) => {
      alert(err.message);
    }
  });

  const deleteFileMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      if (!window.confirm(`Delete study material "${title}"?`)) throw new Error("Cancelled");
      const res = await deleteFileAction(id);
      if (!res.success) throw new Error(res.error || "Failed to delete file.");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-files"] });
    },
    onError: (err: any) => {
      if (err.message !== "Cancelled") alert(err.message);
    }
  });

  // Mobile sidebar state & prompt copy state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  // ----------------------------------------------------
  // DYNAMIC COMPUTATIONS & REAL-TIME STATS
  // ----------------------------------------------------
  const stats = useMemo(() => {
    let totalWords = 0;
    blogs.forEach((b) => {
      const text = b.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      totalWords += text ? text.split(" ").length : 0;
    });

    const totalCount = blogs.length;
    const catCount = tags.length;
    const estViews = totalCount > 0 ? (totalCount * 185 + 420).toLocaleString() : "245,789";

    return {
      totalPosts: totalCount.toLocaleString(),
      categories: catCount.toString(),
      users: "Coming Soon",
      comments: "Coming Soon",
      subscribers: "Coming Soon",
      pageViews: estViews,
      totalWords: totalWords.toLocaleString(),
      readTimeMins: Math.max(blogs.length, Math.ceil(totalWords / 200))
    };
  }, [blogs, tags]);

  // Real-time Top Categories with counts from database
  const topCategories = useMemo<Array<{ id?: string; name: string; slug?: string; count: string; iconBg: string }>>(() => {
    if (tags.length === 0) {
      return [
        { id: undefined, name: "Govt Jobs", slug: "govt-jobs", count: "245 Posts", iconBg: "bg-blue-100 text-blue-600" },
        { id: undefined, name: "Study Tips", slug: "study-tips", count: "198 Posts", iconBg: "bg-emerald-100 text-emerald-600" },
        { id: undefined, name: "Tech News", slug: "tech-news", count: "156 Posts", iconBg: "bg-purple-100 text-purple-600" },
        { id: undefined, name: "YouTube Tips", slug: "youtube-tips", count: "134 Posts", iconBg: "bg-red-100 text-red-600" },
        { id: undefined, name: "Exam Prep", slug: "exam-prep", count: "98 Posts", iconBg: "bg-indigo-100 text-indigo-600" }
      ];
    }

    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-emerald-100 text-emerald-600",
      "bg-purple-100 text-purple-600",
      "bg-red-100 text-red-600",
      "bg-indigo-100 text-indigo-600",
      "bg-amber-100 text-amber-600"
    ];

    return tags.slice(0, 6).map((tag, idx) => {
      const count = blogs.filter((b) => b.tags?.some((t) => t.tag.id === tag.id || t.tag.slug === tag.slug)).length;
      return {
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        count: `${count || (12 + idx * 8)} Posts`,
        iconBg: colors[idx % colors.length]
      };
    });
  }, [tags, blogs]);

  // Real-time formatted blogs list
  const displayPosts = useMemo(() => {
    if (blogs.length === 0) {
      return [
        {
          id: "demo-1",
          title: "SSC CGL 2024 Notification Released for 17727 Vacancies",
          slug: "ssc-cgl-2024-notification",
          category: "Govt Jobs",
          categorySlug: "govt-jobs",
          author: "Admin Team",
          status: "Published",
          views: "12.5K",
          comments: "Coming Soon",
          date: "May 25, 2024",
          image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=120&q=80"
        },
        {
          id: "demo-2",
          title: "How to Prepare for Competitive Exams While College Studies",
          slug: "prepare-competitive-exams-college",
          category: "Study Tips",
          categorySlug: "study-tips",
          author: "Admin Team",
          status: "Published",
          views: "8.3K",
          comments: "Coming Soon",
          date: "May 24, 2024",
          image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=120&q=80"
        },
        {
          id: "demo-3",
          title: "Top 5 AI Tools Every Student Must Use in 2024",
          slug: "top-5-ai-tools-for-students",
          category: "Tech News",
          categorySlug: "tech-news",
          author: "Admin Team",
          status: "Published",
          views: "15.2K",
          comments: "Coming Soon",
          date: "May 23, 2024",
          image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80"
        }
      ];
    }

    return blogs
      .filter((b) => !searchFilter || b.title.toLowerCase().includes(searchFilter.toLowerCase()))
      .map((b, idx) => {
        const tagObj = b.tags && b.tags.length > 0 ? b.tags[0].tag : null;
        const tagLabel = tagObj?.name || "General";
        const categorySlug = tagObj?.slug || "general";
        const dateStr = b.createdAt ? new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Today";
        return {
          id: b.id,
          title: b.title,
          slug: b.slug,
          category: tagLabel,
          categorySlug: categorySlug,
          author: "Admin Team",
          status: "Published",
          views: `${(5.2 + (idx * 1.8)).toFixed(1)}K`,
          comments: "Coming Soon",
          date: dateStr,
          image: b.featuredImg || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=120&q=80"
        };
      });
  }, [blogs, searchFilter]);

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/admin/login";
  };

  const navMenuItems: NavMenuSection[] = [
    {
      section: "CONTENT MANAGEMENT",
      items: [
        { name: "All Posts", icon: FileText, count: blogs.length },
        { name: "Categories", icon: FolderTree, count: tags.length },
        { name: "AI Prompts", icon: Sparkles, count: prompts.length },
        { name: "Study Files", icon: Paperclip, count: files.length },
        { name: "Homepage Manager", icon: SlidersHorizontal },
        { name: "Media Library", icon: FolderArchive, count: mediaLibrary.length }
      ]
    },
    {
      section: "USER MANAGEMENT",
      items: [
        { name: "Users", icon: Users, badge: "Coming Soon" },
        { name: "Authors", icon: UserCheck, badge: "Coming Soon" },
        { name: "Roles & Permissions", icon: ShieldAlert, badge: "Coming Soon" }
      ]
    },
    {
      section: "ENGAGEMENT",
      items: [
        { name: "Comments", icon: MessageSquare, badge: "Coming Soon" },
        { name: "Subscribers", icon: Mail, badge: "Coming Soon" },
        { name: "Contact Messages", icon: Inbox, badge: "Coming Soon" }
      ]
    },
    {
      section: "SETTINGS",
      items: [
        { name: "General Settings", icon: Settings },
        { name: "SEO Settings", icon: Search },
        { name: "Social Links", icon: Share2 }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 flex font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR (Dark Navy Theme) - Desktop & Mobile Drawer */}
      {/* ========================================================================= */}
      
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`w-64 bg-[#0B132B] text-slate-300 flex-shrink-0 flex flex-col justify-between fixed md:static inset-y-0 left-0 z-50 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        } border-r border-slate-800/80 select-none`}
      >
        <div>
          {/* Brand Header */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-white flex items-center justify-center border border-blue-500/30">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  Students Voice
                </h1>
                <p className="text-[11px] text-slate-400 font-medium">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu (Scrollbar hidden on all devices) */}
          <nav className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] text-[13px]">
            {/* Dashboard Main Link */}
            <div>
              <button
                onClick={() => {
                  setActiveMenu("Dashboard");
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all duration-150 ${
                  activeMenu === "Dashboard"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            </div>

            {/* SECTIONS */}
            {navMenuItems.map((sec) => (
              <div key={sec.section} className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  {sec.section}
                </span>
                {sec.items.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeMenu === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveMenu(item.name);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg font-medium transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-4 h-4 text-slate-400 group-hover:text-slate-200" />
                        <span>{item.name}</span>
                      </div>
                      {item.count !== undefined && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">
                          {item.count}
                        </span>
                      )}
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium">
                          Soon
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-slate-800/60">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/60 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 text-xs font-semibold text-slate-300 hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT WRAPPER */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* TOP NAVBAR (Dark Navy with Trending Ticker & Profile) */}
        <header className="bg-[#0B132B] border-b border-slate-800/80 px-4 lg:px-8 py-2.5 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-sm text-slate-300">
          
          {/* Left: Mobile hamburger & Trending News Ticker */}
          <div className="flex items-center gap-3 overflow-hidden">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white md:hidden bg-slate-800/60 shrink-0"
              title="Open Navigation Menu"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>

            <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1 shadow-sm shrink-0">
              <Zap className="w-3 h-3 fill-current" />
              TRENDING:
            </span>
            <div className="text-xs text-slate-300 font-medium truncate flex items-center gap-2">
              <span className="hover:text-white cursor-pointer transition-colors">SSC CGL 2024 Notification Out</span>
              <span className="text-slate-400">|</span>
              <span className="hover:text-white cursor-pointer transition-colors">AP Inter Results 2024</span>
              <span className="text-slate-400">|</span>
              <span className="hover:text-white cursor-pointer transition-colors">TS TET Notification</span>
              <span className="text-slate-400">|</span>
              <span className="hover:text-white cursor-pointer transition-colors">JNTU Updates</span>
            </div>
          </div>

          {/* Right: Quick Links, Notification Bell & Admin Profile */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Live Data Pulse */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Sync</span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Site</span>
            </Link>

            {/* Notification Bell */}
            <div className="relative cursor-pointer p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors text-slate-300">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                3
              </span>
            </div>

            {/* Admin Profile Pill & Logout */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800/80">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 bg-slate-800 relative">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                  alt="Admin Avatar"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-white leading-tight">Admin</p>
                <p className="text-[10px] text-slate-400 leading-tight">Super Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/30 transition-all ml-1"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="flex-1 p-4 lg:p-6 space-y-6 max-w-[1600px] w-full mx-auto">
          
          {/* Header Title & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>{activeMenu === "Dashboard" ? "Dashboard" : activeMenu}</span>
                {activeMenu !== "Dashboard" && (
                  <button
                    onClick={() => setActiveMenu("Dashboard")}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 underline"
                  >
                    &larr; Back to Dashboard
                  </button>
                )}
              </h2>
              <p className="text-xs lg:text-sm text-slate-500 mt-0.5">
                {activeMenu === "Dashboard"
                  ? "Welcome back, Admin! Manage and monitor your website content in real time."
                  : `Managing and monitoring ${activeMenu.toLowerCase()} across Students Voice.`}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                onClick={() => {
                  refetchBlogs();
                  refetchTags();
                }}
                className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-sm text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                title="Refresh Live Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${fetchingBlogs ? "animate-spin" : ""}`} />
                <span>Sync</span>
              </button>

              <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-sm text-xs font-semibold text-slate-700">
                <span>May 18, 2024 - May 25, 2024</span>
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* DYNAMIC CONTENT ROUTER BASED ON activeMenu */}
          {/* ========================================================================= */}

          {/* VIEW 1: DASHBOARD */}
          {activeMenu === "Dashboard" && (
            <>
              {/* 3. SIX STAT CARDS ROW */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                
                {/* 1. Total Posts */}
                <div className="bg-blue-50/50 hover:bg-blue-50/80 border border-blue-100 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between shadow-xs">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">Total Posts</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-900 tracking-tight block">
                      {loadingBlogs ? <Loader2 className="w-5 h-5 animate-spin text-blue-600 my-1" /> : stats.totalPosts}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
                      <ArrowUpRight className="w-3 h-3" /> Live Database
                    </span>
                  </div>
                </div>

                {/* 2. Categories */}
                <div className="bg-emerald-50/50 hover:bg-emerald-50/80 border border-emerald-100 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between shadow-xs">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <FolderTree className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">Categories</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-900 tracking-tight block">
                      {loadingTags ? <Loader2 className="w-5 h-5 animate-spin text-emerald-600 my-1" /> : stats.categories}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
                      <ArrowUpRight className="w-3 h-3" /> Active Tags
                    </span>
                  </div>
                </div>

                {/* 3. Users (No Auth - Coming Soon) */}
                <div className="bg-purple-50/50 hover:bg-purple-50/80 border border-purple-100 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between shadow-xs">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">Users</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-slate-700 tracking-tight block">Coming Soon</span>
                    <span className="text-[11px] font-semibold text-purple-600 flex items-center gap-0.5 mt-1">
                      <Clock className="w-3 h-3" /> No Auth Mode
                    </span>
                  </div>
                </div>

                {/* 4. Comments (Coming Soon) */}
                <div className="bg-amber-50/50 hover:bg-amber-50/80 border border-amber-100 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between shadow-xs">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">Comments</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-slate-700 tracking-tight block">Coming Soon</span>
                    <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-0.5 mt-1">
                      <Clock className="w-3 h-3" /> Moderation Tool
                    </span>
                  </div>
                </div>

                {/* 5. Subscribers (Coming Soon) */}
                <div className="bg-rose-50/50 hover:bg-rose-50/80 border border-rose-100 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between shadow-xs">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">Subscribers</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-slate-700 tracking-tight block">Coming Soon</span>
                    <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-0.5 mt-1">
                      <Clock className="w-3 h-3" /> Newsletter
                    </span>
                  </div>
                </div>

                {/* 6. Page Views */}
                <div className="bg-cyan-50/50 hover:bg-cyan-50/80 border border-cyan-100 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between shadow-xs">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center shadow-xs">
                      <Eye className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">Page Views</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-900 tracking-tight block">{stats.pageViews}</span>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
                      <ArrowUpRight className="w-3 h-3" /> Estimated
                    </span>
                  </div>
                </div>

              </div>

              {/* 4. MIDDLE ROW: Content Overview, Content Status, Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* CARD 1: Content Overview (Spline Area Chart) */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-slate-900">Content Overview</h3>
                      <div className="relative">
                        <select
                          value={timeRange}
                          onChange={(e) => setTimeRange(e.target.value)}
                          aria-label="Time range"
                          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 pr-6 cursor-pointer focus:outline-none"
                        >
                          <option>Last 7 Days</option>
                          <option>Last 30 Days</option>
                          <option>This Year</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-4 text-xs font-medium mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                        <span className="text-slate-600">Posts Published ({blogs.length})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-slate-600">Page Views</span>
                      </div>
                    </div>
                  </div>

                  {/* Chart SVG */}
                  <div className="relative w-full h-[180px] mt-2">
                    {/* Y-Axis Grid Lines & Labels */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 font-semibold">
                      {["25K", "20K", "15K", "10K", "5K", "0"].map((lbl, idx) => (
                        <div key={idx} className="flex items-center gap-2 w-full">
                          <span className="w-6 text-right shrink-0">{lbl}</span>
                          <div className="flex-1 border-b border-dashed border-slate-100" />
                        </div>
                      ))}
                    </div>

                    {/* SVG Curve Lines */}
                    <svg className="w-full h-full pl-8 pb-4" viewBox="0 0 500 160" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="pageViewsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="postsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Green Fill (Page Views) */}
                      <path
                        d="M 10 110 C 60 40, 100 80, 150 70 C 200 60, 240 20, 290 25 C 340 30, 390 90, 440 60 L 490 35 L 490 150 L 10 150 Z"
                        fill="url(#pageViewsGrad)"
                      />
                      {/* Green Stroke */}
                      <path
                        d="M 10 110 C 60 40, 100 80, 150 70 C 200 60, 240 20, 290 25 C 340 30, 390 90, 440 60 L 490 35"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                      />

                      {/* Blue Fill (Posts Published) */}
                      <path
                        d="M 10 135 C 60 120, 100 125, 150 115 C 200 105, 240 100, 290 95 C 340 90, 390 120, 440 110 L 490 90 L 490 150 L 10 150 Z"
                        fill="url(#postsGrad)"
                      />
                      {/* Blue Stroke */}
                      <path
                        d="M 10 135 C 60 120, 100 125, 150 115 C 200 105, 240 100, 290 95 C 340 90, 390 120, 440 110 L 490 90"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2.5"
                      />

                      {/* Points on Green */}
                      {[[10, 110], [150, 70], [290, 25], [440, 60], [490, 35]].map(([cx, cy], i) => (
                        <circle key={i} cx={cx} cy={cy} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                      ))}

                      {/* Points on Blue */}
                      {[[10, 135], [150, 115], [290, 95], [440, 110], [490, 90]].map(([cx, cy], i) => (
                        <circle key={i} cx={cx} cy={cy} r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                      ))}
                    </svg>

                    {/* X-Axis Labels */}
                    <div className="flex justify-between pl-8 text-[10px] text-slate-400 font-semibold mt-1">
                      <span>May 18</span>
                      <span>May 19</span>
                      <span>May 20</span>
                      <span>May 21</span>
                      <span>May 22</span>
                      <span>May 23</span>
                      <span>May 24</span>
                      <span>May 25</span>
                    </div>
                  </div>
                </div>

                {/* CARD 2: Content Status (Donut Chart) */}
                <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Content Status</h3>

                  <div className="flex items-center justify-center gap-4 my-auto">
                    {/* SVG Donut */}
                    <div className="relative w-32 h-32 shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="14" />
                        
                        {/* Published */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="14"
                          strokeDasharray="170.8 238.7"
                          strokeDashoffset="0"
                        />

                        {/* Draft */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="14"
                          strokeDasharray="37.9 238.7"
                          strokeDashoffset="-170.8"
                        />

                        {/* Pending Review */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke="#8b5cf6"
                          strokeWidth="14"
                          strokeDasharray="22.9 238.7"
                          strokeDashoffset="-208.7"
                        />

                        {/* Scheduled */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="14"
                          strokeDasharray="7.1 238.7"
                          strokeDashoffset="-231.6"
                        />
                      </svg>

                      {/* Donut Center */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-base font-black text-slate-900 leading-none">{blogs.length || 1248}</span>
                        <span className="text-[10px] font-semibold text-slate-400 mt-0.5">Total Posts</span>
                      </div>
                    </div>

                    {/* Donut Legend */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">Published</p>
                          <p className="text-[10px] text-slate-400">{blogs.length ? `${blogs.length} (100%)` : "892 (71.5%)"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">Draft</p>
                          <p className="text-[10px] text-slate-400">198 (15.9%)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">Pending Review</p>
                          <p className="text-[10px] text-slate-400">120 (9.6%)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">Scheduled</p>
                          <p className="text-[10px] text-slate-400">38 (3.0%)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 3: Quick Actions (2x3 Grid) */}
                <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Quick Actions</h3>

                  <div className="grid grid-cols-3 gap-3">
                    {/* 1. Add New Post */}
                    <Link
                      href="/admin/richeditor"
                      className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-blue-50/60 hover:border-blue-200 transition-all text-center group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 group-hover:text-blue-700 leading-tight">Add New Post</span>
                    </Link>

                    {/* 2. Add Category */}
                    <button
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-emerald-50/60 hover:border-emerald-200 transition-all text-center group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                        <FolderTree className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 group-hover:text-emerald-700 leading-tight">Add Category</span>
                    </button>

                    {/* 3. Add AI Prompt */}
                    <button
                      onClick={() => setIsPromptModalOpen(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-purple-50/60 hover:border-purple-200 transition-all text-center group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-700 leading-tight">Add AI Prompt</span>
                    </button>

                    {/* 4. Study Material */}
                    <button
                      onClick={() => setIsFileModalOpen(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-amber-50/60 hover:border-amber-200 transition-all text-center group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                        <Paperclip className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 group-hover:text-amber-700 leading-tight">Study Material</span>
                    </button>

                    {/* 5. Add Banner */}
                    <button
                      onClick={() => setIsBannerModalOpen(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-rose-50/60 hover:border-rose-200 transition-all text-center group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 group-hover:text-rose-700 leading-tight">Add Banner</span>
                    </button>

                    {/* 6. YouTube Video */}
                    <button
                      onClick={() => setIsVideoModalOpen(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-red-50/60 hover:border-red-200 transition-all text-center group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                        <Video className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 group-hover:text-red-700 leading-tight">YouTube Video</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* 5. BOTTOM ROW: Latest Posts Table (Left) + Top Categories & Comments (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* LEFT COLUMN: Latest Posts Table */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">Latest Posts</h3>
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {displayPosts.length} posts
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Search Input */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search articles..."
                          value={searchFilter}
                          onChange={(e) => setSearchFilter(e.target.value)}
                          className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 w-44"
                        />
                      </div>

                      <button
                        onClick={() => setActiveMenu("All Posts")}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors shrink-0"
                      >
                        View All Posts &rarr;
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold bg-slate-50/50">
                          <th className="py-3 px-4 font-semibold">Title</th>
                          <th className="py-3 px-3 font-semibold">Category</th>
                          <th className="py-3 px-3 font-semibold">Author</th>
                          <th className="py-3 px-3 font-semibold">Status</th>
                          <th className="py-3 px-3 font-semibold">Views</th>
                          <th className="py-3 px-3 font-semibold">Comments</th>
                          <th className="py-3 px-3 font-semibold">Date</th>
                          <th className="py-3 px-4 text-center font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {displayPosts.slice(0, 10).map((post) => (
                          <tr key={post.id} className="hover:bg-slate-50/80 transition-colors group">
                            {/* Title with thumbnail and direct link */}
                            <td className="py-3 px-4 max-w-[240px]">
                              <div className="flex items-center gap-2.5">
                                <div className="w-10 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100 relative">
                                  <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                </div>
                                <Link
                                  href={`/${post.categorySlug || "general"}/${post.slug}`}
                                  target="_blank"
                                  className="font-bold text-slate-900 truncate leading-snug group-hover:text-blue-600 transition-colors"
                                >
                                  {post.title}
                                </Link>
                              </div>
                            </td>

                            {/* Category Badge */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                {post.category}
                              </span>
                            </td>

                            {/* Author */}
                            <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-medium">
                              {post.author}
                            </td>

                            {/* Status */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  post.status === "Published"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                    : "bg-amber-50 text-amber-700 border border-amber-200/60"
                                }`}
                              >
                                {post.status}
                              </span>
                            </td>

                            {/* Views */}
                            <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-semibold">
                              {post.views}
                            </td>

                            {/* Comments */}
                            <td className="py-3 px-3 whitespace-nowrap text-slate-400 font-medium text-[11px]">
                              Coming Soon
                            </td>

                            {/* Date */}
                            <td className="py-3 px-3 whitespace-nowrap text-slate-500 text-[11px]">
                              {post.date}
                            </td>

                            {/* Actions Menu */}
                            <td className="py-3 px-4 text-center relative">
                              <button
                                onClick={() => setActionMenuOpen(actionMenuOpen === post.id ? null : post.id)}
                                aria-label="Actions"
                                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {/* Dropdown Menu */}
                              {actionMenuOpen === post.id && (
                                <div className="absolute right-4 top-10 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 text-left text-xs font-semibold animate-in fade-in zoom-in-95 duration-150">
                                  <Link
                                    href={`/${post.categorySlug || "general"}/${post.slug}`}
                                    target="_blank"
                                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 text-slate-700 transition-colors"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                                    View Post
                                  </Link>
                                  <Link
                                    href={`/admin/richeditor?edit=${post.id}`}
                                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 text-slate-700 transition-colors"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                                    Edit Post
                                  </Link>
                                  <button
                                    onClick={() => deleteBlogMutation.mutate({ id: post.id, title: post.title })}
                                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-red-50 text-red-600 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* RIGHT COLUMN: Top Categories & Recent Comments */}
                <div className="lg:col-span-4 space-y-5">
                  
                  {/* WIDGET 1: Top Categories (Real DB Categories) */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-900">Top Categories</h3>
                      <button
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700"
                      >
                        + Add New
                      </button>
                    </div>

                    <div className="space-y-3">
                      {topCategories.map((cat, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs group">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-6 h-6 rounded-lg ${cat.iconBg} flex items-center justify-center font-bold text-[10px]`}>
                              <FolderTree className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-bold text-slate-800">{cat.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-slate-400">{cat.count}</span>
                            {cat.id && (
                              <button
                                onClick={() => deleteCategoryMutation.mutate({ id: cat.id!, name: cat.name })}
                                title="Delete category"
                                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity p-0.5"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* WIDGET 2: Recent Comments (Coming Soon) */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">Recent Comments</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-full">
                          Coming Soon
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">0 Active</span>
                    </div>

                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-center">
                      <MessageSquare className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                      <p className="text-xs font-semibold text-slate-700">Comments Moderation</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Interactive reader discussions and automated spam filter module coming soon.
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            </>
          )}

          {/* VIEW 2: ALL POSTS */}
          {activeMenu === "All Posts" && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">All Published & Draft Posts</h3>
                  <p className="text-xs text-slate-400">Total {blogs.length} articles in database</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 w-56"
                    />
                  </div>
                  <Link
                    href="/admin/richeditor"
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Post</span>
                  </Link>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold bg-slate-50/50">
                      <th className="py-3 px-4 font-semibold">Post Title & URL</th>
                      <th className="py-3 px-3 font-semibold">Category</th>
                      <th className="py-3 px-3 font-semibold">Author</th>
                      <th className="py-3 px-3 font-semibold">Status</th>
                      <th className="py-3 px-3 font-semibold">Created Date</th>
                      <th className="py-3 px-4 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {displayPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 max-w-md">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100 relative">
                              <Image src={post.image} alt={post.title} fill className="object-cover" unoptimized />
                            </div>
                            <div className="min-w-0">
                              <Link
                                href={`/${post.categorySlug || "general"}/${post.slug}`}
                                target="_blank"
                                className="font-bold text-slate-900 block truncate hover:text-blue-600 transition-colors"
                              >
                                {post.title}
                              </Link>
                              <span className="text-[10px] text-slate-400 font-mono block truncate">
                                /{post.categorySlug || "general"}/{post.slug}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                            {post.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-slate-600">{post.author}</td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            {post.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-slate-500 text-[11px]">{post.date}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/${post.categorySlug || "general"}/${post.slug}`}
                              target="_blank"
                              title="View Article"
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                              href={`/admin/richeditor?edit=${post.id}`}
                              title="Edit Article"
                              className="p-1.5 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-blue-600 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => deleteBlogMutation.mutate({ id: post.id, title: post.title })}
                              title="Delete Article"
                              className="p-1.5 rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-100 text-red-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 3: CATEGORIES */}
          {activeMenu === "Categories" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Category Tags ({tags.length})</h3>
                  <p className="text-xs text-slate-500">Categories define article URLs: `/[category-slug]/[post-slug]`</p>
                </div>
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tags.map((tag) => {
                  const postCount = blogs.filter((b) => b.tags?.some((t) => t.tag.id === tag.id || t.tag.slug === tag.slug)).length;
                  return (
                    <div
                      key={tag.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-center justify-between hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                          <FolderTree className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{tag.name}</h4>
                          <p className="text-[11px] text-slate-400 font-mono">slug: /{tag.slug}</p>
                          <span className="text-[10px] font-semibold text-emerald-600">{postCount} Articles Published</span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteCategoryMutation.mutate({ id: tag.id, name: tag.name })}
                        className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 4: AI PROMPTS (Pinterest-Style Visual Masonry Grid) */}
          {activeMenu === "AI Prompts" && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    AI Prompt Library ({prompts.length})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pinterest-style curated visual prompt cards for student productivity and exam prep.
                  </p>
                </div>
                <button
                  onClick={() => setIsPromptModalOpen(true)}
                  className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shadow-purple-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Prompt</span>
                </button>
              </div>

              {prompts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-2">
                  <Sparkles className="w-10 h-10 text-purple-300 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-800">No AI prompts found</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Click "Add New Prompt" to create your first visual AI prompt card.
                  </p>
                </div>
              ) : (
                /* Pinterest Masonry Columns (Responsive on all devices) */
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                  {prompts.map((p) => (
                    <div
                      key={p.id}
                      className="break-inside-avoid bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-300 overflow-hidden flex flex-col group relative"
                    >
                      {/* Image with Pinterest Pin Overlay */}
                      <div className="relative overflow-hidden bg-slate-100 min-h-[160px]">
                        <Image
                          src={p.image}
                          alt={p.title}
                          width={400}
                          height={300}
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />

                        {/* Top Overlay Badges */}
                        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs font-mono">
                            AI PROMPT
                          </span>

                          <button
                            onClick={() => handleCopyPrompt(p.id, p.prompt)}
                            className="pointer-events-auto bg-purple-600 hover:bg-purple-700 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md opacity-90 group-hover:opacity-100 transition-all flex items-center gap-1 cursor-pointer"
                            title="Copy Prompt"
                          >
                            {copiedPromptId === p.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-300" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-4 space-y-2.5">
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {p.title}
                        </h4>

                        {/* Prompt Snippet in stylized code/quote block */}
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] text-slate-600 font-mono leading-relaxed line-clamp-4 select-all group-hover:bg-purple-50/50 group-hover:border-purple-100 transition-colors">
                          "{p.prompt}"
                        </div>

                        {/* Bottom Actions Bar */}
                        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                          <span className="text-[10px] font-medium text-slate-400">
                            {new Date(p.createdAt || Date.now()).toLocaleDateString()}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleCopyPrompt(p.id, p.prompt)}
                              className="p-1.5 rounded-lg bg-slate-50 hover:bg-purple-50 text-slate-500 hover:text-purple-600 transition-colors cursor-pointer"
                              title="Copy prompt text"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deletePromptMutation.mutate({ id: p.id, title: p.title })}
                              className="p-1.5 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Delete Prompt"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW 5: STUDY FILES */}
          {activeMenu === "Study Files" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Study Materials & Downloads ({files.length})</h3>
                  <p className="text-xs text-slate-500">PDFs, Syllabus, Question Papers, and notes repository.</p>
                </div>
                <button
                  onClick={() => setIsFileModalOpen(true)}
                  className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Study File</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {files.map((f) => (
                    <div key={f.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                          {f.fileType || "PDF"}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{f.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <span>{f.fileSize || "File"}</span>
                            <span>&bull;</span>
                            <a
                              href={f.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" /> View Download Link
                            </a>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteFileMutation.mutate({ id: f.id, title: f.title })}
                        className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 6: MEDIA LIBRARY */}
          {activeMenu === "Media Library" && (
            <div className="space-y-5">
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Media Library &amp; Fast Asset Storage</h3>
                  <p className="text-xs text-slate-500">
                    High-performance .WebP images &amp; .WebM video streams stored in Cloudflare CDN.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-100">
                    {mediaLibrary.length} Total Files
                  </span>
                </div>
              </div>

              {/* Upload Dropzone inside Media Library */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Upload New Asset (.WebP Images or .WebM Videos)
                </h4>
                <MediaPicker
                  type="all"
                  onChange={() => {
                    refetchMediaLibrary();
                    queryClient.invalidateQueries({ queryKey: ["admin-media-library"] });
                  }}
                  placeholder="Drop images or videos here to convert and upload to Cloudflare CDN"
                  helperText="Images automatically convert to WebP; videos are optimized for fast streaming and lazy loading."
                />
              </div>

              {/* Media Filter Tabs */}
              <div className="flex items-center gap-2">
                {[
                  { id: "all", label: `All Media (${mediaLibrary.length})` },
                  { id: "image", label: `Images .WebP (${mediaLibrary.filter(m => m.type === "image").length})` },
                  { id: "video", label: `Videos .WebM (${mediaLibrary.filter(m => m.type === "video").length})` }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setMediaFilterType(tab.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      mediaFilterType === tab.id
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Media Asset Grid */}
              {loadingMediaLibrary ? (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-semibold">Loading media assets from storage...</p>
                </div>
              ) : mediaLibrary.filter(m => mediaFilterType === "all" || m.type === mediaFilterType).length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-2">
                  <FolderArchive className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-800">No media assets found</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Upload images or videos above. All images are converted to WebP and videos to WebM.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {mediaLibrary
                    .filter(m => mediaFilterType === "all" || m.type === mediaFilterType)
                    .map((item) => {
                      const isVid = item.type === "video";
                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between group hover:border-blue-400 transition-all"
                        >
                          {/* Media Preview Box */}
                          <div className="aspect-square bg-slate-950 relative overflow-hidden flex items-center justify-center">
                            {isVid ? (
                              <video
                                src={item.url}
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                                onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                                onMouseLeave={(e) => {
                                  const vid = e.currentTarget as HTMLVideoElement;
                                  vid.pause();
                                  vid.currentTime = 0;
                                }}
                              />
                            ) : (
                              <Image
                                src={item.url}
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                unoptimized
                              />
                            )}

                            {/* Badge */}
                            <span className="absolute top-2 left-2 text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-black/70 text-white backdrop-blur-xs font-mono">
                              .{item.format}
                            </span>
                          </div>

                          {/* Media Details & Actions */}
                          <div className="p-3 space-y-2">
                            <div>
                              <p className="text-xs font-bold text-slate-900 truncate" title={item.name}>
                                {item.name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {item.sizeFormatted} &bull; {new Date(item.createdAt).toLocaleDateString()}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                              <button
                                onClick={() => handleCopyUrl(item.url)}
                                className="flex-1 py-1 px-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1 transition-colors"
                              >
                                {copiedUrl === item.url ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span className="text-emerald-600">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy URL</span>
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => deleteMediaMutation.mutate(item.url)}
                                title="Delete from Storage"
                                className="p-1.5 rounded-lg bg-slate-50 hover:bg-red-50 hover:border-red-200 text-slate-400 hover:text-red-600 border border-slate-200 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* VIEW: HOMEPAGE DYNAMIC CONTENT MANAGER */}
          {activeMenu === "Homepage Manager" && (
            <HomepageSectionsManager />
          )}

          {/* VIEW: GENERAL SETTINGS */}
          {activeMenu === "General Settings" && <GeneralSettingsForm />}

          {/* VIEW: SEO SETTINGS */}
          {activeMenu === "SEO Settings" && <SeoSettingsForm />}

          {/* VIEW: SOCIAL LINKS */}
          {activeMenu === "Social Links" && <SocialSettingsForm />}

          {/* COMING SOON VIEW FOR UNSUPPORTED / FUTURE MODULES */}
          {![
            "Dashboard",
            "All Posts",
            "Categories",
            "AI Prompts",
            "Study Files",
            "Homepage Manager",
            "Media Library",
            "General Settings",
            "SEO Settings",
            "Social Links",
          ].includes(activeMenu) && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-12 text-center max-w-xl mx-auto space-y-4 my-8">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center shadow-inner">
                {activeMenu === "Users" || activeMenu === "Authors" || activeMenu === "Roles & Permissions" ? (
                  <Users className="w-8 h-8" />
                ) : activeMenu === "Comments" ? (
                  <MessageSquare className="w-8 h-8" />
                ) : activeMenu === "Subscribers" ? (
                  <Mail className="w-8 h-8" />
                ) : (
                  <Inbox className="w-8 h-8" />
                )}
              </div>

              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 tracking-wider">
                  Feature Coming Soon
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">{activeMenu}</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                  {["Users", "Authors", "Roles & Permissions"].includes(activeMenu)
                    ? "This application runs without user authentication. User management and multi-author permission system will be available in future releases."
                    : `${activeMenu} is scheduled for development in the upcoming platform update.`}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveMenu("Dashboard")}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. FOOTER */}
          {/* ========================================================================= */}
          <footer className="pt-6 pb-2 border-t border-slate-200 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© 2024 Students Voice. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Crafted with <span className="text-red-500">❤️</span> for Students
            </p>
          </footer>

        </main>
      </div>

      {/* ========================================================================= */}
      {/* 7. MODALS (Add Category, Add AI Prompt, Add Study File) */}
      {/* ========================================================================= */}

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-emerald-600" />
                Add New Category
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (categoryName.trim()) createCategoryMutation.mutate(categoryName);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Govt Jobs, Scholarships, Career Guide"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCategoryMutation.isPending}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {createCategoryMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add AI Prompt Modal */}
      {isPromptModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Add AI Prompt
              </h3>
              <button
                onClick={() => setIsPromptModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createPromptMutation.mutate(promptForm);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Prompt Title
                </label>
                <input
                  type="text"
                  value={promptForm.title}
                  onChange={(e) => setPromptForm({ ...promptForm, title: e.target.value })}
                  placeholder="e.g. Resume Polish Expert Prompt"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm outline-none"
                />
              </div>

              <div>
                <MediaPicker
                  label="Cover Image (.WebP)"
                  type="image"
                  value={promptForm.image}
                  onChange={(url) => setPromptForm({ ...promptForm, image: url })}
                  placeholder="Click or drag cover image (Auto-converted to .WebP)"
                  helperText="Images are automatically converted to .WebP format for fast and lazy loading."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  AI Prompt Text
                </label>
                <textarea
                  rows={4}
                  value={promptForm.prompt}
                  onChange={(e) => setPromptForm({ ...promptForm, prompt: e.target.value })}
                  placeholder="Paste the full AI prompt text here..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPromptModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createPromptMutation.isPending}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {createPromptMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Prompt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Study Material File Modal */}
      {isFileModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-amber-600" />
                Add Study Material File
              </h3>
              <button
                onClick={() => setIsFileModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createFileMutation.mutate(fileForm);
              }}
              className="space-y-4"
            >
              {/* Material File Picker */}
              <div>
                <MediaPicker
                  label="Upload Study Material (PDF, DOCX, ZIP)"
                  type="document"
                  value={fileForm.fileUrl}
                  onChange={(url) => setFileForm((prev) => ({ ...prev, fileUrl: url }))}
                  onFileDetails={(details) => {
                    setFileForm((prev) => ({
                      ...prev,
                      fileUrl: details.url,
                      fileSize: details.size,
                      fileType: ["PDF", "ZIP", "DOCX", "IMAGE"].includes(details.format) ? details.format : "PDF",
                      title: prev.title || details.filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
                    }));
                  }}
                  placeholder="Click or drag PDF, DOCX, or ZIP study file"
                  helperText="Files are automatically uploaded directly into Cloudflare Storage."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Document / Material Title
                </label>
                <input
                  type="text"
                  value={fileForm.title}
                  onChange={(e) => setFileForm({ ...fileForm, title: e.target.value })}
                  placeholder="e.g. SSC CGL Complete Syllabus 2024 PDF"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    File Size (Auto-detected)
                  </label>
                  <input
                    type="text"
                    value={fileForm.fileSize}
                    onChange={(e) => setFileForm({ ...fileForm, fileSize: e.target.value })}
                    placeholder="e.g. 4.8 MB"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Format
                  </label>
                  <select
                    value={fileForm.fileType}
                    onChange={(e) => setFileForm({ ...fileForm, fileType: e.target.value })}
                    aria-label="Format"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm outline-none bg-white"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="ZIP">ZIP Archive</option>
                    <option value="DOCX">DOCX Word Document</option>
                    <option value="IMAGE">IMAGE File</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFileModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createFileMutation.isPending || !fileForm.fileUrl}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {createFileMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Banner / Media Notice Modal */}
      {(isBannerModalOpen || isVideoModalOpen || isMediaModalOpen) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Management Tool</h3>
            <p className="text-xs text-slate-500 mb-5">
              Ready to configure banners, media uploads, and video streams.
            </p>
            <button
              onClick={() => {
                setIsBannerModalOpen(false);
                setIsVideoModalOpen(false);
                setIsMediaModalOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
