"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminUsersAction } from "@/app/actions/admin-stats";
import { Users, Search, Loader2, Calendar, MessageSquare, Heart, Bookmark, Crown, ShieldCheck, Mail } from "lucide-react";
import Image from "next/image";

export default function UsersManager() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin-users", page, search],
    queryFn: async () => {
      const res = await getAdminUsersAction(page, 15, search);
      if (!res.success) throw new Error(res.error || "Failed to load users");
      return res;
    },
    refetchInterval: 10000, // 10s real-time poll
  });

  const users = data?.users || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Registered Users</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200">
              {total} Total
            </span>
            {isFetching && <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time accounts registered through Better Auth &amp; Google OAuth.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search users by name or email..."
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

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-xs font-medium">Loading user directory...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No users found</h3>
            <p className="text-xs text-slate-400 mt-1">
              {search ? "No users match your search criteria." : "No registered user accounts yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Plan / Status</th>
                  <th className="py-3 px-4">Activity</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const initial = (u.name || u.email || "U")[0].toUpperCase();
                  const isSubscriber = u.subscription?.status === "active";

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* User Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden relative">
                            {u.image ? (
                              <Image src={u.image} alt={u.name} fill className="object-cover" />
                            ) : (
                              initial
                            )}
                          </div>
                          <div className="leading-tight min-w-0">
                            <div className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                              <span>{u.name || "Student"}</span>
                              {isSubscriber && (
                                <span title="Premium Subscriber">
                                  <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Plan / Status */}
                      <td className="py-3.5 px-4">
                        {isSubscriber ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Crown className="w-3 h-3 fill-amber-600 text-amber-600" />
                            <span>Premium Pro</span>
                          </span>
                        ) : u.subscription?.status === "cancelled" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-200">
                            Cancelled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                            Free Member
                          </span>
                        )}
                      </td>

                      {/* Activity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                          <span className="flex items-center gap-1" title="Comments written">
                            <MessageSquare className="w-3 h-3 text-slate-400" />
                            {u.stats.commentsCount}
                          </span>
                          <span className="flex items-center gap-1" title="Articles liked">
                            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                            {u.stats.likesCount}
                          </span>
                          <span className="flex items-center gap-1" title="Articles bookmarked">
                            <Bookmark className="w-3 h-3 text-blue-500 fill-blue-500" />
                            {u.stats.bookmarksCount}
                          </span>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(u.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      {/* Verification Badge */}
                      <td className="py-3.5 px-4 text-right">
                        {u.emailVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                            <Mail className="w-3.5 h-3.5" />
                            <span>Unverified</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
