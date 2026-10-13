"use client";

import React, { useState, useEffect } from "react";
import {
  GeneralSettings,
  getSiteSettingsAction,
  getCurrentAdminPasswordAction,
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
  Eye,
  EyeOff,
} from "lucide-react";

export default function GeneralSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [securityFeedback, setSecurityFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [general, setGeneral] = useState<GeneralSettings>({
    siteName: "Students Hub",
    siteTagline: "Learn • Grow • Build a Better Future",
    siteLogo: "/logo.png",
    siteFavicon: "/logo.png",
    supportEmail: "support@studentsvoice.in",
    contactPhone: "+91 98765 43210",
    contactAddress: "Hyderabad, Telangana, India",
    workingHours: "Mon - Sat: 9:00 AM - 6:00 PM IST",
    adminEmail: "admin@gmail.com",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [validationError, setValidationError] = useState<string | null>(null);

  const checkSiteName = (val: string) => {
    const trimmed = val.trim();
    if (val !== trimmed) {
      return "Site Name must not have leading or trailing spaces.";
    }
    const parts = val.split(" ");
    if (parts.length !== 2 || parts[0] === "" || parts[1] === "") {
      return "Site Name must contain exactly two words separated by a single space (e.g., 'Students Hub').";
    }
    return null;
  };

  useEffect(() => {
    async function load() {
      try {
        const [settings, activePwd] = await Promise.all([
          getSiteSettingsAction(),
          getCurrentAdminPasswordAction(),
        ]);

        if (settings && settings.general) {
          setGeneral(settings.general);
        }
        if (activePwd) {
          setCurrentPassword(activePwd);
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

    const err = checkSiteName(general.siteName);
    if (err) {
      setFeedback({ type: "error", message: err });
      setValidationError(err);
      setSaving(false);
      return;
    }

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
        if (newPassword) {
          setCurrentPassword(newPassword);
        }
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

      {/* Main General Form */}
      <form onSubmit={handleGeneralSubmit} className="space-y-6">
        {/* Section 1: Brand & Logo Identity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              Brand &amp; Visual Identity
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize website name, header tagline, custom logo, and browser favicon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Site Name / Brand Title</label>
              <input
                type="text"
                value={general.siteName}
                onChange={(e) => {
                  const val = e.target.value;
                  setGeneral({ ...general, siteName: val });
                  setValidationError(checkSiteName(val));
                }}
                placeholder="Students Hub"
                className={`w-full h-10 px-3.5 rounded-xl border text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 ${
                  validationError
                    ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                    : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500"
                }`}
                required
              />
              {validationError && (
                <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {validationError}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Header Tagline / Slogan</label>
              <input
                type="text"
                value={general.siteTagline}
                onChange={(e) => setGeneral({ ...general, siteTagline: e.target.value })}
                placeholder="Learn • Grow • Build a Better Future"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
            {/* Site Logo */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                Website Logo
              </label>
              <MediaPicker
                value={general.siteLogo}
                onChange={(url) => setGeneral({ ...general, siteLogo: url })}
                label="Choose / Upload Logo"
                type="image"
              />
              <p className="text-[11px] text-slate-400">
                Recommended transparent .PNG or .WebP (200x50px).
              </p>
            </div>

            {/* Favicon */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                Browser Favicon (.ICO / .PNG)
              </label>
              <MediaPicker
                value={general.siteFavicon}
                onChange={(url) => setGeneral({ ...general, siteFavicon: url })}
                label="Choose / Upload Favicon"
                type="image"
              />
              <p className="text-[11px] text-slate-400">
                Square format icon (32x32px or 64x64px) for browser tabs.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Contact Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              Contact &amp; Support Channels
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Contact info displayed across footer, contact page, and student inquiry forms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Support Email
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
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Contact Phone / WhatsApp Helpline
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
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
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
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
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

          <div className="flex justify-end pt-2">
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
        </div>
      </form>

      {/* Section 3: Admin Account & Password Security */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-600" />
            Admin Account &amp; Password Security
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            View active credentials or update your admin email and password.
          </p>
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
            {/* Current Active Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-purple-600" />
                  Current Password
                </span>
                <span className="text-[10px] text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                  Active
                </span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full h-10 pl-3.5 pr-10 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-slate-50/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  title={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep"
                  className="w-full h-10 pl-3.5 pr-10 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  title={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full h-10 pl-3.5 pr-10 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
