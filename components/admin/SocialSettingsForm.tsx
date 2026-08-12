"use client";

import React, { useState, useEffect } from "react";
import {
  SocialSettings,
  getSiteSettingsAction,
  updateSocialSettingsAction,
} from "@/app/actions/settings";
import {
  Share2,
  Check,
  AlertCircle,
  Loader2,
  Globe,
} from "lucide-react";

export default function SocialSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [social, setSocial] = useState<SocialSettings>({
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    youtube: "https://youtube.com",
    telegram: "https://t.me",
    whatsapp: "https://whatsapp.com",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
  });

  useEffect(() => {
    async function load() {
      try {
        const settings = await getSiteSettingsAction();
        if (settings && settings.social) {
          setSocial(settings.social);
        }
      } catch (err) {
        console.error("Failed to load Social settings:", err);
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
      const res = await updateSocialSettingsAction(social);
      if (res.success) {
        setFeedback({ type: "success", message: "Social links updated successfully!" });
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to update social links." });
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
        <p className="text-xs text-slate-500 font-semibold">Loading social links...</p>
      </div>
    );
  }

  const socialFields = [
    { key: "facebook", label: "Facebook Page URL", placeholder: "https://facebook.com/studentsvoice", color: "text-blue-600" },
    { key: "instagram", label: "Instagram Profile URL", placeholder: "https://instagram.com/studentsvoice", color: "text-pink-600" },
    { key: "twitter", label: "Twitter / X Profile URL", placeholder: "https://x.com/studentsvoice", color: "text-slate-800" },
    { key: "youtube", label: "YouTube Channel URL", placeholder: "https://youtube.com/@studentsvoice", color: "text-red-600" },
    { key: "telegram", label: "Telegram Channel / Community URL", placeholder: "https://t.me/studentsvoice", color: "text-sky-500" },
    { key: "whatsapp", label: "WhatsApp Channel / Community Link", placeholder: "https://whatsapp.com/channel/...", color: "text-emerald-500" },
    { key: "linkedin", label: "LinkedIn Company / Page URL", placeholder: "https://linkedin.com/company/studentsvoice", color: "text-blue-700" },
    { key: "github", label: "GitHub Profile / Organization URL", placeholder: "https://github.com/studentsvoice", color: "text-slate-900" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-pink-600" />
            Social Media Handles &amp; Channel Links
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure official social profiles. These links will appear in the site header, footer, and article share menus.
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
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">Official Social Media URLs</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialFields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className={`font-black ${field.color}`}>&bull;</span>
                  {field.label}
                </label>
                <input
                  type="url"
                  value={(social as any)[field.key] || ""}
                  onChange={(e) => setSocial({ ...social, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Social Links...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save Social Links</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
