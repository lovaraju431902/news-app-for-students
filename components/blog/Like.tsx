"use client";

import React, { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toggleBlogLikeAction } from "@/app/actions/engagement";

const H = 40;
const RED = "#e5484d";
/* the confetti: a pair of dots per spoke, never the same colour
   twice in a pair */
const CONFETTI = [
  "#f48ea7",
  "#cc8ef5",
  "#8ce8c3",
  "#91d2fa",
  "#f5a524",
  "#e5484d",
  "#9fc7fa",
];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const fmt = (n: number) => n.toLocaleString("en-US");

function Roll({ value, up }: { value: number; up: boolean }) {
  const chars = fmt(value).split("");
  /* places counted from the right, so a new leading digit does
     not shift the keys of the ones already there */
  return (
    <span className="inline-flex items-center font-bold tabular-nums text-xs sm:text-sm select-none" aria-hidden="true">
      {chars.map((c, i) => {
        const place = chars.length - 1 - i;
        if (c === ",") return <span key={`c${place}`} className="inline-block px-[1px]">,</span>;
        return (
          <span key={`p${place}`} className="relative inline-flex h-5 w-[0.68em] overflow-hidden justify-center items-center">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={c}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ y: up ? "100%" : "-100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: up ? "-100%" : "100%", opacity: 0 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: place * 0.04 }}
              >
                {c}
              </motion.span>
            </AnimatePresence>
          </span>
        );
      })}
    </span>
  );
}

/* ── the effects ───────────────────────────────────────────
   Two ways for a like to land, one knob. Every one plays once
   per press from a layer keyed by the press, and every number
   in them is fixed rather than random: several copies share a
   wall and a bench, and must all do the same thing. */
export const EFFECTS = ["Bloom", "Firework"] as const;

/* a spread of fixed "random" numbers, one per particle */
const jit = (k: number, seed: number) => {
  const x = Math.sin(k * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function Burst({ fx, fly, ink }: { fx: string; fly: number; ink: boolean }) {
  const c = (k: number) => (ink ? "var(--lk-on)" : CONFETTI[k % CONFETTI.length]);

  if (fx === "Firework") {
    /* thrown up and out, then they fall: the x is steady, the y
       is its own element on a rise-then-drop curve */
    return (
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {Array.from({ length: 12 }, (_, k) => {
          const a = -Math.PI / 2 + (k / 11 - 0.5) * Math.PI * 1.25;
          const v = 22 + fly * 22 + jit(k, 7) * 10;
          const targetX = Math.cos(a) * v;
          const targetY = Math.sin(a) * v;
          return (
            <motion.span
              key={k}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{ background: c(k) }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.8 }}
              animate={{
                x: [0, targetX, targetX * 1.2],
                y: [0, targetY, targetY + 18],
                opacity: [1, 1, 0],
                scale: [0.8, 1.2, 0.2],
              }}
              transition={{
                duration: 0.6,
                delay: (jit(k, 8) * 60) / 1000,
                ease: "easeOut",
              }}
            />
          );
        })}
      </div>
    );
  }

  /* Bloom: a disc that hollows into a ring, and pairs of confetti */
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {/* Bloom expanding ring */}
      <motion.span
        className="absolute rounded-full border-2 border-[#e5484d]"
        initial={{ width: 10, height: 10, opacity: 0.9, scale: 0.5 }}
        animate={{ width: 44, height: 44, opacity: 0, scale: 1.4 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />
      {/* 7 Spoke confetti pairs radiating outward */}
      {Array.from({ length: 7 }, (_, k) => {
        const rad = (k * (360 / 7) - 90) * (Math.PI / 180);
        const dist1 = 18 * fly + 14;
        const dist2 = 28 * fly + 18;
        return (
          <React.Fragment key={k}>
            <motion.span
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{ background: c(k) }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
              animate={{
                x: Math.cos(rad) * dist1,
                y: Math.sin(rad) * dist1,
                opacity: [1, 1, 0],
                scale: [0.6, 1, 0.3],
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <motion.span
              className="absolute w-1 h-1 rounded-full"
              style={{ background: c(k + 3) }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
              animate={{
                x: Math.cos(rad) * dist2,
                y: Math.sin(rad) * dist2,
                opacity: [1, 1, 0],
                scale: [0.6, 1, 0],
              }}
              transition={{ duration: 0.55, delay: 0.05, ease: "easeOut" }}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}

export interface LikeProps {
  postId?: string;
  start?: number;
  effect?: "Bloom" | "Firework" | string;
  burst?: number;
  color?: string;
  corner?: number;
  initialLiked?: boolean;
  isAuthenticated?: boolean;
  className?: string;
}

export function Like({
  postId,
  start = 0,
  effect = "Bloom",
  burst = 50,
  color = "Red",
  corner = H / 2,
  initialLiked = false,
  isAuthenticated = false,
  className = "",
}: LikeProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(start);
  const [beat, setBeat] = useState(0);

  const fly = clamp(burst, 0, 100) / 100;
  const r = clamp(corner, 0, H / 2);
  const ink = color === "Ink";
  const fx = (EFFECTS as readonly string[]).includes(effect as any) ? effect : "Bloom";

  const press = async () => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      const currentUrl = typeof window !== "undefined" ? window.location.pathname : "";
      router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
      return;
    }

    if (!postId || isPending) return;

    // Optimistic update
    const next = !liked;
    const previousCount = likesCount;
    const newCount = next ? previousCount + 1 : Math.max(0, previousCount - 1);

    setLiked(next);
    setLikesCount(newCount);
    if (next) {
      setBeat((b) => b + 1);
    }

    // Server synchronization
    startTransition(async () => {
      try {
        const res = await toggleBlogLikeAction(postId);
        if (res.success && typeof res.liked === "boolean" && typeof res.likesCount === "number") {
          setLiked(res.liked);
          setLikesCount(res.likesCount);
        } else {
          // Rollback on server error
          setLiked(!next);
          setLikesCount(previousCount);
          if (!res.success && res.unauthorized) {
            router.push("/login");
          }
        }
      } catch (err) {
        // Rollback on network error
        setLiked(!next);
        setLikesCount(previousCount);
      }
    });
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        className={`relative inline-flex items-center gap-2 px-3.5 sm:px-4 select-none border transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e5484d] ${
          liked
            ? "border-[#e5484d]/30 bg-red-50/70 dark:bg-red-950/20 text-[#e5484d]"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700"
        }`}
        aria-pressed={liked}
        aria-label={`Like. ${fmt(likesCount)} likes`}
        disabled={isPending}
        style={{
          height: H,
          borderRadius: `${r}px`,
        }}
        onClick={press}
      >
        <span className="relative inline-flex items-center justify-center w-5 h-5 shrink-0">
          {/* Keyed by the press, so every like plays once */}
          <motion.span
            key={liked ? `on${beat}` : "off"}
            animate={liked ? { scale: [1, 1.35, 0.95, 1] } : { scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <Heart
              size={18}
              strokeWidth={2}
              className={liked ? "fill-[#e5484d] text-[#e5484d]" : "text-zinc-500 dark:text-zinc-400"}
            />
          </motion.span>

          {liked && fly > 0 && (
            <span key={beat} className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
              <Burst fx={fx} fly={fly} ink={ink} />
            </span>
          )}
        </span>

        <Roll value={likesCount} up={liked} />
      </motion.button>
    </div>
  );
}

export default Like;
