"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminSubscribersAction } from "@/app/actions/admin-stats";
import {
  Crown,
  Search,
  Loader2,
  Calendar,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import Image from "next/image";

export default function SubscribersManager() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin-subscribers", page, statusFilter, search],
    queryFn: async () => {
      const res = await getAdminSubscribersAction(page, 15, statusFilter, search);
      if (!res.success) throw new Error(res.error || "Failed to load subscribers");
      return res;
    },
    refetchInterval: 10000,
  });

  const subscriptions = data?.subscriptions || [];
  const total = data?.total || 0;
  const activeCount = data?.activeCount || 0;
  const cancelledCount = data?.cancelledCount || 0;
  const totalPages = data?.totalPages || 1;
  const mrr = activeCount * 399; // Standard ₹399/mo plan

  return (
    <div className="space-y-6">
      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Subscribers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Subscribers</span>
            <div className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
              <span>{activeCount}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold border border-emerald-200">
                Live
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Paying members</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Crown className="w-6 h-6 fill-current" />
          </div>
        </div>

        {/* Estimated MRR */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Monthly Recurring Revenue</span>
            <div className="text-2xl font-black text-slate-900 mt-1">₹{mrr.toLocaleString()}</div>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Real-time MRR
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Total Historical Subscriptions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Subscriptions</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{total}</div>
            <span className="text-[11px] text-slate-400">All registered plans</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Churned / Cancelled */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cancelled / Inactive</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{cancelledCount}</div>
            <span className="text-[11px] text-slate-400">Past subscribers</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {["all", "active", "cancelled", "halted", "expired"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                statusFilter === st
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
          {isFetching && <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin ml-2" />}
        </div>

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by customer name or email..."
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

      {/* Subscriptions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-xs font-medium">Loading subscription roster...</span>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="py-20 text-center">
            <Crown className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No subscriptions found</h3>
            <p className="text-xs text-slate-400 mt-1">
              {search ? "No subscriptions match your query." : "No customer subscriptions recorded yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Subscriber</th>
                  <th className="py-3 px-4">Plan &amp; Provider</th>
                  <th className="py-3 px-4">Gateway ID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Renewal / End Date</th>
                  <th className="py-3 px-4 text-right">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscriptions.map((sub) => {
                  const initial = (sub.user?.name || sub.user?.email || "U")[0]?.toUpperCase() || "U";
                  const isActive = sub.status === "active";

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-600 text-white font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden relative">
                            {sub.user?.image ? (
                              <Image src={sub.user.image} alt="" fill className="object-cover" />
                            ) : (
                              initial
                            )}
                          </div>
                          <div className="leading-tight min-w-0">
                            <div className="font-bold text-slate-900 truncate">
                              {sub.user?.name || "Member"}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">{sub.user?.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">Students Hub Pro</div>
                        <div className="text-[11px] text-slate-400 uppercase">₹399/mo • {sub.provider}</div>
                      </td>

                      {/* Provider Gateway ID */}
                      <td className="py-3.5 px-4">
                        <code className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {sub.providerSubscriptionId || "N/A"}
                        </code>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        ) : sub.status === "cancelled" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-200">
                            <XCircle className="w-3 h-3" />
                            <span>Cancelled</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                            <Clock className="w-3 h-3" />
                            <span className="capitalize">{sub.status}</span>
                          </span>
                        )}
                      </td>

                      {/* Renewal / End */}
                      <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                        {sub.currentPeriodEnd ? (
                          <div>
                            <div>{new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                            {sub.cancelAtPeriodEnd && (
                              <span className="text-[10px] text-amber-600 font-bold">Cancels at end</span>
                            )}
                          </div>
                        ) : (
                          "Ongoing"
                        )}
                      </td>

                      {/* Created */}
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] text-right">
                        {new Date(sub.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
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
