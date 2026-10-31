"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminCommentsAction, deleteCommentByAdminAction } from "@/app/actions/admin-stats";
import { MessageSquare, Search, Loader2, Trash2, ExternalLink, Calendar, CornerDownRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CommentsManager() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin-comments", page, search],
    queryFn: async () => {
      const res = await getAdminCommentsAction(page, 15, search);
      if (!res.success) throw new Error(res.error || "Failed to load comments");
      return res;
    },
    refetchInterval: 10000,
  });

  const comments = data?.comments || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleDelete = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete/moderate this comment?")) return;
    setDeletingId(commentId);
    try {
      const res = await deleteCommentByAdminAction(commentId);
      if (res.success) {
        refetch();
      } else {
        alert(res.error || "Failed to delete comment");
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">User Comments &amp; Discussion</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200">
              {total} Total
            </span>
            {isFetching && <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real discussion messages posted by readers on your blog articles.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by comment, user, or article title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Comments List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-xs font-medium">Loading user comments...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="py-20 text-center">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No comments found</h3>
            <p className="text-xs text-slate-400 mt-1">
              {search ? "No comments match your search criteria." : "No readers have commented yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {comments.map((c) => {
              const initial = (c.user?.name || c.user?.email || "U")[0]?.toUpperCase() || "U";

              return (
                <div key={c.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* User Avatar */}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden relative">
                      {c.user?.image ? (
                        <Image src={c.user.image} alt="" fill className="object-cover" />
                      ) : (
                        initial
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      {/* Author & Article Info */}
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="font-bold text-slate-900">{c.user?.name || "Student"}</span>
                        <span className="text-slate-400 text-[11px]">• {c.user?.email}</span>
                        <span className="text-slate-300">|</span>
                        <Link
                          href={`/blogs/${c.blog?.slug || ""}`}
                          target="_blank"
                          className="font-medium text-blue-600 hover:underline flex items-center gap-1 truncate max-w-xs"
                          title={c.blog?.title}
                        >
                          <span className="truncate">{c.blog?.title || "View Post"}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </Link>
                      </div>

                      {/* Comment Content */}
                      <p className={`text-xs sm:text-sm leading-relaxed ${c.isDeleted ? "italic text-slate-400" : "text-slate-700"}`}>
                        {c.content}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(c.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {c.repliesCount > 0 && (
                          <span className="flex items-center gap-1 font-semibold text-slate-500">
                            <CornerDownRight className="w-3 h-3" />
                            {c.repliesCount} {c.repliesCount === 1 ? "reply" : "replies"}
                          </span>
                        )}
                        {c.isDeleted && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-600 font-bold text-[10px]">
                            Tombstone (Replies Intact)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      disabled={deletingId === c.id}
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      title="Moderate / Delete comment"
                    >
                      {deletingId === c.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
            <div>Page {page} of {totalPages}</div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
