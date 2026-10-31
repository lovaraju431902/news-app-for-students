import React from "react";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumBadgeProps {
  className?: string;
  size?: "sm" | "md";
}

export function PremiumBadge({ className, size = "sm" }: PremiumBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-extrabold uppercase tracking-wider rounded shadow-xs bg-gradient-to-r from-amber-500 to-yellow-500 text-black select-none",
        size === "sm" ? "px-1.5 py-0.5 text-[9px]" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      <Crown className={size === "sm" ? "w-2.5 h-2.5 fill-black" : "w-3.5 h-3.5 fill-black"} />
      <span>Premium</span>
    </span>
  );
}
