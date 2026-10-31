"use client";

import React, { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdSpaceId, AdSpaceItem } from "@/types/ad-spaces";
import { cn } from "@/lib/utils";

interface AdBannerProps {
  space: AdSpaceId;
  className?: string;
}

function parseDimension(val?: string): string | undefined {
  if (!val) return undefined;
  const trimmed = val.trim();
  if (!trimmed || trimmed === "auto") return undefined;
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return `${trimmed}px`;
  }
  return trimmed;
}

function SafeHtmlRenderer({
  html,
  maxWidth,
  maxHeight,
  className,
}: {
  html: string;
  maxWidth?: string;
  maxHeight?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !html) return;

    // Check if html contains <script> tags and re-execute them
    const scripts = containerRef.current.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [html]);

  if (!html || !html.trim()) return null;

  return (
    <div
      ref={containerRef}
      style={{
        maxWidth: maxWidth || undefined,
        maxHeight: maxHeight || undefined,
      }}
      className={cn(
        "ad-content-wrapper flex items-center justify-center w-full max-w-full overflow-hidden [&_img]:max-w-full [&_img]:max-h-full [&_img]:w-auto [&_img]:h-auto [&_img]:object-contain [&_img]:mx-auto [&_img]:block [&_iframe]:max-w-full [&_iframe]:mx-auto [&_ins]:max-w-full [&_ins]:mx-auto [&_a]:inline-block [&_a]:max-w-full [&_a]:max-h-full",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function AdBanner({ space, className = "" }: AdBannerProps) {
  const { data: allSpaces } = useQuery<Record<AdSpaceId, AdSpaceItem>>({
    queryKey: ["ad-spaces"],
    queryFn: async () => {
      const res = await fetch("/api/ad-spaces");
      if (!res.ok) throw new Error("Failed to load ad spaces");
      const json = await res.json();
      return json.spaces || {};
    },
    staleTime: 5 * 60 * 1000,
  });

  const adConfig = allSpaces?.[space];

  if (!adConfig || !adConfig.isActive) {
    return null;
  }

  const desktopCode = adConfig.desktop?.adCode?.trim();
  const mobileCode = adConfig.mobile?.adCode?.trim();

  // If neither has ad code, return null to maintain original UI with zero gaps
  if (!desktopCode && !mobileCode) {
    return null;
  }

  const effectiveMobileCode = mobileCode || desktopCode;
  const effectiveDesktopCode = desktopCode || mobileCode;

  const desktopWidth = parseDimension(adConfig.desktop?.width);
  const desktopHeight = parseDimension(adConfig.desktop?.height);
  const mobileWidth = parseDimension(adConfig.mobile?.width);
  const mobileHeight = parseDimension(adConfig.mobile?.height);

  return (
    <aside
      aria-label={`Advertisement - ${adConfig.name}`}
      className={cn("ad-container w-full mx-auto my-1.5 overflow-hidden text-center transition-all", className)}
    >
      {/* Desktop Banner (>= 992px) */}
      {effectiveDesktopCode && (
        <div
          className="hidden min-[992px]:flex justify-center items-center w-full mx-auto"
          style={{
            maxWidth: desktopWidth || undefined,
            maxHeight: desktopHeight || undefined,
          }}
        >
          <SafeHtmlRenderer
            html={effectiveDesktopCode}
            maxWidth={desktopWidth}
            maxHeight={desktopHeight}
          />
        </div>
      )}

      {/* Mobile Banner (< 992px) */}
      {effectiveMobileCode && (
        <div
          className="flex min-[992px]:hidden justify-center items-center w-full mx-auto"
          style={{
            maxWidth: mobileWidth || undefined,
            maxHeight: mobileHeight || undefined,
          }}
        >
          <SafeHtmlRenderer
            html={effectiveMobileCode}
            maxWidth={mobileWidth}
            maxHeight={mobileHeight}
          />
        </div>
      )}
    </aside>
  );
}
