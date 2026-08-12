"use client";

import React, { useState, useEffect } from "react";
import {
  GeneralSettings,
  getSiteSettingsAction,
  updateGeneralSettingsAction,
  updateAdminSecurityAction,
} from "@/app/actions/settings";
import { MediaPicker } from "@/components/ui/media-picker";
import {
  Settings,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  Shield,
  KeyRound,
  Check,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

export default function GeneralSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [securityFeedback, setSecurityFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [general, setGeneral] = useState<GeneralSettings>({
    siteName: "Students Voice",
    siteTagline: "Empowering Student Aspirations & Real-Time Exam Updates",
    siteLogo: "",
    siteFavicon: "",
    supportEmail: "support@studentsvoice.in",
    contactPhone: "+91 98765 43210",
    contactAddress: "Hyderabad, Telangana, India",
    workingHours: "Mon - Sat: 9:00 AM - 6:00 PM IST",
    adminEmail: "lovarajuk431902@gmail.com",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const settings = await getSiteSettingsAction();
        if (settings && settings.general) {
          setGeneral(settings.general);
        }
      } catch (err) {
        console.error("Failed to load general settings:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await updateGeneralSettingsAction(general);
      if (res.success) {
        setFeedback({ type: "success", message: "General settings saved successfully!" });
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to update settings." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "An unexpected error occurred." });
    } finally {
      setSaving(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSecurity(true);
    setSecurityFeedback(null);

    if (newPassword && newPassword !== confirmPassword) {
      setSecurityFeedback({ type: "error", message: "New passwords do not match." });
      setSavingSecurity(false);
      return;
    }

    try {
      const res = await updateAdminSecurityAction({
        adminEmail: general.adminEmail,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });

      if (res.success) {
        setSecurityFeedback({ type: "success", message: "Admin credentials updated successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setSecurityFeedback({ type: "error", message: res.error || "Failed to update credentials." });
      }
    } catch (err: any) {
      setSecurityFeedback({ type: "error", message: err.message || "An unexpected error occurred." });
    } finally {
      setSavingSecurity(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-500 font-semibold">Loading general settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            General Website Settings
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure site brand identity, custom logo, support contact channels, and admin credentials.
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

      {/* Main General Settings Form */}
      <form onSubmit={handleGeneralSubmit} className="space-y-6">
        
        {/* CARD 1: Brand & Identity */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">Brand &amp; Identity</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Site Title / Brand Name</label>
              <input
                type="text"
                value={general.siteName}
                onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
                placeholder="Students Voice"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Tagline / Slogan</label>
              <input
                type="text"
                value={general.siteTagline}
                onChange={(e) => setGeneral({ ...general, siteTagline: e.target.value })}
                placeholder="Empowering Student Aspirations"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Logo & Favicon MediaPickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <MediaPicker
                label="WEBSITE LOGO (.WEBP / PNG)"
                type="image"
                value={general.siteLogo}
                onChange={(url) => setGeneral({ ...general, siteLogo: url })}
                placeholder="Click to upload or pick header logo"
                helperText="Recommended size: 250x60px. Supports transparent PNG / WebP."
              />
            </div>

            <div className="space-y-2">
              <MediaPicker
                label="FAVICON / SITE ICON (.ICO / PNG)"
                type="image"
                value={general.siteFavicon}
                onChange={(url) => setGeneral({ ...general, siteFavicon: url })}
                placeholder="Click to upload or pick favicon"
                helperText="Square 32x32px or 64x64px browser tab icon."
              />
            </div>
          </div>
        </div>

        {/* CARD 2: Contact Information */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Mail className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900">Support &amp; Contact Information</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Support / Helpdesk Email
              </label>
              <input
                type="email"
                value={general.supportEmail}
                onChange={(e) => setGeneral({ ...general, supportEmail: e.target.value })}
                placeholder="support@studentsvoice.in"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Support Phone Number
              </label>
              <input
                type="text"
                value={general.contactPhone}
                onChange={(e) => setGeneral({ ...general, contactPhone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Office / Operating Address
              </label>
              <input
                type="text"
                value={general.contactAddress}
                onChange={(e) => setGeneral({ ...general, contactAddress: e.target.value })}
                placeholder="Hyderabad, Telangana, India"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Working Hours
              </label>
              <input
                type="text"
                value={general.workingHours}
                onChange={(e) => setGeneral({ ...general, workingHours: e.target.value })}
                placeholder="Mon - Sat: 9:00 AM - 6:00 PM IST"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Save General Settings Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Settings...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save General Settings</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* CARD 3: Admin Credentials & Security */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5 mt-8">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Shield className="w-4 h-4 text-purple-600" />
          <h4 className="text-sm font-bold text-slate-900">Admin Account &amp; Password Security</h4>
        </div>

        {securityFeedback && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
              securityFeedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {securityFeedback.type === "success" ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{securityFeedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSecuritySubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Admin Login Email</label>
            <input
              type="email"
              value={general.adminEmail}
              onChange={(e) => setGeneral({ ...general, adminEmail: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingSecurity}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {savingSecurity ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Credentials...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Update Admin Credentials</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
