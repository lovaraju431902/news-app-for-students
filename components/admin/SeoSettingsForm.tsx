"use client";

import React, { useState, useEffect } from "react";
import {
  SeoSettings,
  getSiteSettingsAction,
  updateSeoSettingsAction,
} from "@/app/actions/settings";
import { MediaPicker } from "@/components/ui/media-picker";
import {
  Search,
  Check,
  AlertCircle,
  Loader2,
  Share2,
  FileCode,
} from "lucide-react";

export default function SeoSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [seo, setSeo] = useState<SeoSettings>({
    metaTitle: "Students Voice - Latest Government Jobs, Education & Career Updates",
    metaDescription: "Get fast, reliable student news, notifications, study materials, mock tests, and career opportunities.",
    metaKeywords: "student news, government jobs, current affairs, internships, scholarships, study materials",
    canonicalUrl: "http://localhost",
    ogImage: "",
    twitterHandle: "@studentsvoice",
    googleAnalyticsId: "",
    googleSearchConsoleCode: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const settings = await getSiteSettingsAction();
        if (settings && settings.seo) {
          setSeo(settings.seo);
        }
      } catch (err) {
        console.error("Failed to load SEO settings:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await updateSeoSettingsAction(seo);
      if (res.success) {
        setFeedback({ type: "success", message: "SEO & Webmaster settings updated successfully!" });
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to update SEO settings." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "An unexpected error occurred." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-500 font-semibold">Loading SEO settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-600" />
            SEO &amp; Webmaster Configurations
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage search engine meta tags, OpenGraph social previews, Google Analytics, and Search Console tags.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CARD 1: Meta Tags */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Search className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900">Standard Metadata</h4>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Default Meta Title</label>
              <input
                type="text"
                value={seo.metaTitle}
                onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
                placeholder="Site Title for Google Search"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Default Meta Description</label>
              <textarea
                rows={3}
                value={seo.metaDescription}
                onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                placeholder="Concise 150-160 characters summary for search engine snippet."
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Meta Keywords (Comma separated)</label>
                <input
                  type="text"
                  value={seo.metaKeywords}
                  onChange={(e) => setSeo({ ...seo, metaKeywords: e.target.value })}
                  placeholder="news, education, jobs, results"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Canonical Base URL</label>
                <input
                  type="url"
                  value={seo.canonicalUrl}
                  onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                  placeholder="http://localhost"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Social Media OpenGraph Preview */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Share2 className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">OpenGraph &amp; Social Previews</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <MediaPicker
                label="DEFAULT OG / SOCIAL SHARE IMAGE (.WEBP / JPG)"
                type="image"
                value={seo.ogImage}
                onChange={(url) => setSeo({ ...seo, ogImage: url })}
                placeholder="Click to upload default OpenGraph banner"
                helperText="Recommended size: 1200x630px. Used when sharing links on WhatsApp, Facebook & Twitter."
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Twitter / X Site Handle</label>
                <input
                  type="text"
                  value={seo.twitterHandle}
                  onChange={(e) => setSeo({ ...seo, twitterHandle: e.target.value })}
                  placeholder="@studentsvoice"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: Analytics & Webmaster */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileCode className="w-4 h-4 text-purple-600" />
            <h4 className="text-sm font-bold text-slate-900">Analytics &amp; Verification Tags</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Google Analytics 4 Measurement ID</label>
              <input
                type="text"
                value={seo.googleAnalyticsId}
                onChange={(e) => setSeo({ ...seo, googleAnalyticsId: e.target.value })}
                placeholder="G-XXXXXXXXXX"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Google Search Console Verification Code</label>
              <input
                type="text"
                value={seo.googleSearchConsoleCode}
                onChange={(e) => setSeo({ ...seo, googleSearchConsoleCode: e.target.value })}
                placeholder="google-site-verification=xxxx"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving SEO Settings...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save SEO Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
