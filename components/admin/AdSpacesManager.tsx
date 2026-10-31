"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AD_SPACE_DEFINITIONS,
  AdSpaceId,
  AdSpaceItem,
} from "@/types/ad-spaces";
import { Loader2, Check, ExternalLink, Image as ImageIcon, Sparkles } from "lucide-react";
import { MediaPicker } from "@/components/ui/media-picker";

export default function AdSpacesManager() {
  const queryClient = useQueryClient();
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedSpaceId, setSelectedSpaceId] = useState<AdSpaceId>("header");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [desktopImagePickerOpen, setDesktopImagePickerOpen] = useState(false);
  const [mobileImagePickerOpen, setMobileImagePickerOpen] = useState(false);

  // Active form state for the currently selected ad space
  const [currentSpace, setCurrentSpace] = useState<AdSpaceItem | null>(null);

  // Fetch all ad spaces
  const { data: allSpaces, isLoading } = useQuery<Record<AdSpaceId, AdSpaceItem>>({
    queryKey: ["admin-ad-spaces"],
    queryFn: async () => {
      const res = await fetch("/api/ad-spaces");
      if (!res.ok) throw new Error("Failed to load ad spaces");
      const json = await res.json();
      return json.spaces || {};
    },
  });

  // When selected space changes or data loads, update the active form state
  useEffect(() => {
    if (allSpaces && allSpaces[selectedSpaceId]) {
      setCurrentSpace({ ...allSpaces[selectedSpaceId] });
    }
  }, [allSpaces, selectedSpaceId]);

  // Mutation to save ad space config
  const saveMutation = useMutation({
    mutationFn: async (item: AdSpaceItem) => {
      const res = await fetch("/api/ad-spaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error("Failed to save ad space");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ad-spaces"] });
      queryClient.invalidateQueries({ queryKey: ["ad-spaces"] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
    onError: (err: any) => {
      alert(err.message || "Failed to save ad space");
    },
  });

  // Helper to build standardized responsive ad code from image, url, and dimensions
  const buildAdCode = (
    imageUrl: string,
    adUrl: string,
    width: string,
    height: string
  ) => {
    const targetUrl = adUrl?.trim() || "#";
    const wNum = width ? width.replace(/[^0-9]/g, "") : "";
    const hNum = height ? height.replace(/[^0-9]/g, "") : "";
    const maxW = wNum ? `${wNum}px` : (width.trim() || "100%");
    const maxH = hNum ? `${hNum}px` : (height.trim() || "auto");

    return `<a href="${targetUrl}" target="_blank" rel="noopener noreferrer" aria-label="Advertisement"><img src="${imageUrl}" width="${wNum || width}" height="${hNum || height}" alt="Advertisement" class="lazyload" style="max-width:${maxW};max-height:${maxH};width:100%;height:auto;object-fit:contain;display:block;margin:0 auto;border-radius:4px;" /></a>`;
  };

  const handleFieldChange = (
    platform: "desktop" | "mobile",
    field: "width" | "height" | "adCode" | "adUrl" | "imageUrl",
    value: string
  ) => {
    if (!currentSpace) return;
    const currentPlatform = currentSpace[platform];
    const newWidth = field === "width" ? value : currentPlatform.width;
    const newHeight = field === "height" ? value : currentPlatform.height;
    let nextAdCode = field === "adCode" ? value : currentPlatform.adCode;

    // If width or height is modified, synchronize adCode automatically
    if (field === "width" || field === "height") {
      if (currentPlatform.imageUrl) {
        nextAdCode = buildAdCode(
          currentPlatform.imageUrl,
          currentPlatform.adUrl || "",
          newWidth,
          newHeight
        );
      } else if (nextAdCode) {
        const wNum = newWidth.replace(/[^0-9]/g, "");
        const hNum = newHeight.replace(/[^0-9]/g, "");
        if (field === "width" && wNum) {
          nextAdCode = nextAdCode.replace(/\bwidth=["']?\d+["']?/gi, `width="${wNum}"`);
          nextAdCode = nextAdCode.replace(/max-width:\s*\d+px/gi, `max-width:${wNum}px`);
        }
        if (field === "height" && hNum) {
          nextAdCode = nextAdCode.replace(/\bheight=["']?\d+["']?/gi, `height="${hNum}"`);
          nextAdCode = nextAdCode.replace(/max-height:\s*\d+px/gi, `max-height:${hNum}px`);
        }
      }
    }

    setCurrentSpace({
      ...currentSpace,
      [platform]: {
        ...currentPlatform,
        [field]: value,
        adCode: nextAdCode,
      },
    });
  };

  // Helper to generate ad code from image + url
  const generateAdCode = (
    platform: "desktop" | "mobile",
    imageUrl: string,
    adUrl?: string
  ) => {
    if (!currentSpace) return;
    const currentPlatform = currentSpace[platform];
    const targetUrl = (adUrl !== undefined ? adUrl : currentPlatform.adUrl)?.trim() || "";
    const width = currentPlatform.width || (platform === "desktop" ? "800" : "300");
    const height = currentPlatform.height || (platform === "desktop" ? "130" : "250");

    const code = buildAdCode(imageUrl, targetUrl, width, height);

    setCurrentSpace({
      ...currentSpace,
      [platform]: {
        ...currentPlatform,
        imageUrl,
        adUrl: targetUrl === "#" ? "" : targetUrl,
        adCode: code,
      },
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSpace) return;
    saveMutation.mutate(currentSpace);
  };

  const selectedDef = AD_SPACE_DEFINITIONS.find((d) => d.id === selectedSpaceId);

  if (isLoading || !currentSpace) {
    return (
      <div className="bg-white rounded-2xl p-10 border border-slate-200/90 shadow-sm flex flex-col items-center justify-center min-h-[350px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <span className="text-sm font-semibold text-slate-500">Loading ad spaces configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Ad Spaces</h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure custom advertisements, Google AdSense code, and banner placements across the website.
          </p>
        </div>

        {/* Top Dropdowns matching Reference UI */}
        <div className="space-y-4 max-w-xl">
          {/* 1. Settings Language */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Settings Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 transition-colors shadow-2xs"
            >
              <option value="English">English</option>
              <option value="Telugu">Telugu</option>
            </select>
          </div>

          {/* 2. Select Ad Space */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Ad Space
            </label>
            <select
              value={selectedSpaceId}
              onChange={(e) => setSelectedSpaceId(e.target.value as AdSpaceId)}
              className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 transition-colors shadow-2xs font-medium"
            >
              {AD_SPACE_DEFINITIONS.map((def) => (
                <option key={def.id} value={def.id}>
                  {def.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Ad Configuration Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section Heading matching Reference UI */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">{selectedDef?.name || "Header"}</h3>
          {saveSuccess && (
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Ad space changes saved successfully!</span>
            </div>
          )}
        </div>

        {/* 1. DESKTOP BANNER CONTAINER */}
        <div className="bg-[#f8f9fa] rounded-xl border border-slate-200/90 p-5 sm:p-6 space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h4 className="text-sm font-bold text-slate-800">
              Desktop Banner{" "}
              <span className="text-xs font-normal text-slate-500">
                (This ad will be displayed on screens larger than 992px)
              </span>
            </h4>
          </div>

          {/* Ad Size Inputs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Ad Size</label>
            <div className="flex items-center gap-3 max-w-sm">
              <input
                type="text"
                placeholder="Width (e.g. 800)"
                value={currentSpace.desktop.width}
                onChange={(e) => handleFieldChange("desktop", "width", e.target.value)}
                className="w-1/2 h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 outline-none focus:border-blue-500"
              />
              <span className="text-slate-400 font-bold text-xs">×</span>
              <input
                type="text"
                placeholder="Height (e.g. 130)"
                value={currentSpace.desktop.height}
                onChange={(e) => handleFieldChange("desktop", "height", e.target.value)}
                className="w-1/2 h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Two-Column Grid: Ad Code (Left) & Create Ad Code (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Left: Ad Code Textarea */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Ad Code</label>
              <textarea
                rows={7}
                placeholder="Paste HTML, JavaScript, Google AdSense or iframe ad code here..."
                value={currentSpace.desktop.adCode}
                onChange={(e) => handleFieldChange("desktop", "adCode", e.target.value)}
                className="w-full p-3 bg-white border border-slate-300 rounded-md text-xs font-mono text-slate-800 outline-none focus:border-blue-500 leading-relaxed resize-y"
              />
              <span className="text-[11px] text-slate-400">
                Leave empty if you do not want to show an ad in this desktop space.
              </span>
            </div>

            {/* Right: Create Ad Code Helper */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Create Ad Code{" "}
                <span className="font-normal text-slate-500">
                  (If you don't have an ad code, you can create an ad code by selecting an image and adding an URL)
                </span>
              </label>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Ad URL (e.g. https://example.com/promo)"
                  value={currentSpace.desktop.adUrl || ""}
                  onChange={(e) => {
                    handleFieldChange("desktop", "adUrl", e.target.value);
                    if (currentSpace.desktop.imageUrl) {
                      generateAdCode("desktop", currentSpace.desktop.imageUrl, e.target.value);
                    }
                  }}
                  className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 outline-none focus:border-blue-500"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDesktopImagePickerOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4 py-2 rounded transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Select Image</span>
                  </button>

                  {currentSpace.desktop.imageUrl && (
                    <span className="text-xs text-emerald-600 font-semibold truncate max-w-xs">
                      ✓ Image Selected
                    </span>
                  )}
                </div>

                {desktopImagePickerOpen && (
                  <div className="p-3 bg-white rounded-lg border border-slate-200 mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700">Select Banner Image</span>
                      <button
                        type="button"
                        onClick={() => setDesktopImagePickerOpen(false)}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        ✕ Close
                      </button>
                    </div>
                    <MediaPicker
                      type="image"
                      value={currentSpace.desktop.imageUrl || ""}
                      onChange={(url) => {
                        generateAdCode("desktop", url);
                        setDesktopImagePickerOpen(false);
                      }}
                      placeholder="Upload or choose desktop banner..."
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. MOBILE BANNER CONTAINER */}
        <div className="bg-[#f8f9fa] rounded-xl border border-slate-200/90 p-5 sm:p-6 space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h4 className="text-sm font-bold text-slate-800">
              Mobile Banner{" "}
              <span className="text-xs font-normal text-slate-500">
                (This ad will be displayed on screens smaller than 992px)
              </span>
            </h4>
          </div>

          {/* Ad Size Inputs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Ad Size</label>
            <div className="flex items-center gap-3 max-w-sm">
              <input
                type="text"
                placeholder="Width (e.g. 300)"
                value={currentSpace.mobile.width}
                onChange={(e) => handleFieldChange("mobile", "width", e.target.value)}
                className="w-1/2 h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 outline-none focus:border-blue-500"
              />
              <span className="text-slate-400 font-bold text-xs">×</span>
              <input
                type="text"
                placeholder="Height (e.g. 250)"
                value={currentSpace.mobile.height}
                onChange={(e) => handleFieldChange("mobile", "height", e.target.value)}
                className="w-1/2 h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Two-Column Grid: Ad Code (Left) & Create Ad Code (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Left: Ad Code Textarea */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Ad Code</label>
              <textarea
                rows={7}
                placeholder="Paste mobile banner HTML, AdSense or script code here..."
                value={currentSpace.mobile.adCode}
                onChange={(e) => handleFieldChange("mobile", "adCode", e.target.value)}
                className="w-full p-3 bg-white border border-slate-300 rounded-md text-xs font-mono text-slate-800 outline-none focus:border-blue-500 leading-relaxed resize-y"
              />
              <span className="text-[11px] text-slate-400">
                Leave empty if you do not want to show an ad in this mobile space.
              </span>
            </div>

            {/* Right: Create Ad Code Helper */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Create Ad Code{" "}
                <span className="font-normal text-slate-500">
                  (If you don't have an ad code, you can create an ad code by selecting an image and adding an URL)
                </span>
              </label>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Ad URL (e.g. https://example.com/promo)"
                  value={currentSpace.mobile.adUrl || ""}
                  onChange={(e) => {
                    handleFieldChange("mobile", "adUrl", e.target.value);
                    if (currentSpace.mobile.imageUrl) {
                      generateAdCode("mobile", currentSpace.mobile.imageUrl, e.target.value);
                    }
                  }}
                  className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 outline-none focus:border-blue-500"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMobileImagePickerOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4 py-2 rounded transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Select Image</span>
                  </button>

                  {currentSpace.mobile.imageUrl && (
                    <span className="text-xs text-emerald-600 font-semibold truncate max-w-xs">
                      ✓ Image Selected
                    </span>
                  )}
                </div>

                {mobileImagePickerOpen && (
                  <div className="p-3 bg-white rounded-lg border border-slate-200 mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700">Select Banner Image</span>
                      <button
                        type="button"
                        onClick={() => setMobileImagePickerOpen(false)}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        ✕ Close
                      </button>
                    </div>
                    <MediaPicker
                      type="image"
                      value={currentSpace.mobile.imageUrl || ""}
                      onChange={(url) => {
                        generateAdCode("mobile", url);
                        setMobileImagePickerOpen(false);
                      }}
                      placeholder="Upload or choose mobile banner..."
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Changes Button matching Reference UI */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="bg-[#007bff] hover:bg-blue-600 text-white font-semibold text-sm px-6 py-2.5 rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
